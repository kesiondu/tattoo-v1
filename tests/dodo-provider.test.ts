import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { test } from 'node:test';

import { DodoProvider } from '../src/core/payment/dodo';
import { PaymentEventType } from '../src/core/payment/types';

const signingKey = `whsec_${Buffer.from('dodo-webhook-test-key').toString('base64')}`;
const payload = JSON.stringify({
  type: 'payment.succeeded',
  data: {
    status: 'succeeded',
    checkout_session_id: 'cs_test_123',
    payment_id: 'pay_test_123',
    total_amount: 200,
    currency: 'USD',
  },
});

function signedRequest(body = payload, signature?: string) {
  const id = 'msg_test_123';
  const timestamp = String(Math.floor(Date.now() / 1000));
  const secret = signingKey.replace('whsec_', '');
  const expected = createHmac('sha256', Buffer.from(secret, 'base64'))
    .update(`${id}.${timestamp}.${body}`)
    .digest('base64');
  return new Request('https://example.test/api/payment/notify/dodo', {
    method: 'POST',
    headers: {
      'webhook-id': id,
      'webhook-timestamp': timestamp,
      'webhook-signature': signature || `v1,${expected}`,
    },
    body,
  });
}

test('Dodo provider accepts a correctly signed payment success webhook', async () => {
  const provider = new DodoProvider({
    apiKey: 'test-key',
    webhookKey: signingKey,
  });
  const event = await provider.getPaymentEvent({ req: signedRequest() });

  assert.equal(event.eventType, PaymentEventType.PAYMENT_SUCCESS);
  assert.equal(event.paymentSession?.paymentResult.id, 'cs_test_123');
  assert.equal(
    event.paymentSession?.paymentInfo?.transactionId,
    'pay_test_123'
  );
});

test('Dodo provider rejects a webhook with an invalid signature', async () => {
  const provider = new DodoProvider({
    apiKey: 'test-key',
    webhookKey: signingKey,
  });
  await assert.rejects(
    () =>
      provider.getPaymentEvent({ req: signedRequest(payload, 'v1,invalid') }),
    /Invalid Dodo webhook signature/
  );
});
