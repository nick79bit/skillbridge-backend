const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendVerificationEmail = async (user, token) => {
  const transporter = createTransporter();
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'SkillBridge <noreply@skillbridge.dev>',
    to: user.email,
    subject: '✅ Verify your SkillBridge account',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 700;">SkillBridge</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Student Opportunity Platform</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Welcome, ${user.name}! 🎉</h2>
          <p style="color: #6b7280; line-height: 1.6;">You're one step away from joining thousands of students building real skills. Click the button below to verify your email address.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">Verify My Account →</a>
          </div>
          <p style="color: #9ca3af; font-size: 13px;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
        </div>
        <div style="background: #f9fafb; padding: 16px 32px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 SkillBridge. Built for students, by students.</p>
        </div>
      </div>
    `
  });
};

const sendWelcomeEmail = async (user) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'SkillBridge <noreply@skillbridge.dev>',
    to: user.email,
    subject: '🚀 Welcome to SkillBridge — Let\'s build something great!',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 700;">SkillBridge</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">You're in, ${user.name}! 🎉</h2>
          <p style="color: #6b7280; line-height: 1.6;">Your account is verified. Here's what you can do now:</p>
          <ul style="color: #6b7280; line-height: 2;">
            <li>🏘️ Join domain communities and follow structured learning paths</li>
            <li>🚀 Find hackathons and project challenges</li>
            <li>🤝 Form teams and collaborate with other students</li>
            <li>📈 Track your progress and earn badges</li>
          </ul>
          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">Go to Dashboard →</a>
          </div>
        </div>
      </div>
    `
  });
};

const sendPasswordResetEmail = async (user, token) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: '🔐 Reset your SkillBridge password',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">SkillBridge</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Reset your password</h2>
          <p style="color: #6b7280;">Click below to set a new password. This link expires in 1 hour.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${resetUrl}" style="background: #dc2626; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">Reset Password</a>
          </div>
          <p style="color: #9ca3af; font-size: 13px;">If you didn't request this, ignore this email. Your password will not change.</p>
        </div>
      </div>
    `
  });
};

module.exports = { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail };
