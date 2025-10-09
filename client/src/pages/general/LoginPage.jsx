import AuthOverview from '../../components/AuthOverview';
import Login from '../../features/auth/general/Login';

function LoginPage() {
  return (
    <div className='flex min-h-screen '>
      <AuthOverview
        title='Welcome back to Attendly!'
        content=' The smart and simple way to track attendance. Start sessions, let
          participants mark their presence with a quick QR scan, and easily
          generate reports at the end.
         '
         subText= 'Attendance has never been this effortless and convenient.'
      />

      <Login />
    </div>
  );
}

export default LoginPage;
