import { createFileRoute } from '@tanstack/react-router';
import { downloadStoredImage } from '@/server/tattoo/storage';
import { getTattooTaskArtworkStorage } from '@/server/tattoo/tasks';

import { getAuth } from '@/core/auth';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';

async function GET({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return new Response('Unauthorized', { status: 401 });

  const limited = enforceMinIntervalRateLimit(request, {
    intervalMs: 250,
    keyPrefix: 'tattoo-task-artwork',
    extraKey: session.user.id,
  });
  if (limited) return limited;

  const media = await getTattooTaskArtworkStorage(session.user.id, params.id);
  if (!media) return new Response('Not found', { status: 404 });
  const stored = await downloadStoredImage(media.storageKey);
  if (!stored) return new Response('Image unavailable', { status: 503 });

  return new Response(stored.body, {
    headers: {
      'Content-Type': stored.contentType || media.contentType,
      'Cache-Control': 'private, max-age=300',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export const Route = createFileRoute('/api/tattoo/tasks/$id/artwork')({
  server: { handlers: { GET } },
});
