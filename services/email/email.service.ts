import transporter from "@/lib/nodemailer";

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailProps) {
  try {
    console.log("📧 Sending email to:", to);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error(
      "❌ Email Error:",
      error instanceof Error
        ? error.message
        : error
    );

    throw new Error(
      error instanceof Error
        ? `Email delivery failed: ${error.message}`
        : "Email delivery failed."
    );
  }
}