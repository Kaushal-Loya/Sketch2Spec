import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // avoid throwing at import time so Next.js pre-rendering doesn't fail; functions will throw when used
  console.warn("Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
}

export const supabase: SupabaseClient | null = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export async function uploadFile(bucket: string, path: string, file: File | Blob) {
  if (!supabase) throw new Error('Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  const { data, error } = await supabase.storage.from(bucket).upload(path, file as any, { upsert: true });
  if (error) throw error;
  const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  return { data, publicUrl };
}

export function getPublicUrl(bucket: string, path: string) {
  if (!supabase) throw new Error('Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function createSignedUrl(bucket: string, path: string, expiresIn = 60) {
  if (!supabase) throw new Error('Missing Supabase environment variables. Set SUPABASE_SERVICE_ROLE_KEY on server for signed URLs.');
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

export default supabase;