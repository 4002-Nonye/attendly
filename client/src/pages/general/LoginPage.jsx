import AuthOverview from '../../components/AuthOverview';
import Login from '../../features/auth/Login';

function LoginPage() {
  return (
    <div className='flex  '>
      <AuthOverview />

      <Login />
    </div>
  );
}

export default LoginPage;
