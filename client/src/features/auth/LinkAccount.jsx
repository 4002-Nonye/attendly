import { MailCheck } from 'lucide-react';
import Button from '../../components/Button';
import Logo from '../../components/Logo';

function LinkAccount() {
  return (
    <div className='flex flex-col lg:justify-center w-full lg:w-2/4 min-h-screen p-3'>
      <div className='w-full max-w-[40rem] mx-auto px-5 sm:px-8 mt-15 lg:mt-0 '>
        <MailCheck className='mx-auto mb-6 h-12 w-12 text-primary ' />
        <h1 className='text-2xl font-semibold mb-3 text-center'>
          Account already exists
        </h1>
        <p className=' mb-6'>
          We found an existing Attendly account associated with this email
          address. It looks like you previously signed up using a different
          sign-in method.
        </p>
        <p className=' mb-10'>
          To keep everything in one place, you can link your Google account to
          your existing Attendly account. We’ll send a verification email to
          confirm this action.
        </p>
        <div className='flex justify-end items-center gap-3'>
          <Button variant='outline' className=''>
            Cancel
          </Button>
          <Button className=''>Link account</Button>
        </div>
      </div>
    </div>
  );
}

export default LinkAccount;
