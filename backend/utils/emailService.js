const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"EventHub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    })
    console.log(`📧 Email sent to ${to}`)
  } catch (error) {
    console.error('❌ Email error:', error.message)
  }
}

const sendRegistrationConfirmation = (userEmail, userName, event, confirmationCode) => {
  return sendEmail({
    to: userEmail,
    subject: `Registration Confirmed: ${event.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">
            Event<span style="color: #ff6b35;">Hub</span>
          </h1>
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h2 style="color: #1a1a1a;">You're registered!</h2>
          <p style="color: #666; font-size: 16px;">Hi ${userName},</p>
          <p style="color: #666; font-size: 16px;">Your registration for <strong>${event.title}</strong> has been confirmed.</p>
          <div style="background-color: #f5f5f5; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0 0 10px;"><strong>Date:</strong> ${new Date(event.eventDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p style="margin: 0 0 10px;"><strong>Time:</strong> ${event.startTime} - ${event.endTime}</p>
            <p style="margin: 0 0 10px;"><strong>Type:</strong> ${event.eventType}</p>
            <p style="margin: 0;"><strong>Confirmation Code:</strong> <span style="color: #ff6b35; font-size: 20px; font-weight: bold;">${confirmationCode}</span></p>
          </div>
          <p style="color: #666; font-size: 14px;">Please keep your confirmation code safe. You will need it for check-in.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
          <p style="color: #888; font-size: 13px; margin: 0;">© 2025 EventHub. All rights reserved.</p>
        </div>
      </div>
    `
  })
}

const sendEventCancellation = (userEmail, userName, eventTitle) => {
  return sendEmail({
    to: userEmail,
    subject: `Event Cancelled: ${eventTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">
            Event<span style="color: #ff6b35;">Hub</span>
          </h1>
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h2 style="color: #f44336;">Event Cancelled</h2>
          <p style="color: #666; font-size: 16px;">Hi ${userName},</p>
          <p style="color: #666; font-size: 16px;">We're sorry to inform you that <strong>${eventTitle}</strong> has been cancelled.</p>
          <p style="color: #666; font-size: 16px;">Your registration has been automatically removed.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
          <p style="color: #888; font-size: 13px; margin: 0;">© 2025 EventHub. All rights reserved.</p>
        </div>
      </div>
    `
  })
}

const sendEventApproved = (userEmail, userName, event) => {
  return sendEmail({
    to: userEmail,
    subject: `Event Approved: ${event.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">
            Event<span style="color: #ff6b35;">Hub</span>
          </h1>
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h2 style="color: #4caf50;">Your event has been approved!</h2>
          <p style="color: #666; font-size: 16px;">Hi ${userName},</p>
          <p style="color: #666; font-size: 16px;">Your event <strong>${event.title}</strong> has been approved and is now visible to all users.</p>
          <div style="background-color: #f5f5f5; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0 0 10px;"><strong>Date:</strong> ${new Date(event.eventDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p style="margin: 0;"><strong>Time:</strong> ${event.startTime} - ${event.endTime}</p>
          </div>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
          <p style="color: #888; font-size: 13px; margin: 0;">© 2025 EventHub. All rights reserved.</p>
        </div>
      </div>
    `
  })
}

const sendEventRejected = (userEmail, userName, eventTitle, reason) => {
  return sendEmail({
    to: userEmail,
    subject: `Event Proposal Update: ${eventTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">
            Event<span style="color: #ff6b35;">Hub</span>
          </h1>
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h2 style="color: #f44336;">Event Not Approved</h2>
          <p style="color: #666; font-size: 16px;">Hi ${userName},</p>
          <p style="color: #666; font-size: 16px;">Unfortunately your event proposal <strong>${eventTitle}</strong> was not approved.</p>
          ${reason ? `<div style="background-color: #fff3e0; padding: 20px; border-left: 4px solid #ff9800; border-radius: 4px; margin: 20px 0;"><p style="margin: 0; color: #666;"><strong>Reason:</strong> ${reason}</p></div>` : ''}
          <p style="color: #666; font-size: 16px;">You may submit a revised proposal at any time.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
          <p style="color: #888; font-size: 13px; margin: 0;">© 2025 EventHub. All rights reserved.</p>
        </div>
      </div>
    `
  })
}

const sendWelcomeEmail = (userEmail, userName, tempPassword) => {
  return sendEmail({
    to: userEmail,
    subject: 'Welcome to EventHub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">
            Event<span style="color: #ff6b35;">Hub</span>
          </h1>
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h2 style="color: #1a1a1a;">Welcome, ${userName}!</h2>
          <p style="color: #666; font-size: 16px;">Your account has been created by an administrator.</p>
          <div style="background-color: #f5f5f5; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0 0 10px;"><strong>Email:</strong> ${userEmail}</p>
            <p style="margin: 0;"><strong>Temporary Password:</strong> <span style="color: #ff6b35; font-weight: bold;">${tempPassword}</span></p>
          </div>
          <p style="color: #666; font-size: 14px;">Please login and change your password immediately.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
          <p style="color: #888; font-size: 13px; margin: 0;">© 2025 EventHub. All rights reserved.</p>
        </div>
      </div>
    `
  })
}

module.exports = {
  sendRegistrationConfirmation,
  sendEventCancellation,
  sendEventApproved,
  sendEventRejected,
  sendWelcomeEmail
}