import nodemailer from 'nodemailer';
import { env } from '../config/env';

interface LeadEmailPayload {
  name: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  productInterest?: string;
  quantityRequired?: string;
  message?: string;
  leadId: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS
  }
});

const buildHtml = (title: string, body: string, footer: string) => `
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

export const sendLeadEmails = async (lead: LeadEmailPayload): Promise<void> => {
  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    console.warn('Email credentials are not configured. Skipping email send.');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS
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
        from: env.EMAIL_USER,
        to: env.OWNER_NOTIFICATION_EMAIL || env.EMAIL_USER,
        subject: `New Contact Inquiry from ${lead.name} - SRM Global Hub`,
        html: buildHtml('New Contact Inquiry', ownerBody, 'Please follow up promptly.')
      }),
      transporter.sendMail({
        from: env.EMAIL_USER,
        to: lead.email,
        subject: 'Thank you for contacting SRM Global Hub',
        html: buildHtml('Thank you for contacting us', customerBody, 'We will get back to you within 24 hours.')
      })
    ]);
    console.log(`Notification emails dispatched for lead: ${lead.leadId}`);
  } catch (error) {
    console.error('Email sending failed (lead saved to database):', error);
  }
};
