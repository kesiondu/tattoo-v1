import { and, eq, inArray, isNull } from 'drizzle-orm';

import { db } from '@/core/db';
import { order } from '@/config/db/schema';
import { listLifetimeProProducts } from '@/config/pricing';

/**
 * Lifetime Pro is derived from paid bundle orders instead of a separate
 * entitlement table: a refund moves the order to `refunded`, which revokes the
 * benefit in the same state change. The unique paid order also makes duplicate
 * payment callbacks harmless — they cannot add a second entitlement.
 */
export async function hasLifetimePro(userId: string): Promise<boolean> {
  const productIds = listLifetimeProProducts().map((p) => p.productId);
  if (!userId || productIds.length === 0) return false;

  const [row] = await db()
    .select({ id: order.id })
    .from(order)
    .where(
      and(
        eq(order.userId, userId),
        eq(order.status, 'paid'),
        inArray(order.productId, productIds),
        isNull(order.deletedAt)
      )
    )
    .limit(1);

  return Boolean(row);
}

export async function getEntitlements(userId: string) {
  return { lifetimePro: await hasLifetimePro(userId) };
}
