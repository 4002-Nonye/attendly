import AuthOverview from '../../components/AuthOverview';
import Signup from '../../features/general/auth/Signup'


function SignupPage() {
  return (
    <div className='flex  '>
      <AuthOverview />

      <Signup />
    </div>
  );
}

export default SignupPage;
