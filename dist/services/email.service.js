"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLeadEmails = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: env_1.env.EMAIL_USER,
        pass: env_1.env.EMAIL_PASS
    }
});
const buildHtml = (title, body, footer) => `
  <div style="font-family: Arial, sans-serif; background:#f5f7fb; padding:24px;">
    <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb;">
      <div style="background:linear-gradient(90deg,#0f172a,#1d4ed8); padding:24px; color:#fff;">
        <h2 style="margin:0; font-size:22px;">SRM Global Hub</h2>
      </div>
      <div style="padding:24px; color:#1f2937; line-height:1.6;">
        <h3 style="margin-top:0; color:#0f172a;">${title}</h3>
        <div>${body}</div>
        <p style="margin-top:20px; color:#6b7280;">${footer}</p>
      </div>
    </div>
  </div>
`;
const sendLeadEmails = async (lead) => {
    if (!env_1.env.EMAIL_USER || !env_1.env.EMAIL_PASS) {
        console.warn('Email credentials are not configured. Skipping email send.');
        return;
    }
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: env_1.env.EMAIL_USER,
                pass: env_1.env.EMAIL_PASS
            }
        });
        const ownerBody = `
      <p>A new inquiry has been received.</p>
      <ul>
        <li><strong>Name:</strong> ${lead.name}</li>
        <li><strong>Company:</strong> ${lead.company}</li>
        <li><strong>Country:</strong> ${lead.country}</li>
        <li><strong>Email:</strong> ${lead.email}</li>
        <li><strong>Phone:</strong> ${lead.phone}</li>
        <li><strong>Product Interest:</strong> ${lead.productInterest || 'N/A'}</li>
        <li><strong>Quantity Required:</strong> ${lead.quantityRequired || 'N/A'}</li>
        <li><strong>Message:</strong> ${lead.message || 'N/A'}</li>
        <li><strong>Lead ID:</strong> ${lead.leadId}</li>
        <li><strong>Submission Time:</strong> ${new Date().toLocaleString()}</li>
      </ul>
    `;
        const customerBody = `
      <p>Thank you for contacting SRM Global Hub. We have received your inquiry and will respond within 24 hours.</p>
      <p>Your reference ID is <strong>${lead.leadId}</strong>.</p>
    `;
        await Promise.allSettled([
            transporter.sendMail({
                from: env_1.env.EMAIL_USER,
                to: env_1.env.OWNER_NOTIFICATION_EMAIL || env_1.env.EMAIL_USER,
                subject: `New Contact Inquiry from ${lead.name} - SRM Global Hub`,
                html: buildHtml('New Contact Inquiry', ownerBody, 'Please follow up promptly.')
            }),
            transporter.sendMail({
                from: env_1.env.EMAIL_USER,
                to: lead.email,
                subject: 'Thank you for contacting SRM Global Hub',
                html: buildHtml('Thank you for contacting us', customerBody, 'We will get back to you within 24 hours.')
            })
        ]);
        console.log(`Notification emails dispatched for lead: ${lead.leadId}`);
    }
    catch (error) {
        console.error('Email sending failed (lead saved to database):', error);
    }
};
exports.sendLeadEmails = sendLeadEmails;
