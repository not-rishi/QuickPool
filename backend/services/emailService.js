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

    console.log("Email sent:", response);

    return response;
  } catch (error) {
    console.error("Resend Error:", error);

    throw error;
  }
};

module.exports = sendOTP;
