import AuthOverview from '../../components/AuthOverview';
import ForgotPassword from '../../features/general/auth/ForgotPassword';

function ForgotPasswordPage() {
  return (
    <div className='flex min-h-screen  '>
      <AuthOverview
        title='Can’t Access Your Account?'
        content='Don’t worry, it happens to the best of us! Just enter your email
        address, and we’ll help you reset your password so you can get back to
        managing attendance seamlessly.'
      />
      <ForgotPassword />
    </div>
  );
}

export default ForgotPasswordPage;
