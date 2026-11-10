import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromEmail =
  process.env.RESEND_FROM_EMAIL || "BookNook <onboarding@resend.dev>";

// Verified account owner for Resend free tier testing
const RESEND_TEST_OWNER = "sazzad96741236@gmail.com";

function resolveRecipient(targetEmail: string): string {
  // When using Resend default sandbox domain (onboarding@resend.dev), Resend strictly
  // requires sending to the account owner's email address.
  // In sandbox mode, safely route testing emails to the account owner so they are always delivered.
  if (fromEmail.includes("onboarding@resend.dev")) {
    return RESEND_TEST_OWNER;
  }
  return targetEmail;
}

// Send password reset email using Resend
export async function sendPasswordResetEmail({
  to,
  userName,
  resetUrl,
}: {
  to: string;
  userName?: string | null;
  resetUrl: string;
}) {
  if (!resend) {
    console.warn(`[BookNook] RESEND_API_KEY is missing. Reset URL: ${resetUrl}`);
    return;
  }

  const name = userName || "Reader";
  const recipient = resolveRecipient(to);
  const isRedirected = recipient !== to;

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password - BookNook</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1F2A44;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4F1EA; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 560px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E6E1D6;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #1F2A44; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; color: #FFFFFF;">
                Book<span style="color: #E0A526;">Nook</span>
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #E0A526; font-weight: 600; text-transform: uppercase;">
                Cozy Modern Reading Lounge
              </p>
            </td>
          </tr>

          ${
            isRedirected
              ? `
          <!-- Sandbox Mode Banner -->
          <tr>
            <td style="background-color: #FEF3C7; padding: 12px 24px; text-align: center; border-bottom: 1px solid #FDE68A;">
              <p style="margin: 0; font-size: 12px; color: #92400E; font-weight: 500;">
                [Resend Free Tier Testing Mode] Delivered to account owner. Originally intended for: <strong>${to}</strong>
              </p>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Content -->
          <tr>
            <td style="padding: 36px 36px 28px;">
              <h2 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 22px; color: #1F2A44;">
                Password Reset Request
              </h2>
              
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #4B5563;">
                Hello ${name},
              </p>

              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #4B5563;">
                We received a request to reset your BookNook account password. Click the button below to set a new password:
              </p>

              <!-- Action Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                <tr>
                  <td align="center" style="border-radius: 12px; background-color: #E0A526;">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #1F2A44; text-decoration: none; border-radius: 12px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0; font-size: 13px; line-height: 1.6; color: #6B7280;">
                If you didn't request a password reset, you can safely ignore this email.
              </p>

              <hr style="margin: 28px 0 20px; border: none; border-top: 1px solid #E6E1D6;" />

              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9CA3AF;">
                Or copy and paste this link into your browser:<br />
                <a href="${resetUrl}" style="color: #2F7D6D; word-break: break-all;">
                  ${resetUrl}
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF7F2; padding: 20px; text-align: center; border-top: 1px solid #E6E1D6;">
              <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                &copy; BookNook Lounge. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: recipient,
      subject: "Reset your BookNook password",
      html: emailHtml,
    });
    if (error) {
      console.error("[BookNook] Failed to send password reset email:", error);
    }
  } catch (err) {
    console.error("[BookNook] Unexpected error sending reset email:", err);
  }
}

// Send email verification email using Resend
export async function sendVerificationEmail({
  to,
  userName,
  verificationUrl,
}: {
  to: string;
  userName?: string | null;
  verificationUrl: string;
}) {
  if (!resend) {
    console.warn(`[BookNook] RESEND_API_KEY is missing. Verification URL: ${verificationUrl}`);
    return;
  }

  const name = userName || "Reader";
  const recipient = resolveRecipient(to);
  const isRedirected = recipient !== to;

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email - BookNook</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1F2A44;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4F1EA; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 560px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E6E1D6;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #1F2A44; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; color: #FFFFFF;">
                Book<span style="color: #E0A526;">Nook</span>
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #E0A526; font-weight: 600; text-transform: uppercase;">
                Cozy Modern Reading Lounge
              </p>
            </td>
          </tr>

          ${
            isRedirected
              ? `
          <!-- Sandbox Mode Banner -->
          <tr>
            <td style="background-color: #FEF3C7; padding: 12px 24px; text-align: center; border-bottom: 1px solid #FDE68A;">
              <p style="margin: 0; font-size: 12px; color: #92400E; font-weight: 500;">
                [Resend Free Tier Testing Mode] Delivered to account owner. Originally intended for: <strong>${to}</strong>
              </p>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Content -->
          <tr>
            <td style="padding: 36px 36px 28px;">
              <h2 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 22px; color: #1F2A44;">
                Verify Your Email Address
              </h2>
              
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #4B5563;">
                Hello ${name},
              </p>

              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #4B5563;">
                Welcome to BookNook! Please verify your email address to complete your registration and start exploring our community library:
              </p>

              <!-- Action Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                <tr>
                  <td align="center" style="border-radius: 12px; background-color: #E0A526;">
                    <a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #1F2A44; text-decoration: none; border-radius: 12px;">
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0; font-size: 13px; line-height: 1.6; color: #6B7280;">
                If you didn't create an account with BookNook, you can safely ignore this email.
              </p>

              <hr style="margin: 28px 0 20px; border: none; border-top: 1px solid #E6E1D6;" />

              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9CA3AF;">
                Or copy and paste this link into your browser:<br />
                <a href="${verificationUrl}" style="color: #2F7D6D; word-break: break-all;">
                  ${verificationUrl}
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF7F2; padding: 20px; text-align: center; border-top: 1px solid #E6E1D6;">
              <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                &copy; BookNook Lounge. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: recipient,
      subject: "Verify your BookNook account",
      html: emailHtml,
    });
    if (error) {
      console.error("[BookNook] Failed to send verification email:", error);
    }
  } catch (err) {
    console.error("[BookNook] Unexpected error sending verification email:", err);
  }
}
