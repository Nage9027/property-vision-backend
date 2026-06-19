import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@2.0.0';

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: Record<string, unknown>;
  schema: string;
  old_record?: Record<string, unknown>;
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') ?? '';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'notifications@propertyvision.com';

const resend = new Resend(RESEND_API_KEY);

function getSubject(table: string, record: Record<string, unknown>): string {
  switch (table) {
    case 'leads':
      return `New Lead: ${record.name ?? 'Unknown'} - ${record.phone ?? ''}`;
    case 'contact_submissions':
      return `New Contact Request: ${record.name ?? 'Unknown'} - ${record.phone ?? ''}`;
    case 'profiles':
      return `New User Signup: ${record.name ?? record.email ?? 'Unknown'}`;
    default:
      return `Notification from Property Vision: ${table}`;
  }
}

function getHtmlContent(table: string, record: Record<string, unknown>): string {
  const rows = Object.entries(record)
    .filter(([key]) => !['id', 'created_at', 'updated_at'].includes(key))
    .map(([key, value]) => {
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;color:#555;text-transform:capitalize;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${value ?? '\u2014'}</td></tr>`;
    })
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#081120,#0a2540);padding:24px;border-radius:12px 12px 0 0;">
        <h1 style="color:#c6a43f;margin:0;font-size:20px;">Property Vision</h1>
        <p style="color:white;margin:8px 0 0;font-size:14px;opacity:0.8;">Admin Notification</p>
      </div>
      <div style="background:white;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px;padding:24px;">
        <h2 style="color:#081120;font-size:18px;margin:0 0 16px;">${getSubject(table, record)}</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${rows}
        </table>
        <p style="color:#999;font-size:12px;margin-top:24px;padding-top:16px;border-top:1px solid #eee;">
          This notification was sent automatically from Property Vision Launchpad.
        </p>
      </div>
    </div>
  `;
}

serve(async (req) => {
  try {
    const payload: WebhookPayload = await req.json();

    if (!RESEND_API_KEY || !ADMIN_EMAIL) {
      console.error('Missing RESEND_API_KEY or ADMIN_EMAIL');
      return new Response('Missing configuration', { status: 500 });
    }

    const subject = getSubject(payload.table, payload.record);
    const html = getHtmlContent(payload.table, payload.record);

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
