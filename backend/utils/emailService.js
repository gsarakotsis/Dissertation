const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"EventHub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email error:', error.message);
  }
};

const sendWelcomeEmail = (user, tempPassword) => sendEmail({
  to: user.email,
  subject: 'Welcome to EventHub',
  html: `<h2>Welcome, ${user.fullName}!</h2>
         <p>Your account has been created.</p>
         <p><strong>Email:</strong> ${user.email}</p>
         <p><strong>Temporary Password:</strong> ${tempPassword}</p>
         <p>Please login and change your password immediately.</p>`
});

const sendRegistrationConfirmation = (user, event, code) => sendEmail({
  to: user.email,
  subject: `Registration Confirmed: ${event.title}`,
  html: `<h2>You're registered!</h2>
         <p>Event: <strong>${event.title}</strong></p>
         <p>Date: <strong>${new Date(event.eventDate).toLocaleDateString()}</strong></p>
         <p>Confirmation Code: <strong>${code}</strong></p>`
});

const sendEventCancellation = (email, eventTitle) => sendEmail({
  to: email,
  subject: `Event Cancelled: ${eventTitle}`,
  html: `<h2>Event Cancelled</h2>
         <p>We're sorry, <strong>${eventTitle}</strong> has been cancelled.</p>`
});

module.exports = { sendEmail, sendWelcomeEmail, sendRegistrationConfirmation, sendEventCancellation };