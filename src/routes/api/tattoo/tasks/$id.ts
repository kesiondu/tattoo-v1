import { createFileRoute } from '@tanstack/react-router';
import { getTattooTask } from '@/server/tattoo/tasks';

import { getAuth } from '@/core/auth';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';

async function GET({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const limited = enforceMinIntervalRateLimit(request, {
      intervalMs: 1000,
      keyPrefix: 'tattoo-task',
      extraKey: session.user.id,
    });
    if (limited) return limited;

    const task = await getTattooTask(session.user.id, params.id);
    if (!task) return respErr('Design not found');
    return respData(task);
  } catch (error: any) {
    return respErr(error.message || 'Failed to load design');
  }
}

export const Route = createFileRoute('/api/tattoo/tasks/$id')({
  server: {
    handlers: { GET },
  },
});
