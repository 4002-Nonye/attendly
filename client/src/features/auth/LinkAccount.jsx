import { MailCheck, AlertCircle } from 'lucide-react';
import Button from '../../components/Button';
import Logo from '../../components/Logo';
import { useLinkAccount } from './hooks/useLinkAccount';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { ClipLoader } from 'react-spinners';

function LinkAccount() {
  const { linkAccount, isPending } = useLinkAccount();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return (
    <div className='flex flex-col lg:justify-center w-full lg:w-2/4 min-h-screen p-3'>
      <Logo />

      <div className='w-full max-w-[40rem] mx-auto px-5 sm:px-8 mt-10 lg:mt-0'>
        {/* Icon */}
        <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6'>
          <MailCheck className='h-8 w-8 text-blue-600' />
        </div>

        {/* Header */}
        <h1 className='text-2xl font-semibold mb-3 text-center'>
          Link Your Accounts
        </h1>

        {/* Description */}
        <p className='text-gray-700 mb-4'>
          We found an existing Attendly account associated with this email
          address. It looks like you previously signed up using email and
          password.
        </p>

        {/* Info Box */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
          <div className='flex gap-2'>
            <AlertCircle className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
            <div className='text-sm text-blue-800'>
              <p className='font-semibold mb-1'>What happens when you link?</p>
              <ul className='list-disc list-inside space-y-1'>
                <li>You can sign in with Google or email/password</li>
                <li>All your data stays safe in one account</li>
                <li>We'll send a confirmation email for security</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className='flex flex-col sm:flex-row justify-end items-center gap-3'>
          <Button
            variant='outline'
            fullWidth={true}
            className='sm:w-auto'
            onClick={() => navigate('/login')}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            fullWidth={true}
            className='sm:w-auto'
            onClick={() => linkAccount({ token })}
            disabled={isPending}
          >
            {isPending ? (
              <ClipLoader
                color='#ffff'
                aria-label='Loading Spinner'
                data-testid='loader'
                size={25}
              />
            ) : (
              'Link Account'
            )}
          </Button>
        </div>

        {/* Security note */}
        <p className='text-center text-sm text-gray-600 mt-6'>
          🔒 Your account security is our priority
        </p>
      </div>
    </div>
  );
}

export default LinkAccount;
