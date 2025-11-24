export async function GET(){
  // Stub: Nightly inbox ingest (configure via Vercel Cron).
  // Expect IMAP/Gmail creds in env; parse attachments and persist somewhere (not included).
  return new Response(JSON.stringify({ ok: true, note: "Stub endpoint — wire your inbox/IMAP here." }), { headers: { "content-type":"application/json" } });
}
