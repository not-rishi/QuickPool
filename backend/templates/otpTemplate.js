function otpTemplate(otp) {
  return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>QuickPool OTP</title>
    <style>
      body { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background:#f3f4f6; margin:0; padding:24px }
      .card{ background:#ffffff; max-width:540px; margin:32px auto; border-radius:12px; padding:32px; box-shadow:0 6px 24px rgba(16,24,40,.08)}
      .brand{ color:#0ea5a4; font-weight:700; font-size:20px }
      .title{ font-size:18px; margin-top:8px; color:#0f172a }
      .otp{ display:block; margin:20px auto; width:160px; height:80px; border-radius:8px; background:#f8fafc; border:1px dashed #e2e8f0; font-weight:800; font-size:28px; color:#0f172a; display:flex; align-items:center; justify-content:center }
      .muted{ color:#64748b; font-size:14px }
      .footer{ text-align:center; color:#94a3b8; font-size:13px; margin-top:18px }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="brand">QuickPool</div>
      <div class="title">Use this verification code to access your QuickPool account.</div>
      <div class="otp">${otp}</div>
      <p class="muted">This code expires in 5 minutes. Do not share this code with anyone.</p>
      <div class="footer">QuickPool — Smart student ride coordination</div>
    </div>
  </body>
  </html>
  `;
}

module.exports = otpTemplate;
