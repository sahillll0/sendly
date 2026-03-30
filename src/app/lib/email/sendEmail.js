import nodemailer from 'nodemailer';

export async function sendEmail({ to, replyTo, name, message, isAutoReply = false, ownerName = "our website", extraData = {} }) {
  // Use environment variables or fallback to testing credentials (ethereal)
  const smtpHost = process.env.SMTP_HOST || 'smtp.ethereal.email';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER?.trim(); // Trim hidden spaces
  const smtpPass = process.env.SMTP_PASS?.trim(); // Trim hidden spaces

  let transporter;

  if (!smtpUser || !smtpPass) {
    console.warn("SMTP credentials not provided in .env. Creating test Ethereal account...");
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // Now strictly checking a number
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  const senderName = name ? `${name} (Form Submission)` : 'New Form Submission';

  let extraDataHtml = '';
  let extraDataText = '';
  if (extraData && Object.keys(extraData).length > 0) {
    extraDataHtml = `
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #f1f5f9; margin-top: 20px;">
        <p style="margin: 0 0 10px 0; font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase;">Additional Fields</p>
        <table style="width: 100%; border-collapse: collapse;">
          ${Object.entries(extraData).map(([key, value]) => `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 40%; font-size: 14px;"><strong>${key}</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 14px; white-space: pre-wrap;">${value}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;
    extraDataText = '\n\nAdditional Fields:\n' + Object.entries(extraData).map(([k, v]) => `${k}: ${v}`).join('\n');
  }

  let mailOptions;

  if (isAutoReply) {
    mailOptions = {
      from: `"Sendly System" <${smtpUser || 'no-reply@sendly.com'}>`,
      replyTo: replyTo,
      to: to,
      subject: `Confirmation: Your message to ${ownerName} was received`,
      text: `Hi ${name || 'there'},\n\nThank you for reaching out! This is a quick confirmation that we have successfully received your message sent to ${ownerName}.\n\nYour message details:\nName: ${name}\nMessage: ${message}${extraDataText}\n\nWe will get back to you shortly.\n\nBest regards,\nThe ${ownerName} Team`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; margin-bottom: 20px;">
            <h1 style="color: #0f172a; margin: 0; font-size: 24px; letter-spacing: -0.025em;">Message Received</h1>
          </div>
          
          <p style="font-size: 16px;">Hi <strong>${name || 'there'}</strong>,</p>
          
          <p>Thank you for reaching out! This is a quick confirmation that we have successfully received your message for <strong>${ownerName}</strong>.</p>
          
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; font-weight: 600; color: #64748b; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em;">Your Message Preview</p>
            <p style="margin-top: 8px; font-style: italic; color: #334155;">"${message}"</p>
          </div>
          ${extraDataHtml}
          
          <p>The team will review your submission and get back to you shortly.</p>
          
          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 14px; color: #94a3b8;">
            <p style="margin: 0;">This is an automated notification from <strong>${ownerName}</strong>.</p>
            <p style="margin: 4px 0;">Powered by <a href="#" style="color: #3b82f6; text-decoration: none; font-weight: 500;">Sendly</a></p>
          </div>
        </div>
      `,
    };
  } else {
    mailOptions = {
      from: `"Sendly System" <${smtpUser || 'no-reply@sendly.com'}>`,
      replyTo: replyTo,
      to: to,
      subject: `New Form Submission: ${senderName}`,
      text: `You have a new submission for ${ownerName}.\n\nFrom: ${senderName} (${replyTo})\n\nMessage:\n${message}${extraDataText}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="background-color: #3b82f6; padding: 20px; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">New Form Submission</h1>
            <p style="color: #dbeafe; margin: 4px 0 0 0; font-size: 14px;">Project: ${ownerName}</p>
          </div>
          
          <p style="font-size: 16px;">Hello,</p>
          <p>You've received a new message through your <strong>${ownerName}</strong> form.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 100px;"><strong>Sender</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${name || 'Anonymous'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Email</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${replyTo}" style="color: #3b82f6; text-decoration: none;">${replyTo}</a></td>
            </tr>
          </table>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #f1f5f9;">
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase;">Message Content</p>
            <p style="margin: 0; color: #334155; white-space: pre-wrap;">${message}</p>
          </div>
          ${extraDataHtml}
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="mailto:${replyTo}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">Reply Directly</a>
          </div>
          
          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 13px; color: #94a3b8;">
            <p style="margin: 0;">This email was sent via your <strong>Sendly</strong> integration.</p>
            <p style="margin: 4px 0;">Manage your submissions in the <a href="#" style="color: #3b82f6; text-decoration: none;">dashboard</a>.</p>
          </div>
        </div>
      `,
    };
  }

  const info = await transporter.sendMail(mailOptions);

  if (!smtpUser || !smtpPass) {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }

  return info;
}
