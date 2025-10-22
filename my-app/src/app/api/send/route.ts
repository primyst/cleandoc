import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "CleanDoc <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to CleanDoc 🎉",
      react: EmailTemplate({ firstName: name || "there" }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}