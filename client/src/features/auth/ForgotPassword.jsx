import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import Box from '../../components/Box';
import Button from '../../components/Button';
import Err from '../../components/Err';
import FormHeader from '../../components/FormHeader';
import InputField from '../../components/InputField';
import Logo from '../../components/Logo';

import { useForgotPassword } from './hooks/useForgotPassword';

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { forgotPassword, isPending } = useForgotPassword();

  const onSubmit = (data) => {
    forgotPassword(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <div className='lg:w-2/4 w-full flex flex-col lg:justify-center min-h-screen p-3'>
      <Logo />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full max-w-[40rem] mx-auto px-5 sm:px-8 mt-10 md:mt-15'
        noValidate={true}
      >
        {/* FORM HEADER */}
        <FormHeader text='Forgot your password?' />
        <p className='text-gray-700 mb-4'>
          Enter the email address linked to your Attendly account, and we'll
          send you a link to reset your password.
        </p>
        <div className='bg-blue-50 border-l-4 border-blue-400 p-3 mb-6'>
          <p className='text-sm text-blue-800'>
            💡 If the email doesn't arrive within a few minutes, check your spam
            folder.
          </p>
        </div>

        {/* EMAIL INPUT */}
        <Box className='mt-10 mb-3'>
          <InputField
            htmlFor='email'
            label='Email'
            icon={Mail}
            placeholder='e.g. user@example.com'
            type='email'
            autoComplete='email'
            {...register('email', {
              required: {
                value: true,
                message: "Email can't be empty",
              },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address.',
              },
            })}
          />
          <Err msg={errors.email?.message || ' '} />
        </Box>

        {/* SUBMIT BUTTON */}
        <Button fullWidth size='lg' type='submit' disabled={isPending} variant='primary'>
          {isPending ? (
            <ClipLoader
              color='#ffff'
              aria-label='Loading Spinner'
              data-testid='loader'
              size={25}
            />
          ) : (
            'Send Reset Link'
          )}
        </Button>

        {/* BACK TO LOGIN LINK */}
        <p className='text-sm text-center mt-6 text-gray-600'>
          Remembered your password?{' '}
          <Link
            to='/'
            className='text-blue-700 hover:underline font-medium'
          >
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
