import Box from '../../components/Box';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';
import FormHeader from '../../components/FormHeader';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Err from '../../components/Err';
import Logo from '../../components/Logo';
import { useForgotPassword } from './hooks/useForgotPassword';
import { ClipLoader } from 'react-spinners';

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { forgotPassword, isPending } = useForgotPassword();

  const onSubmit = (data) => {
    forgotPassword(data);
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
        <p className='text-gray-700'>
          Enter the email address linked to your Attendly account, and we'll
          send you a link to reset your password.
        </p>

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
        <Button fullWidth size='lg' type='submit' disabled={isPending}>
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
            to='/login'
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
