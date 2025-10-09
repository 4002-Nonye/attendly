import AuthOverview from '../../components/AuthOverview';
import ResetPassword from '../../features/auth/general/ResetPassword';

function ResetPasswordPage() {
  return (
    <div className='flex min-h-screen '>
      <AuthOverview
        title='Securely update your credentials'
        content='Forgot your password? No worries. We’ll help you get back into your account securely. Just create a new password to regain access to your Attendly dashboard.'
      />

      <ResetPassword />
    </div>
  );
}

export default ResetPasswordPage;
