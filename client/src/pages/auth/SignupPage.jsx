import AuthOverview from '../../components/AuthOverview';
import Signup from '../../features/auth/Signup';

function SignupPage() {
  return (
    <div className='flex min-h-screen '>
      <AuthOverview
        title='Join Attendly Today!'
        content=' The smart and simple way to track attendance. Start sessions, let
          participants mark their presence with a quick QR scan, and easily
          generate reports at the end.
'
        subText='Attendance has never been this effortless and convenient.'
      />
      <Signup />
    </div>
  );
}

export default SignupPage;
