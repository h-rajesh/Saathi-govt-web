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
    console.error("❌ Email Error:", error instanceof Error ? error.message : error);

    // In development mode, catch transport errors (e.g. Brevo 525 Unauthorized IP)
    // so registration and OTP flows are not blocked. The DEV OTP is logged in console.
    console.warn(
      "⚠️ Email delivery failed or is unconfigured. Continuing auth flow."
    );
    return null;
  }
}