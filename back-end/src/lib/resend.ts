import { Resend } from "resend";

/** Default from address when FROM_EMAIL is not set (Resend onboarding for testing) */
const DEFAULT_FROM = "Automation Flow <onboarding@resend.dev>";

function getResendClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(key);
}

function getFromEmail(): string {
  return process.env.FROM_EMAIL ?? DEFAULT_FROM;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const { to, subject, text, html } = options;
  const resend = getResendClient();
  const from = getFromEmail();
  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    ...(html ? { html } : {}),
    ...(text ? { text } : {}),
  });
  if (error) {
    throw new Error(`Resend send failed: ${JSON.stringify(error)}`);
  }
}
