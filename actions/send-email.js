"use server"

import { render, renderAsync } from "@react-email/components"
import { Resend } from "resend"


export async function sendEmail({to, subject, react}) {
    const resend = new Resend(process.env.RESEND_API_KEY || "")
    
    try{
        const html = render(react)
        const data = await resend.emails.send({
            from: 'Balance AI Finance <onboarding@resend.dev>',
            to,
            subject,
            react
          })

          return {success: true, data}
    } catch (err) {
        throw new Error(err.message)
    }
}