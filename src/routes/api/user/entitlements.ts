import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { getEntitlements } from '@/modules/entitlements/service';
import { respData, respErr } from '@/lib/resp';

async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    return respData(await getEntitlements(session.user.id));
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/user/entitlements')({
  server: {
    handlers: { GET },
  },
});
