const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otpHtml) => {
  try {
    console.log("EMAIL_FROM:", process.env.EMAIL_FROM);

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "QuickPool OTP Verification",
      html: otpHtml,
    });

    console.log(response);

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = sendOTP;
