import { createFileRoute } from '@tanstack/react-router';
import { listTattooTasks } from '@/server/tattoo/tasks';

import { getAuth } from '@/core/auth';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';

async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const limited = enforceMinIntervalRateLimit(request, {
      intervalMs: 500,
      keyPrefix: 'tattoo-tasks',
      extraKey: session.user.id,
    });
    if (limited) return limited;

    return respData(await listTattooTasks(session.user.id));
  } catch (error: any) {
    return respErr(error.message || 'Failed to load designs');
  }
}

export const Route = createFileRoute('/api/tattoo/tasks')({
  server: {
    handlers: { GET },
  },
});
