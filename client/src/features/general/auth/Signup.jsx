import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useState } from 'react';

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

function Signup() {
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const { handleSubmit, trigger, reset } = methods;

  // Load persisted role from localStorage
  const [role, setRole] = useState(() => localStorage.getItem('signupRole') || '');

  // Multi-step form context
  const { isFirstStep, isLastStep, handleNextStep, handlePrevStep, step } = useFormStep();

  // When user selects a role, persist it
  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem('signupRole', selectedRole);
  };

  // Allow user to change their role — reset everything
  const handleChangeRole = () => {
    setRole('');
    localStorage.removeItem('signupRole');
    reset();
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
    console.log(data);
    localStorage.removeItem('signupRole'); // clear saved role after successful signup
  };

  //  Handle form validation errors
  const onError = (err) => {
    console.log(err);
  };

  return (
    <div className="lg:w-2/4 w-full flex flex-col lg:justify-center p-3">
      {/* LOGO (shown at top on mobile) */}
      <Logo />

      {/* Step 1: Select role (shown only if no role chosen yet) */}
      {!role && <SelectRole onSelect={handleSelectRole} selectedRole={role} />}

      {/* Step 2: Show form once role is selected */}
      {role && (
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="w-full md:p-20 lg:p-10 xl:p-32 xl:pt-20 p-5 mt-18 md:mt-0 h-full"
            noValidate
          >
            {/* Header showing user’s chosen role + option to change */}
            {role && (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-6">
                <p className="text-sm text-gray-700">
                  You’re signing up as{' '}
                  <span className="font-semibold capitalize text-gray-900">
                    {role}
                  </span>
                </p>
                <Button
                  variant=""
                  type="button"
                  size="sm"
                  className="font-medium text-blue-800 hover:underline"
                  onClick={handleChangeRole}
                >
                  Change role
                </Button>
              </div>
            )}

            {/* FORM HEADER */}
            <FormHeader text="Create your account" />

            {/* Dynamic Fields based on selected role */}
            <div className="flex flex-col">
              {role === 'admin' && <AdminFormField />}
              {role === 'lecturer' && <LecturerFormField />}
              {/* (Future) You could add StudentFormField here */}
            </div>

            {/* FORM NAVIGATION BUTTONS */}
            <div className="flex justify-between my-10">
              {/* Prev button (disabled on first step) */}
              <Button
                size="md"
                className="w-28"
                onClick={handlePrevStep}
                disabled={isFirstStep}
                variant="outline"
              >
                Prev
              </Button>

              {/* Next or Submit button */}
              {!isLastStep ? (
                <Button size="md" className="w-28" onClick={validateSteps}>
                  Next
                </Button>
              ) : (
                <Button variant="primary" size="md" className="w-28" type="submit">
                  Sign up
                </Button>
              )}
            </div>

            {/* Divider */}
            <Divider text="OR" />

            {/* Google OAuth button */}
            <Button
              className="mb-8 mt-7 rounded-md"
              fullWidth
              variant="outline"
              size="lg"
            >
              <img src={googleIcon} alt="google" className="w-8" /> &nbsp;
              <span>Login with Google</span>
            </Button>

            {/* Login redirect link */}
            <p className="text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-700">
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
