import nodemailer from 'nodemailer'

export interface ContactPayload {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendContactEmail(
  data: ContactPayload,
  env: Record<string, string | undefined>
): Promise<void> {
  const host = env.SMTP_HOST
  const user = env.SMTP_USER
  const pass = env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error('SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.')
  }

  const port = Number(env.SMTP_PORT || 587)
  const secure = env.SMTP_SECURE === 'true' || port === 465
  const from = env.SMTP_FROM || user
  const to = env.SMTP_TO || from

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })

  const subject = `SKIDMO Inquiry: ${data.service} — ${data.name}`

  await transporter.sendMail({
    from: `"SKIDMO Website" <${from}>`,
    to,
    replyTo: data.email,
    subject,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Service: ${data.service}`,
      '',
      data.message,
    ].join('\n'),
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
      <p><strong>Service:</strong> ${escapeHtml(data.service)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
    `,
  })
}
