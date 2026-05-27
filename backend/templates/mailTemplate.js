// utils/emailTemplates.js

const LOGO_URL = "https://res.cloudinary.com/dtswcmnft/image/upload/v1779868399/icon_mmrplh.gif"; 

/**
 * Neon Pastel Layout Wrapper
 */
const neonBaseLayout = (title, contentHtml) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #13111C;
      font-family: 'Comic Sans MS', 'Chalkboard SE', 'Nunito', sans-serif;
      color: #E2E8F0;
    }
    .card {
      max-width: 450px;
      margin: 0 auto;
      background-color: #1E1B2E;
      border: 3px dashed #C084FC;
      border-radius: 30px;
      padding: 30px;
      box-shadow: 0 8px 32px rgba(192, 132, 252, 0.15);
      text-align: left;
    }
    .header { text-align: center; margin-bottom: 25px; }
    .logo { width: 64px; border-radius: 18px; border: 2px solid #F472B6; }
    .title {
      background: #2D1B4E;
      color: #E879F9;
      padding: 12px 20px;
      border-radius: 20px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      border: 2px solid #86198F;
      margin-bottom: 20px;
    }
    .panic-title {
      background: #450A0A;
      color: #FCA5A5;
      border: 2px solid #991B1B;
    }
    .text { font-size: 15px; line-height: 1.6; color: #CBD5E1; }
    .footer { 
      text-align: center; 
      font-size: 12px; 
      color: #64748B; 
      margin-top: 30px; 
      border-top: 2px dashed #334155; 
      padding-top: 15px; 
    }
  </style>
</head>
<body style="background-color: #13111C; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #13111C; width: 100%;">
    <tr>
      <td align="center" style="padding: 40px 15px;">
        <div class="card">
          <div class="header">
            <img src="${LOGO_URL}" class="logo" alt="QuickPool" />
          </div>
          ${contentHtml}
          <div class="footer">
            Shared rides, happier strides! • QuickPool
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * OTP Template Content Generator
 */
const getOtpTemplate = (otpCode) => {
  const content = `
    <div class="title">Verification Time!</div>
    <div class="text">
      <p>Welcome to QuickPool</p>
      <p>We are spinning up our matching engines. Use this security code to complete your sign-in:</p>
    </div>
    
    <div style="background: #022C22; border: 3px solid #34D399; color: #A7F3D0; font-size: 36px; font-weight: bold; text-align: center; padding: 15px; border-radius: 20px; letter-spacing: 8px; margin: 30px 0;">
      ${otpCode}
    </div>
    
    <div class="text" style="font-size: 13px; color: #94A3B8; text-align: center;">
      Expires in 10 minutes. If you didn't trigger this, just ignore it!
    </div>
  `;
  
  return neonBaseLayout("QuickPool Verification Code", content);
};

/**
 * Emergency Panic Content Generator
 */
const getPanicTemplate = (groupId, message, userEmail) => {
  const content = `
    <div class="title panic-title">🚨 System Panic Triggered!</div>
    <div class="text">
      <p><strong>Attention Admin Node,</strong></p>
      <p>A tracking intervention alert was actively flagged by a passenger inside the pipeline infrastructure.</p>
      
      <div style="background: #111827; border: 2px dashed #374151; border-radius: 16px; padding: 16px; margin: 20px 0;">
        <p style="margin: 4px 0; color: #E2E8F0;"><strong>👤 Passenger:</strong> <span style="color: #38BDF8;">${userEmail}</span></p>
        <p style="margin: 4px 0; color: #E2E8F0;"><strong>🚗 Cluster ID:</strong> <span style="color: #FBBF24;">${groupId}</span></p>
        
        <p style="margin: 12px 0 4px 0; color: #94A3B8;"><strong>📝 Dispatch Log:</strong></p>
        <p style="background: #1F2937; border-left: 4px solid #EF4444; padding: 10px; margin: 6px 0; font-style: italic; color: #FCA5A5; border-radius: 4px;">
          "${message || "Emergency alert without custom message parameters."}"
        </p>
      </div>
      
      <p>Please open the admin console immediately to initialize telemetry interception.</p>
    </div>
  `;
  
  return neonBaseLayout("URGENT: QuickPool Panic Alert", content);
};

module.exports = { getOtpTemplate, getPanicTemplate };