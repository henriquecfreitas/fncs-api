import * as SendGridMail from "@sendgrid/mail"

const ENV_SENDGRID_SENDER = "henriquecfreitas@hotmail.com.br"
const ENV_SENDGRID_API_KEY = ""

type EmailContent = {
  to: string
  subject: string
  text: string
  htlm?: string
}

export async function sendMail(content: EmailContent) {
  SendGridMail.setApiKey(ENV_SENDGRID_API_KEY)
  await SendGridMail.send({
    from: ENV_SENDGRID_SENDER,
    ...content,
  })
}
