import nodemailer from 'nodemailer'

export interface ContactPayload {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

const BRAND = {
  ink: '#0d0c0a',
  gold: '#A66B45',
  stone: '#ede8e1',
  muted: '#8a8278',
  siteUrl: 'https://skidmosa.com',
} as const

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

function buildPlainText(data: ContactPayload): string {
  return [
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '  NEW SKIDMO WEBSITE INQUIRY',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    `Name     ${data.name}`,
    `Email    ${data.email}`,
    `Phone    ${data.phone}`,
    `Service  ${data.service}`,
    '',
    'Message',
    '───────',
    data.message,
    '',
    '──────────────────────────────',
    'Reply to this email to respond directly to the customer.',
    BRAND.siteUrl,
  ].join('\n')
}

function fieldRow(label: string, value: string, valueHtml?: string): string {
  return `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #ddd6cc;width:120px;vertical-align:top;">
        <span style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.muted};">${label}</span>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #ddd6cc;vertical-align:top;">
        <span style="font-size:15px;color:${BRAND.ink};line-height:1.5;">${valueHtml ?? escapeHtml(value)}</span>
      </td>
    </tr>`
}

function buildHtmlEmail(data: ContactPayload, siteUrl: string): string {
  const phoneDigits = digitsOnly(data.phone)
  const messageHtml = escapeHtml(data.message).replace(/\n/g, '<br>')
  const submitted = new Date().toLocaleString('en-SA', {
    timeZone: 'Asia/Riyadh',
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const firstName = escapeHtml(data.name.split(' ')[0] || 'customer')
  const replySubject = encodeURIComponent(`Re: SKIDMO — ${data.service}`)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>SKIDMO Inquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#ebe6df;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#ebe6df;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #ddd6cc;overflow:hidden;">

          <tr>
            <td style="background:${BRAND.ink};padding:28px 32px;text-align:center;">
              <p style="margin:0 0 6px;font-size:28px;font-weight:700;letter-spacing:0.18em;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">SKIDMO</p>
              <p style="margin:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.gold};font-family:Arial,Helvetica,sans-serif;">SKIDMO — a venture by Colmo</p>
            </td>
          </tr>

          <tr>
            <td style="height:3px;background:${BRAND.gold};font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <tr>
            <td style="padding:28px 32px 8px;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.gold};">New inquiry</p>
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:600;color:${BRAND.ink};font-family:Georgia,'Times New Roman',serif;">${escapeHtml(data.service)}</h1>
              <p style="margin:0;font-size:13px;color:${BRAND.muted};">Received ${submitted} (Riyadh)</p>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.stone};border:1px solid #ddd6cc;">
                ${fieldRow('Name', data.name)}
                ${fieldRow('Email', data.email, `<a href="mailto:${escapeHtml(data.email)}" style="color:${BRAND.ink};text-decoration:underline;">${escapeHtml(data.email)}</a>`)}
                ${fieldRow('Phone', data.phone, `<a href="tel:${phoneDigits}" style="color:${BRAND.ink};text-decoration:underline;">${escapeHtml(data.phone)}</a>`)}
                ${fieldRow('Service', data.service)}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 28px;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.muted};">Message</p>
              <div style="padding:16px 18px;background:#faf7f3;border-left:3px solid ${BRAND.gold};font-size:15px;line-height:1.65;color:${BRAND.ink};">
                ${messageHtml}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 32px;font-family:Arial,Helvetica,sans-serif;" align="center">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-right:8px;">
                    <a href="mailto:${escapeHtml(data.email)}?subject=${replySubject}"
                       style="display:inline-block;padding:12px 22px;background:${BRAND.ink};color:#ffffff;font-size:13px;font-weight:600;text-decoration:none;letter-spacing:0.04em;">
                      Reply to customer
                    </a>
                  </td>
                  <td style="padding-left:8px;">
                    <a href="tel:${phoneDigits}"
                       style="display:inline-block;padding:12px 22px;background:transparent;color:${BRAND.ink};font-size:13px;font-weight:600;text-decoration:none;border:1px solid ${BRAND.ink};">
                      Call ${firstName}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px;background:#faf7f3;border-top:1px solid #ddd6cc;text-align:center;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 4px;font-size:12px;color:${BRAND.muted};">
                Sent from the contact form at
                <a href="${siteUrl}/contact" style="color:${BRAND.gold};text-decoration:none;">skidmosa.com</a>
              </p>
              <p style="margin:0;font-size:11px;color:#a39e97;">SKIDMO — a venture by Colmo</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
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
  const siteUrl = (env.VITE_SITE_URL || BRAND.siteUrl).replace(/\/$/, '')

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
    text: buildPlainText(data),
    html: buildHtmlEmail(data, siteUrl),
  })
}
