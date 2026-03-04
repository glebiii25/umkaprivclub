// Базовый URL проекта (из supabase.env). Fallback, если Vite не подставил переменную.
const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ||
  'https://qyeeoavlrrvqcqngfgha.supabase.co';
const MEDIA_BUCKET = (import.meta.env.VITE_SUPABASE_MEDIA_BUCKET as string | undefined)?.trim() || 'storeages';

/** Base path for relative asset URLs (for base: './' — so media loads from nested routes). */
export function getMediaBaseUrl(pathname: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  if (base.startsWith('/') && base !== './') return base.replace(/\/?$/, '/');
  const segments = pathname.split('/').filter(Boolean);
  const depth = segments.length;
  return depth === 0 ? './' : '../'.repeat(depth);
}

/** Local/fallback URL for the same path (use in onError when Supabase URL fails). */
export function getMediaFallbackUrl(
  path: string,
  options?: { basePrefix?: string }
): string {
  const normalized = path.replace(/^\//, '');
  const base = options?.basePrefix ?? import.meta.env.BASE_URL ?? '';
  const baseSlash = base.endsWith('/') ? base : base ? `${base}/` : '';
  return `${baseSlash}${normalized}`;
}

/**
 * Build Supabase Storage public URL from env (does not depend on Supabase client).
 * Format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
 */
function getSupabasePublicMediaUrl(path: string): string {
  const base = SUPABASE_URL?.replace(/\/$/, '') ?? '';
  const bucket = (MEDIA_BUCKET ?? 'storeages').trim();
  const normalized = path.replace(/^\//, '');
  return `${base}/storage/v1/object/public/${bucket}/${normalized}`;
}

/**
 * All app media (images, videos) are loaded from the Supabase Storage bucket when configured.
 * Uses VITE_SUPABASE_URL + VITE_SUPABASE_MEDIA_BUCKET so media works even if Supabase client is not created.
 * If the Supabase URL returns 404, use onError and set src to getMediaFallbackUrl(path, options) to load from local.
 * @param path - Path like "/images/foo.png" or "images/foo.png" (must match object key in the bucket)
 * @param options.basePrefix - Optional prefix for fallback (e.g. getMediaBaseUrl(pathname) for nested routes)
 */
export function getMediaUrl(
  path: string,
  _options?: { basePrefix?: string }
): string {
  return getSupabasePublicMediaUrl(path);
}
