const confirmAccountLinkHtml = (fullName) => `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
              max-width: 560px; margin: 40px auto; background: #ffffff; border: 1px solid #e5e7eb; 
              border-radius: 12px; overflow: hidden;">
    
    <!-- Header -->
    <div style="text-align: left; padding: 40px 24px 20px;">
      <h1 style="font-size: 24px; color: #111827; margin: 0; letter-spacing: -0.3px;">
        Attendly
      </h1>
    </div>

    <!-- Divider -->
    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 0 24px;">

    <!-- Main content -->
    <div style="padding: 24px 40px; text-align: left;">
      <h2 style="font-size: 20px; color: #111827; margin-bottom: 16px; font-weight: 600;">
        Your account has been linked!
      </h2>

      <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
        Hi ${fullName || 'there'}, we’re happy to let you know that your Attendly account has been successfully linked with Google. 
        You can now log in using either your email and password or your Google account.
      </p>

      <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
        If you did not perform this action, please contact our support immediately to secure your account.
      </p>

      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;">

      <p style="color: #9ca3af; font-size: 13px; line-height: 1.6;">
        Thank you for using Attendly!
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px; background: #f9fafb; font-size: 12px; color: #9ca3af;">
      © ${new Date().getFullYear()} Attendly
    </div>
  </div>
`;

module.exports = confirmAccountLinkHtml;
