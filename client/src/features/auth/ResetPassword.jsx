import { Eye, EyeOff,Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import Box from '../../components/Box';
import Button from '../../components/Button';
import Err from '../../components/Err';
import FormHeader from '../../components/FormHeader';
import InputField from '../../components/InputField';
import Logo from '../../components/Logo';

import { useResetPassword } from './hooks/useResetPassword';

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const [searchParams] = useSearchParams();
  const { resetPassword, isPending } = useResetPassword();

  const handleFormSubmit = (data) => {
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    const { password: newPassword } = data;

    resetPassword({ email, token, newPassword });
  };

  const handleFormError = (formErrors) => {
    console.log('Form Errors:', formErrors);
  };

  return (
    <div className='flex flex-col lg:justify-center w-full lg:w-2/4 min-h-screen p-3'>
      {/* LOGO */}
      <Logo />

      {/* RESET PASSWORD FORM */}
      <form
        onSubmit={handleSubmit(handleFormSubmit, handleFormError)}
        className='w-full max-w-[40rem] mx-auto px-5 sm:px-8 mt-10 md:mt-15'
        noValidate
      >
        {/* FORM HEADER */}
        <FormHeader text='Reset your password' />
        <p className='text-gray-700 mb-6'>
          Please enter your new password and confirm it below to complete the
          reset process.
        </p>

        {/* NEW PASSWORD FIELD */}
        <Box className='mb-3'>
          <InputField
            htmlFor='password'
            label='New Password'
            icon={Lock}
            type='password'
            placeholder='Enter your new password'
            eyesOn={Eye}
            eyesOff={EyeOff}
            autoComplete='new-password'
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
            })}
          />
          <Err msg={errors.password?.message || ' '} />
        </Box>

        {/* CONFIRM PASSWORD FIELD */}
        <Box>
          <InputField
            htmlFor='confirmPassword'
            label='Confirm Password'
            icon={Lock}
            type='password'
            placeholder='Re-enter your new password'
            eyesOn={Eye}
            eyesOff={EyeOff}
            autoComplete='new-password'
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === getValues('password') || 'Passwords do not match',
            })}
          />
          <Err msg={errors.confirmPassword?.message || ' '} />
        </Box>

        {/* SUBMIT BUTTON */}
        <Button
          fullWidth
          size='lg'
          type='submit'
          className='mt-4'
          disabled={isPending}
          variant='primary'
        >
          {isPending ? (
            <ClipLoader
              color='#ffff'
              aria-label='Loading Spinner'
              data-testid='loader'
              size={25}
            />
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>
    </div>
  );
}

export default ResetPassword;
