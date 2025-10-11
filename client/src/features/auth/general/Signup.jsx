import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';

import googleIcon from '../../../assets/icons8-google.svg';
import Divider from '../../../components/Divider';
import Button from '../../../components/Button';
import FormHeader from '../../../components/FormHeader';
import AdminFormField from './formFields/AdminFormField';
import LecturerFormField from './formFields/LecturerFormField';
import { useFormStep } from '../../../contexts/useFormStep';
import { formStepFields } from '../../../utils/formStepFields';
import Logo from '../../../components/Logo';
import SelectRole from '../../../components/SelectRole';
import StudentFormField from './formFields/StudentFormField';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useSignup } from './useSignup';

function Signup() {
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const { handleSubmit, trigger, reset } = methods;
  const { signup, isPending } = useSignup();
  const [role, setRole] = useState('');

  // Multi-step form context
  const {
    isFirstStep,
    isLastStep,
    handleNextStep,
    handlePrevStep,
    step,
    resetStep,
  } = useFormStep();

  // When user selects a role, persist it
  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
  };

  // Allow user to change their role — reset everything
  const handleChangeRole = () => {
    setRole('');

    reset();
    resetStep();
  };

  // Validate step-specific fields before moving forward
  const validateSteps = async () => {
    // Get field names for the current step from role-based step configuration
    const fieldsToValidate = formStepFields[role][step - 1].map((f) => f.name);
    const isValid = await trigger(fieldsToValidate);

    if (isValid) handleNextStep();
  };

  // Handle successful form submission
  const onSubmit = (data) => {
    const { fullName, email, password, school: schoolInput } = data;

    if (role === 'admin') {
      const data = {
        fullName,
        email,
        password,
        schoolInput,
        role,
      };
      signup(data, {
        onSuccess: resetStep(),
      });
    }
  };

  //  Handle form validation errors
  const onError = (err) => {
    console.log(err);
  };

  return (
    <div className='lg:w-2/4 w-full flex flex-col lg:justify-center p-3 min-h-screen'>
      {/* LOGO (shown at top on mobile) */}
      <Logo />

      {/* Step 1: Select role (shown only if no role chosen yet) */}
      {!role && <SelectRole onSelect={handleSelectRole} selectedRole={role} />}

      {/* Step 2: Show form once role is selected */}
      {role && (
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className='w-full max-w-[40rem] mx-auto px-5 sm:px-8 mt-10 md:mt-15'
            noValidate={true}
          >
            {/* Header showing user’s chosen role + option to change */}
            {role && (
              <div className='flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-6'>
                <p className='text-sm text-gray-700'>
                  You’re signing up as
                  <span className='font-semibold capitalize text-gray-900'>
                    {' '}
                    {role}
                  </span>
                </p>
                <Button
                  variant=''
                  type='button'
                  size='sm'
                  className='font-medium text-blue-800 hover:underline'
                  onClick={handleChangeRole}
                >
                  Change role
                </Button>
              </div>
            )}

            {/* FORM HEADER */}
            <FormHeader text='Create your account' />

            {/* Dynamic Fields based on selected role */}
            <div className='flex flex-col'>
              {role === 'admin' && <AdminFormField />}
              {role === 'lecturer' && <LecturerFormField />}
              {role === 'student' && <StudentFormField />}
            </div>

            {/* FORM NAVIGATION BUTTONS */}
            <div className='flex justify-between my-8'>
              {/* Prev button (disabled on first step) */}
              <Button
                size='md'
                className='w-28 text-sm md:text-base'
                onClick={handlePrevStep}
                disabled={isFirstStep}
                variant='outline'
                icon={ArrowLeft}
              >
                Prev
              </Button>

              {/* Next button */}
              {!isLastStep && (
                <Button
                  size='md'
                  className='w-28'
                  onClick={validateSteps}
                  icon={ArrowRight}
                  iconPosition='afterText'
                >
                  Next
                </Button>
              )}
              {/*  Submit button */}
              {isLastStep && (
                <Button
                  variant='primary'
                  size='md'
                  className='w-28 text-sm md:text-base'
                  type='submit'
                >
                  {isPending ? (
                    <ClipLoader
                      color='#ffff'
                      aria-label='Loading Spinner'
                      data-testid='loader'
                      size={25}
                    />
                  ) : (
                    'Sign up'
                  )}
                </Button>
              )}
            </div>

            {/* Divider */}
            <Divider text='or login with' />

            {/* Google OAuth button */}
            <Button
              className='mb-8 mt-7 rounded-md  '
              fullWidth
              variant='outline'
              size='lg'
            >
              <img src={googleIcon} alt='google' className='w-8' /> &nbsp;
              <span> Google</span>
            </Button>

            {/* Login redirect link */}
            <p className='text-center text-sm md:text-base'>
              Already have an account?{' '}
              <Link to='/login' className='text-blue-700'>
                Log in
              </Link>
            </p>
          </form>
        </FormProvider>
      )}
    </div>
  );
}

export default Signup;
