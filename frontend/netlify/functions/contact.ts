import type { Handler } from '@netlify/functions'
import { sendContactEmail, type ContactPayload } from '../../lib/sendContactEmail'

function parseBody(body: string | null): ContactPayload {
  if (!body) throw new Error('Missing request body')
  const data = JSON.parse(body) as Partial<ContactPayload>
  if (!data.name?.trim()) throw new Error('Name is required')
  if (!data.email?.trim()) throw new Error('Email is required')
  if (!data.phone?.trim()) throw new Error('Phone is required')
  if (!data.service?.trim()) throw new Error('Service is required')
  if (!data.message?.trim()) throw new Error('Message is required')
  return {
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    service: data.service.trim(),
    message: data.message.trim(),
  }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const payload = parseBody(event.body)
    await sendContactEmail(payload, process.env as Record<string, string | undefined>)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    }
  } catch (error) {
    console.error('Contact email failed:', error)
    const message = error instanceof Error ? error.message : 'Failed to send message'
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: message }),
    }
  }
}
