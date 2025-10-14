import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Mail } from 'lucide-react';

import googleIcon from '../../assets/icons8-google.svg';

import Box from '../../components/Box';
import Err from '../../components/Err';
import InputField from '../../components/InputField';
import Divider from '../../components/Divider';
import Button from '../../components/Button';
import FormHeader from '../../components/FormHeader';
import Logo from '../../components/Logo';
import { useLogin } from './hooks/useLogin';
import { ClipLoader } from 'react-spinners';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { login, isPending } = useLogin();

  const onSubmit = (data) => {
    login(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <div className='lg:w-2/4 w-full flex flex-col lg:justify-center min-h-screen  p-3 '>
      {/* LOGO - only mobile  screens */}
      <Logo />

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full max-w-[40rem] mx-auto px-5 sm:px-8 mt-10 md:mt-15'
        noValidate={true}
      >
        {/* FORM HEAD */}
        <FormHeader text='Sign in to your account' />

        <div className='flex flex-col gap-4'>
          {/* EMAIL BOX */}
          <Box className='relative'>
            <InputField
              htmlFor='email'
              label='Email'
              icon={Mail}
              placeholder='e.g userexample@gmail.com'
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

          {/* PASSWORD BOX */}
          <Box className='relative'>
            <InputField
              htmlFor='password'
              label='Password'
              icon={Lock}
              type='password'
              placeholder='Enter your password'
              eyesOn={Eye}
              eyesOff={EyeOff}
              autoComplete='current-password'
              {...register('password', {
                required: {
                  value: true,
                  message: "Password can't be empty",
                },
                minLength: {
                  value: 8,
                  message: 'Password must be more than 8 characters',
                },
              })}
            />
            <div className='flex items-center justify-between mt-0.5'>
              {' '}
              <Err msg={errors.password?.message || ' '} />
              <Link
                to='/forgot-password'
                className='text-right text-blue-800 text-sm'
              >
                Forgot password?
              </Link>
            </div>
          </Box>
        </div>

        {/* LOGIN CTA */}
        <Button
          fullWidth={true}
          variant='primary'
          size='lg'
          className=' mb-6 mt-7'
          type='submit'
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
            'Login'
          )}
        </Button>

        {/* DIVIDER */}
        <Divider text='or login with' />

        {/* LOGIN WITH GOOGLE */}
        <a
          href='/auth/google'
          className='flex items-center justify-center gap-2 w-full py-4 px-4 mb-8 mt-7 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors'
        >
          <img src={googleIcon} alt='Google' className='w-6 h-6' />
          <span className='font-medium'>Continue with Google</span>
        </a>

        {/*   SIGN UP LINK */}
        <p className='text-center text-sm md:text-base'>
          Don't have an account?{' '}
          <Link to='/signup' className=' text-blue-700'>
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
