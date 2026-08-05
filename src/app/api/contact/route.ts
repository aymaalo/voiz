import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(200),
  project: z.string().trim().max(80).optional().default(''),
  message: z.string().trim().min(1).max(5000),
  locale: z.enum(['fr', 'en']).optional().default('fr'),
  /** Honeypot — humans leave it empty; handled below rather than by the schema
      so a bot gets a plain 200 instead of a validation error to learn from. */
  company: z.string().max(200).optional(),
});

/**
 * Best-effort throttle. Serverless instances are not shared, so this only slows
 * down a burst from one warm instance — enough to blunt casual spam. Swap in
 * Upstash/Vercel KV if the form starts attracting real abuse.
 */
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const { name, email, project, message, locale, company } = parsed.data;

  // Honeypot tripped: accept silently so the bot does not learn anything.
  if (company) return NextResponse.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Not configured yet (e.g. local dev): log it and report success so the
    // front end can be exercised end to end without credentials.
    console.warn(
      '[contact] Email delivery is not configured — set RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL.',
      { name, email, project, locale },
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `VOIZ · nouveau message de ${name}${project ? ` (${project})` : ''}`,
      text: [
        `Nom     : ${name}`,
        `Email   : ${email}`,
        `Projet  : ${project || '—'}`,
        `Langue  : ${locale}`,
        '',
        message,
      ].join('\n'),
    });

    if (error) throw new Error(error.message);
  } catch (err) {
    console.error('[contact] delivery failed', err);
    return NextResponse.json({ error: 'delivery_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
