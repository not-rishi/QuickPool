const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otpHtml) => {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "QuickPool OTP Verification",
      html: otpHtml,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const sendPanicEmail = async (groupId, message, userEmail) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
    if (!adminEmail) return;

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: `🚨 URGENT: Panic Alert from Group ${groupId}`,
      html: `<p>A user (${userEmail}) has triggered the PANIC alert in group ${groupId}.</p>
             <p><strong>Message:</strong> ${message || "No additional message provided."}</p>
             <p>Please review immediately on the admin dashboard.</p>`,
    });
  } catch (error) {
    console.error("Panic email failed:", error);
  }
};

module.exports = { sendOTP, sendPanicEmail };
