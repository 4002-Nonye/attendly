import AuthOverview from '../../components/AuthOverview';
import CompleteProfile from '../../features/auth/CompleteProfile';

function CompleteProfilePage() {
  return (
    <div className='flex min-h-screen'>
      <AuthOverview
        title='Complete your profile'
        content="Welcome! Let's finish setting up your Attendly account.
        We just need a few more details to personalize your experience and
        connect you with your school or organization."
      />
      <CompleteProfile />
    </div>
  );
}

export default CompleteProfilePage;
