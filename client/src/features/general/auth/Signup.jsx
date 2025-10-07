import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import logoBlack from '../../../assets/logo-black.svg';

import googleIcon from '../../../assets/icons8-google.svg';

import Divider from '../../../components/Divider';
import Button from '../../../components/Button';
import FormHeader from '../../../components/FormHeader';
import AdminFormField from './formFields/AdminFormField';
import { useFormStep } from '../../../contexts/useFormStep';
import { formStepFields } from '../../../utils/formStepFields';
import { useState } from 'react';

function Signup() {
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const { handleSubmit, trigger } = methods;
  const [role, setRole] = useState('admin');

  const { isFirstStep, isLastStep, handleNextStep, handlePrevStep, step } =
    useFormStep();

  const validateSteps = async () => {
    const fieldsToValidate = formStepFields[role][step - 1].map(
      (step) => step.name
    );

    const isValid = await trigger(fieldsToValidate);
    console.log(fieldsToValidate, isValid);

    if (isValid) handleNextStep();
  };

  const onSubmit = (data) => {
    console.log(data);
    
  };

  const onError = (err) => {
    console.log(err);
  };

  return (
    <div className='lg:w-2/4 w-full h-full lg:h-dvh flex flex-col lg:justify-center  p-3 '>
      {/* LOGO - only mobile  screens */}
      <div className='md:text-4xl text-xl font-bold flex items-center pt-7 lg:pt-0 lg:hidden md:px-12 md:justify-center'>
        <img src={logoBlack} alt='logo' className='md:w-16' />{' '}
        <span>Attendly</span>
      </div>

      {/* FORM */}
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className='w-full md:p-20 lg:p-10 xl:p-32 xl:pt-20 p-5 mt-18 md:mt-0 h-full'
          noValidate={true}
        >
          {/* FORM HEAD */}
          <FormHeader text='Create your account' />

          <div className='flex flex-col  '>
            {role === 'admin' && <AdminFormField />}
          </div>

          {/* LOGIN CTA */}

          <div className='flex justify-between my-10'>
            <Button
              size='md'
              className='w-28'
              onClick={handlePrevStep}
              disabled={isFirstStep}
              variant='outline'
            >
              Prev
            </Button>
            {!isLastStep && (
              <Button
                size='md'
                className='w-28'
                onClick={validateSteps}
                disable
              >
                Next
              </Button>
            )}
            {isLastStep && (
              <Button
                variant='primary'
                size='md'
                className='w-28'
                type='submit'
              >
                Sign up
              </Button>
            )}
          </div>

          {/* DIVIDER */}
          <Divider text='OR' />

          {/* LOGIN WITH GOOGLE CTA */}
          <Button
            className=' mb-8 mt-7 rounded-md '
            fullWidth={true}
            variant='outline'
            size='lg'
          >
            <img src={googleIcon} alt='google' className='w-8' /> &nbsp;{' '}
            <span> Login with Google</span>
          </Button>

          {/*   SIGN UP LINK */}
          <p className='text-center'>
            Already have an account?{' '}
            <Link to='/login' className=' text-blue-700'>
              Log in
            </Link>
          </p>
        </form>
      </FormProvider>
    </div>
  );
}

export default Signup;
