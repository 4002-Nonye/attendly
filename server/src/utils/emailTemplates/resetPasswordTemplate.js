const html = (resetLink)=>`
  <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #ffffff; border-radius: 10px; border: 1px solid #e5e7eb;">
    <h2 style="color: #111827;">Reset Password</h2>

    <p style="font-size: 14px; color: #374151; line-height: 1.5;">
      A password reset event has been triggered for your <strong>Attendly</strong> account. 
      <br /><br />
      The password reset window is limited to <strong>1 hour</strong>.
      <br /><br />
      If you do not reset your password within that time, you will need to submit a new request.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetLink}" 
         style="font-family: 'Poppins', Arial, sans-serif; padding: 12px 24px; background-color: #4f46e5; color: #fff; text-decoration: none; font-size: 16px; border-radius: 6px; display: inline-block;">
        Reset Password
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
      If you did not initiate this request, you can safely ignore this email. No changes will be made to your account.
    </p>

    <hr style="margin: 40px 0; border: none; border-top: 1px solid #e5e7eb;" />

    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      &copy; ${new Date().getFullYear()} Attendly App. All rights reserved.
    </p>
  </div>
`;

module.exports = html;