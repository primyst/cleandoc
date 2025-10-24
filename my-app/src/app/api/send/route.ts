import { Resend } from 'resend'
import { EmailTemplate } from '@/components/email-template'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json()

    const { data, error } = await resend.emails.send({
      from: 'CleanDoc <onboarding@resend.dev>',
to: email,
      subject: 'Welcome to CleanDoc 🧼',
      react: EmailTemplate({ firstName: name }),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}