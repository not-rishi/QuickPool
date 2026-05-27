const { Resend } = require("resend");

const {
  getOtpTemplate,
  getPanicTemplate,
} = require("../templates/mailTemplate");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otpCode) => {
  try {
    const htmlPayload = getOtpTemplate(otpCode);

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "QuickPool OTP Verification",
      html: htmlPayload,
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

    const htmlPayload = getPanicTemplate(groupId, message, userEmail);

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: `🚨 URGENT: Panic Alert from Group ${groupId}`,
      html: htmlPayload,
    });
  } catch (error) {
    console.error("Panic email failed:", error);
  }
};

module.exports = { sendOTP, sendPanicEmail };
