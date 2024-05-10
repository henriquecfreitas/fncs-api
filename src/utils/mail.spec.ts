import * as SendGridMail from "@sendgrid/mail"
import { sendMail } from "./mail"

describe("Mail utils: sendMail", () => {
  const sendMailSpy = jest.spyOn(SendGridMail, "send")
  const setApiKeySpy = jest.spyOn(SendGridMail, "setApiKey")

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("Should set API Key and send email", async () => {
    const to = "mock@email.com"
    const subject = "Mock Subject"
    const text = "Mock text"
    const html = "Mock <i>HTML</i>"

    await sendMail({ to, subject, text, html })
    const sendCallArgs = sendMailSpy.mock
      .calls[0][0] as SendGridMail.MailDataRequired

    expect(setApiKeySpy).toHaveBeenCalled()
    expect(sendCallArgs.to).toBe(to)
    expect(sendCallArgs.subject).toBe(subject)
    expect(sendCallArgs.text).toBe(text)
    expect(sendCallArgs.html).toBe(html)
  })
})
