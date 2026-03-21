const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"BizSathi" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

const emailTemplates = {
  welcome: (name) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1D9E75; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">BizSathi</h1>
        <p style="color: #E1F5EE; margin: 5px 0;">Apni Dukaan, Apna Platform</p>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2>Welcome ${name}! 🎉</h2>
        <p>BizSathi pe aapka swagat hai!</p>
        <p>Ab aap apni professional website 5 minute mein bana sakte hain.</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" 
           style="background: #1D9E75; color: white; padding: 12px 30px; 
                  text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px;">
          Dashboard Kholein
        </a>
      </div>
      <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
        <p>BizSathi — India ka apna business platform</p>
      </div>
    </div>
  `,

  verifyEmail: (name, token) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1D9E75; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">BizSathi</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2>Email Verify Karein</h2>
        <p>Namaste ${name},</p>
        <p>Apna email verify karne ke liye neeche button click karein:</p>
        <a href="${process.env.FRONTEND_URL}/verify-email/${token}" 
           style="background: #1D9E75; color: white; padding: 12px 30px; 
                  text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px;">
          Email Verify Karein
        </a>
        <p style="margin-top: 20px; color: #888; font-size: 12px;">
          Yeh link 24 ghante mein expire ho jayega.
        </p>
      </div>
    </div>
  `,

  resetPassword: (name, token) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1D9E75; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">BizSathi</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2>Password Reset</h2>
        <p>Namaste ${name},</p>
        <p>Password reset karne ke liye neeche button click karein:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password/${token}" 
           style="background: #E24B4A; color: white; padding: 12px 30px; 
                  text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px;">
          Password Reset Karein
        </a>
        <p style="margin-top: 20px; color: #888; font-size: 12px;">
          Yeh link 1 ghante mein expire ho jayega.
          Agar aapne request nahi ki toh ignore karein.
        </p>
      </div>
    </div>
  `,

  newOrder: (businessName, orderNumber, customerName, total) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1D9E75; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">New Order! 🎉</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2>${businessName} - Naya Order</h2>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Total:</strong> ₹${total}</p>
        <a href="${process.env.FRONTEND_URL}/dashboard/orders" 
           style="background: #1D9E75; color: white; padding: 12px 30px; 
                  text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px;">
          Order Dekhen
        </a>
      </div>
    </div>
  `
};

module.exports = { sendEmail, emailTemplates };
