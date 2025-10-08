import AuthOverview from '../../components/AuthOverview';
import Login from '../../features/general/auth/Login';

function LoginPage() {
  return (
    <div className='flex min-h-screen '>
      <AuthOverview />

      <Login />
    </div>
  );
}

export default LoginPage;
