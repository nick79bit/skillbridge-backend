const Brevo = require('@getbrevo/brevo')

const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`

  const apiInstance = new Brevo.TransactionalEmailsApi()
  const apiKey = apiInstance.authentications['api-key']
  apiKey.apiKey = process.env.BREVO_API_KEY

  const email = new Brevo.SendSmtpEmail()
  email.sender = { name: 'SkillBridge', email: 'noreply@skillbridge.dev' }
  email.to = [{ email: user.email, name: user.name }]
  email.subject = '✅ Verify your SkillBridge account'
  email.htmlContent = `
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
        <p style="color:#9ca3af;font-size:13px;">Link expires in 24 hours. If you didn't register, ignore this.</p>
      </div>
    </div>
  `

  await apiInstance.sendTransacEmail(email)
}

const sendWelcomeEmail = async (user) => {
  const apiInstance = new Brevo.TransactionalEmailsApi()
  const apiKey = apiInstance.authentications['api-key']
  apiKey.apiKey = process.env.BREVO_API_KEY

  const email = new Brevo.SendSmtpEmail()
  email.sender = { name: 'SkillBridge', email: 'noreply@skillbridge.dev' }
  email.to = [{ email: user.email, name: user.name }]
  email.subject = '🚀 Welcome to SkillBridge!'
  email.htmlContent = `
    <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;">
      <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;">SkillBridge</h1>
      </div>
      <div style="padding:32px;">
        <h2 style="color:#111827;margin-top:0;">You're in, ${user.name}! 🎉</h2>
        <p style="color:#6b7280;line-height:1.6;">Your account is verified. Here's what you can do now:</p>
        <ul style="color:#6b7280;line-height:2;">
          <li>🏘️ Join domain communities</li>
          <li>🚀 Find hackathons and projects</li>
          <li>🤝 Form teams</li>
          <li>📈 Earn badges and climb the leaderboard</li>
        </ul>
        <div style="text-align:center;margin-top:24px;">
          <a href="${process.env.FRONTEND_URL}/dashboard" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;">Go to Dashboard →</a>
        </div>
      </div>
    </div>
  `

  await apiInstance.sendTransacEmail(email)
}

const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

  const apiInstance = new Brevo.TransactionalEmailsApi()
  const apiKey = apiInstance.authentications['api-key']
  apiKey.apiKey = process.env.BREVO_API_KEY

  const email = new Brevo.SendSmtpEmail()
  email.sender = { name: 'SkillBridge', email: 'noreply@skillbridge.dev' }
  email.to = [{ email: user.email, name: user.name }]
  email.subject = '🔐 Reset your SkillBridge password'
  email.htmlContent = `
    <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;">
      <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;">SkillBridge</h1>
      </div>
      <div style="padding:32px;">
        <h2 style="color:#111827;margin-top:0;">Reset your password</h2>
        <p style="color:#6b7280;">This link expires in 1 hour.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${resetUrl}" style="background:#dc2626;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;">Reset Password</a>
        </div>
      </div>
    </div>
  `

  await apiInstance.sendTransacEmail(email)
}

module.exports = { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail }
