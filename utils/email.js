const Brevo = require('@getbrevo/brevo');

// Initialize API Instance once
const apiInstance = new Brevo.TransactionalEmailsApi();

const setupApiKey = () => {
  // Ensure the API key exists
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is missing from environment variables');
  }
  const apiKey = apiInstance.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
};

const sendVerificationEmail = async (user, token) => {
  try {
    setupApiKey();
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "✅ Verify your SkillBridge account";
    // CRITICAL: Ensure 'email' matches your Brevo "Verified Sender" email
    sendSmtpEmail.sender = { "name": "SkillBridge", "email": "noreply@skillbridge.dev" };
    sendSmtpEmail.to = [{ "email": user.email, "name": user.name }];
    sendSmtpEmail.htmlContent = `
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
      </div>`;

    return await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    // This will show up in your Render logs so you can see why it's failing
    console.error("Brevo Email Error:", error.response ? error.response.body : error);
    throw error; // Re-throw so your route catches it and sends the 500
  }
};

const sendWelcomeEmail = async (user) => {
  try {
    setupApiKey();
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "🚀 Welcome to SkillBridge!";
    sendSmtpEmail.sender = { "name": "SkillBridge", "email": "noreply@skillbridge.dev" };
    sendSmtpEmail.to = [{ "email": user.email, "name": user.name }];
    sendSmtpEmail.htmlContent = `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">SkillBridge</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#111827;margin-top:0;">You're in, ${user.name}! 🎉</h2>
          <p style="color:#6b7280;">Your account is verified.</p>
          <div style="text-align:center;margin-top:24px;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;">Go to Dashboard →</a>
          </div>
        </div>
      </div>`;

    return await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    console.error("Brevo Email Error:", error.response ? error.response.body : error);
    throw error;
  }
};

const sendPasswordResetEmail = async (user, token) => {
  try {
    setupApiKey();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "🔐 Reset your SkillBridge password";
    sendSmtpEmail.sender = { "name": "SkillBridge", "email": "noreply@skillbridge.dev" };
    sendSmtpEmail.to = [{ "email": user.email, "name": user.name }];
    sendSmtpEmail.htmlContent = `<p>Reset link: <a href="${resetUrl}">${resetUrl}</a></p>`;

    return await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    console.error("Brevo Email Error:", error.response ? error.response.body : error);
    throw error;
  }
};

module.exports = { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail };
