import AuthOverview from '../../components/AuthOverview';
import LinkAccount from '../../features/general/auth/LinkAccount';

function LinkAccountPage() {
  return (
    <div className='flex min-h-screen '>
      <AuthOverview
        title='Link your Attendly account'
        content='Link your account to access all your attendance data and sessions effortlessly, no matter how you sign in.'
      />

      <LinkAccount />
    </div>
  );
}

export default LinkAccountPage;
