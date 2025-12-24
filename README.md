# Sketch2Spec  

## Migrating from Firebase to Supabase (Storage) ✅

This project was originally using Firebase for storage. It has been migrated to **Supabase** for file storage. Key steps and notes:

- Install the Supabase client locally: `npm i @supabase/supabase-js`.
- Required environment variables (set locally and in your deployment platform):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - (Optional, server-only) `SUPABASE_SERVICE_ROLE_KEY` for server-side privileged operations
- This project now demonstrates an image-first workflow using **Cloudinary** for direct uploads and CDN delivery. Create a Cloudinary account and set the following env vars in `.env.local`:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET` (server-only)

- A server signing route is available at `POST /api/cloudinary/sign` and `ImageUpload` uses that route to perform signed uploads to the `sketches` folder.
- (Legacy) Supabase helpers still exist in `lib/supabase.ts` if you prefer to use Supabase storage instead.
- The old `lib/firebase.tsx` was stubbed (kept as a small placeholder) and the Firebase package removed from `package.json`.

Provider generation/fallback notes

- Provider calls return the first successful result; if all fail, a combined provider error is returned.
- You can enable or disable fallback in the UI when converting images (default: fallback ON).
- Config:
  - Gemini: set `GEMINI_API_KEY` (or use a Google service account flow — see below) and optionally `GEMINI_MODEL`.
  - Gemini: set `GEMINI_API_KEY` (vision-capable token) and optionally `GEMINI_MODEL` (e.g., `gemini-image-1`).

Provider auth notes (short):
- Gemini (Google): this integration fetches the image server-side and sends the image bytes as inline_data to the Gemini `generateContent` endpoint so Gemini can actually see and analyze the screenshot. You can provide a bearer token in `GEMINI_API_KEY` or ask me to implement a service-account-based token exchange.

Logging & admin endpoint

- The server keeps an in-memory log of recent generation requests and which provider was used or failed. Logs are stored only in-memory (not persisted) and are capped (default 200 entries).
- Admin endpoint: `GET /api/admin/provider-logs` returns recent logs. Protect it with `ADMIN_API_KEY` (pass via `x-admin-key` header).
  - Example: `curl -H "x-admin-key: <your key>" http://localhost:3000/api/admin/provider-logs`.

Retries & backoff

- Provider calls use exponential backoff with jitter and will retry up to 3 attempts by default. This helps for transient network errors.

Security note

- Admin key and provider API keys must be stored in `.env.local` and kept secret. The in-memory logs purposely do not store secrets, but may include provider error messages returned from providers; avoid using sensitive tokens in request payloads.


Testing checklist:
1. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.
2. Start the dev server and try uploading an image from the dashboard.
3. Verify the uploaded file appears in the Supabase storage bucket and the public URL works.
4. If you prefer private files, implement server-side signed-url generation with `SUPABASE_SERVICE_ROLE_KEY`.

If you want, I can also add a small script or API route to proxy signed URL creation or to validate uploads on the server.
