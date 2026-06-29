import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const PHOTO_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "album-photos";

let cached: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the service-role key. Bypasses RLS, so it
 * must never be imported into client components. Album privacy is enforced in
 * our own API/route handlers; photos live in a PRIVATE bucket and are served
 * via short-lived signed URLs.
 */
export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"
    );
  }
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

// Map of object path -> signed URL for the given storage paths.
export async function signedUrls(
  paths: string[],
  expiresIn = 3600
): Promise<Record<string, string>> {
  const unique = Array.from(new Set(paths.filter(Boolean)));
  if (unique.length === 0) return {};

  const { data, error } = await supabaseAdmin()
    .storage.from(PHOTO_BUCKET)
    .createSignedUrls(unique, expiresIn);

  if (error || !data) return {};

  const map: Record<string, string> = {};
  for (const item of data) {
    if (item.path && item.signedUrl) map[item.path] = item.signedUrl;
  }
  return map;
}
