const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: 'a7297a001@smtp-brevo.com',   // your Brevo SMTP login from screenshot
    pass: process.env.BREVO_SMTP_KEY    // your SMTP key value from Render env vars
  }
})

transporter.verify((error, success) => {
  if (error) console.error('SMTP config error:', error);
  else console.log('SMTP ready');
});

const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`
  await transporter.sendMail({
    from: '"SkillBridge" <ombodke384@gmail.com>',
    to: user.email,
    subject: '✅ Verify your SkillBridge account',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">SkillBridge</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">Student Opportunity Platform</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#111827;margin-top:0;">Welcome, ${user.name}! 🎉</h2>
          <p style="color:#6b7280;line-height:1.6;">Click below to verify your email and activate your account.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${verifyUrl}" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;display:inline-block;">Verify My Account →</a>
          </div>
          <p style="color:#9ca3af;font-size:13px;">Link expires in 24 hours.</p>
        </div>
      </div>`
  })
}

const sendWelcomeEmail = async (user) => {
  await transporter.sendMail({
   from: '"SkillBridge" <ombodke384@gmail.com>',
    to: user.email,
    subject: '🚀 Welcome to SkillBridge!',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">SkillBridge</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#111827;margin-top:0;">You're in, ${user.name}! 🎉</h2>
          <p style="color:#6b7280;">Your account is verified. Start exploring opportunities.</p>
          <div style="text-align:center;margin-top:24px;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;">Go to Dashboard →</a>
          </div>
        </div>
      </div>`
  })
}

const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
  await transporter.sendMail({
    from: '"SkillBridge" <ombodke384@gmail.com>',
    to: user.email,
    subject: '🔐 Reset your SkillBridge password',
    html: `<p style="font-family:sans-serif;">Hi ${user.name},<br><br>
      Click to reset your password: <a href="${resetUrl}">${resetUrl}</a><br><br>
      Link expires in 1 hour.</p>`
  })
}

module.exports = { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail }
