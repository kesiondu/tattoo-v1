import { getStorage } from '@/modules/storage/service';

const MAX_REMOTE_IMAGE_BYTES = 20 * 1024 * 1024;

async function uploadToStorage(params: {
  body: Buffer | Uint8Array;
  contentType: string;
}): Promise<string | null> {
  const { body, contentType } = params;
  const ext = contentType.split('/')[1]?.replace('jpeg', 'jpg') || 'png';

  try {
    const storage = await getStorage();
    if (!storage) return null;
    const result = await storage.uploadFile({
      body,
      key: `tattoo/generated/${crypto.randomUUID()}.${ext}`,
      contentType,
      disposition: 'inline',
    });
    return result.success && result.url ? result.url : null;
  } catch (error) {
    console.error('tattoo result upload failed:', error);
    return null;
  }
}

/**
 * Persist a generated buffer. Without storage we keep the real image inline so
 * the result stays recoverable; production should configure R2.
 */
export async function uploadGeneratedImage(params: {
  body: Buffer | Uint8Array;
  contentType: string;
}): Promise<string> {
  const { body, contentType } = params;
  const stored = await uploadToStorage({ body, contentType });
  if (stored) return stored;

  const base64 = Buffer.from(body).toString('base64');
  return `data:${contentType};base64,${base64}`;
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

    return await uploadToStorage({
      body,
      contentType: response.headers.get('content-type') || 'image/png',
    });
  } catch (error) {
    console.error('tattoo remote image publish failed:', error);
    return null;
  }
}

/**
 * Copy a provider-hosted result into our own storage. Provider URLs (Kie in
 * particular) are often temporary, so the task must not depend on them.
 */
export async function persistRemoteImage(url: string): Promise<string> {
  const published = await publishRemoteImage(url);
  return published || url;
}
