import { getStorage } from '@/modules/storage/service';

const MAX_REMOTE_IMAGE_BYTES = 20 * 1024 * 1024;
const GENERATED_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
]);

function normalizedImageType(value: string): string | null {
  const contentType = value.split(';', 1)[0]?.trim().toLowerCase();
  return contentType && GENERATED_IMAGE_TYPES.has(contentType)
    ? contentType
    : null;
}

async function uploadToStorage(params: {
  body: Buffer | Uint8Array;
  contentType: string;
  taskId?: string;
}): Promise<StoredTattooImage | null> {
  const { body, taskId } = params;
  const contentType = normalizedImageType(params.contentType);
  if (!contentType) return null;
  const ext = contentType.split('/')[1]?.replace('jpeg', 'jpg') || 'png';

  try {
    const storage = await getStorage();
    if (!storage) return null;
    const storageKey = `tattoo/generated/${taskId || crypto.randomUUID()}.${ext}`;
    const result = await storage.uploadFile({
      body,
      key: storageKey,
      contentType,
      disposition: 'inline',
    });
    return result.success
      ? {
          url: taskId
            ? `/api/tattoo/tasks/${encodeURIComponent(taskId)}/image`
            : result.url || '',
          storageKey,
          contentType,
        }
      : null;
  } catch (error) {
    console.error('tattoo result upload failed:', error);
    return null;
  }
}

export interface StoredTattooImage {
  url: string;
  storageKey: string;
  contentType: string;
}

/**
 * Persist a generated buffer before a task may be marked successful. Generated
 * images must never be stored as large data URLs in D1 or left on a provider's
 * expiring host.
 */
export async function uploadGeneratedImage(params: {
  body: Buffer | Uint8Array;
  contentType: string;
  taskId: string;
}): Promise<StoredTattooImage> {
  const { body, contentType, taskId } = params;
  const stored = await uploadToStorage({ body, contentType, taskId });
  if (stored) return stored;
  throw new Error(
    'Generated image storage is unavailable. Configure R2 and retry the task.'
  );
}

/**
 * Fetch an image and copy it into our storage, returning its durable public
 * URL. Returns null when storage is not configured or the copy fails.
 */
export async function publishRemoteImage(url: string): Promise<string | null> {
  if (!/^https?:\/\//i.test(url)) return null;

  try {
    const storage = await getStorage();
    if (!storage) return null;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(60_000),
    });
    if (!response.ok) return null;

    const declaredLength = Number(response.headers.get('content-length') || 0);
    if (declaredLength > MAX_REMOTE_IMAGE_BYTES) return null;

    const body = Buffer.from(await response.arrayBuffer());
    if (body.byteLength > MAX_REMOTE_IMAGE_BYTES) return null;

    const contentType = normalizedImageType(
      response.headers.get('content-type') || ''
    );
    if (!contentType) return null;

    const stored = await uploadToStorage({
      body,
      contentType,
    });
    return stored?.url || null;
  } catch (error) {
    console.error('tattoo remote image publish failed:', error);
    return null;
  }
}

/**
 * Copy a provider-hosted result into our own storage. Provider URLs (Kie in
 * particular) are often temporary, so the task must not depend on them.
 */
export async function persistRemoteImage(
  url: string,
  taskId: string
): Promise<StoredTattooImage> {
  if (!/^https?:\/\//i.test(url)) {
    throw new Error('The AI provider returned an invalid image URL.');
  }

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
    if (!response.ok)
      throw new Error(`Image download failed: ${response.status}`);
    const declaredLength = Number(response.headers.get('content-length') || 0);
    if (declaredLength > MAX_REMOTE_IMAGE_BYTES) {
      throw new Error('Generated image is too large to archive.');
    }
    const body = Buffer.from(await response.arrayBuffer());
    if (body.byteLength > MAX_REMOTE_IMAGE_BYTES) {
      throw new Error('Generated image is too large to archive.');
    }
    const contentType = normalizedImageType(
      response.headers.get('content-type') || ''
    );
    if (!contentType)
      throw new Error('Provider result is not a supported image.');
    const stored = await uploadToStorage({ body, contentType, taskId });
    if (stored) return stored;
  } catch (error) {
    console.error('tattoo generated image archive failed:', error);
  }
  throw new Error(
    'Generated image could not be archived. The task remains pending and can be retried.'
  );
}

export async function downloadStoredImage(storageKey: string) {
  const storage = await getStorage();
  if (!storage) return null;
  const result = await storage.downloadFile({ key: storageKey });
  if (!result.success || !result.body) return null;
  return {
    body: result.body,
    contentType: normalizedImageType(result.contentType || '') || 'image/png',
  };
}
