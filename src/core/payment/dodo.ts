import {
  CheckoutSession,
  PaymentConfigs,
  PaymentEvent,
  PaymentEventType,
  PaymentOrder,
  PaymentProvider,
  PaymentSession,
  PaymentStatus,
  WebhookIgnoredError,
} from './types';

export interface DodoConfigs extends PaymentConfigs {
  apiKey: string;
  webhookKey?: string;
  environment?: 'test_mode' | 'live_mode';
}

/** Hosted-checkout integration for Dodo Payments.
 * @see https://docs.dodopayments.com/developer-resources/integration-guide
 */
export class DodoProvider implements PaymentProvider {
  readonly name = 'dodo';
  configs: DodoConfigs;
  private readonly baseUrl: string;

  constructor(configs: DodoConfigs) {
    this.configs = configs;
    this.baseUrl =
      configs.environment === 'live_mode'
        ? 'https://live.dodopayments.com'
        : 'https://test.dodopayments.com';
  }

  async createPayment({
    order,
  }: {
    order: PaymentOrder;
  }): Promise<CheckoutSession> {
    if (!order.productId) throw new Error('Dodo productId is required');
    const payload = {
      product_cart: [
        { product_id: order.productId, quantity: order.quantity || 1 },
      ],
      customer: order.customer?.email
        ? {
            email: order.customer.email,
            name: order.customer.name || undefined,
          }
        : undefined,
      return_url: order.successUrl,
      cancel_url: order.cancelUrl,
      discount_codes: order.discount ? [order.discount.code] : undefined,
      metadata: { ...(order.metadata || {}), order_no: order.orderNo || '' },
    };
    const result = await this.request('/checkouts', 'POST', payload);
    if (!result.session_id || !result.checkout_url) {
      throw new Error('Dodo did not return a checkout session URL');
    }
    return {
      provider: this.name,
      checkoutParams: payload,
      checkoutInfo: {
        sessionId: result.session_id,
        checkoutUrl: result.checkout_url,
      },
      checkoutResult: result,
      metadata: payload.metadata,
    };
  }

  async getPaymentSession({
    sessionId,
  }: {
    sessionId: string;
  }): Promise<PaymentSession> {
    const result = await this.request(
      `/checkouts/${encodeURIComponent(sessionId)}`,
      'GET'
    );
    return this.toPaymentSession(result, sessionId);
  }

  async getPaymentEvent({ req }: { req: Request }): Promise<PaymentEvent> {
    const rawBody = await req.text();
    if (!rawBody || !this.configs.webhookKey) {
      throw new Error('Dodo webhook signing key is not configured');
    }
    await this.verifyWebhook(rawBody, {
      id: req.headers.get('webhook-id') || '',
      signature: req.headers.get('webhook-signature') || '',
      timestamp: req.headers.get('webhook-timestamp') || '',
    });
    const event = JSON.parse(rawBody) as {
      type?: string;
      data?: Record<string, unknown>;
    };
    const data = event.data || {};
    switch (event.type) {
      case 'payment.succeeded':
        return {
          eventType: PaymentEventType.PAYMENT_SUCCESS,
          eventResult: event,
          paymentSession: this.toPaymentSession(data, this.checkoutId(data)),
        };
      case 'payment.failed':
        return {
          eventType: PaymentEventType.PAYMENT_FAILED,
          eventResult: event,
        };
      case 'payment.cancelled':
        return {
          eventType: PaymentEventType.CHECKOUT_SUCCESS,
          eventResult: event,
        };
      default:
        throw new WebhookIgnoredError(
          `No handler for Dodo event: ${event.type || 'unknown'}`
        );
    }
  }

  private toPaymentSession(payload: any, checkoutId?: string): PaymentSession {
    const status = String(payload.status || '').toLowerCase();
    if (status && !['succeeded', 'paid', 'completed'].includes(status)) {
      throw new Error(`Dodo payment is not complete: ${status}`);
    }
    const sessionId = checkoutId || this.checkoutId(payload);
    if (!sessionId)
      throw new Error('Dodo payment is missing its checkout session id');
    const paymentId =
      payload.payment_id || payload.id || payload.transaction_id;
    return {
      provider: this.name,
      paymentStatus: PaymentStatus.SUCCESS,
      paymentInfo: {
        transactionId: paymentId,
        amount: payload.total_amount ?? payload.amount ?? 0,
        currency: String(payload.currency || '').toLowerCase(),
        paymentAmount: payload.total_amount ?? payload.amount ?? 0,
        paymentCurrency: String(payload.currency || '').toLowerCase(),
        paymentEmail: payload.customer?.email,
        paymentUserName: payload.customer?.name,
        paymentUserId: payload.customer?.customer_id || payload.customer_id,
        paidAt: payload.created_at ? new Date(payload.created_at) : undefined,
        invoiceId: payload.invoice_id,
        invoiceUrl: payload.invoice_url,
      },
      // Settlement matches this value to the locally stored checkout session id.
      paymentResult: { ...payload, id: sessionId, dodo_payment_id: paymentId },
      metadata: payload.metadata,
    };
  }

  private checkoutId(payload: Record<string, any>): string | undefined {
    return (
      payload.checkout_session_id ||
      payload.checkout_id ||
      payload.metadata?.checkout_session_id
    );
  }

  private async request(
    path: string,
    method: string,
    body?: unknown
  ): Promise<any> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.configs.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(
        `Dodo API request failed (${response.status})${detail ? `: ${detail.slice(0, 300)}` : ''}`
      );
    }
    return response.json();
  }

  private async verifyWebhook(
    body: string,
    headers: { id: string; signature: string; timestamp: string }
  ) {
    if (!headers.id || !headers.signature || !headers.timestamp)
      throw new Error('Invalid Dodo webhook headers');
    const timestamp = Number(headers.timestamp);
    if (
      !Number.isFinite(timestamp) ||
      Math.abs(Date.now() / 1000 - timestamp) > 5 * 60
    ) {
      throw new Error('Expired Dodo webhook timestamp');
    }
    const secret = this.configs.webhookKey!.replace(/^whsec_/, '');
    const key = await crypto.subtle.importKey(
      'raw',
      this.fromBase64(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signed = `${headers.id}.${headers.timestamp}.${body}`;
    const expected = new Uint8Array(
      await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signed))
    );
    const signatures = headers.signature
      .split(' ')
      .map((entry) => entry.trim().split(','))
      .filter(([version]) => version === 'v1')
      .map(([, value]) => value);
    const valid = signatures.some((signature) =>
      this.safeEqual(expected, this.fromBase64(signature))
    );
    if (!valid) throw new Error('Invalid Dodo webhook signature');
  }

  private fromBase64(value: string): Uint8Array {
    const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  }

  private safeEqual(left: Uint8Array, right: Uint8Array): boolean {
    if (left.length !== right.length) return false;
    let diff = 0;
    for (let index = 0; index < left.length; index += 1)
      diff |= left[index]! ^ right[index]!;
    return diff === 0;
  }
}

export function createDodoProvider(configs: DodoConfigs): DodoProvider {
  return new DodoProvider(configs);
}
