import { FormProvider, useForm } from 'react-hook-form';

import AdminStepTwo from './steps/admin/AdminStepTwo';
import SchoolInfo from './steps/general/SchoolInfo';
import SelectRole from '../../components/SelectRole';
import Button from '../../components/Button';
import Logo from '../../components/Logo';

import { ClipLoader } from 'react-spinners';
import ChangeRole from '../../components/ChangeRole';
import { useCompleteProfile } from './hooks/useCompleteProfile';
import { useState } from 'react';

function CompleteProfile() {
  const methods = useForm();
  const { handleSubmit, reset } = methods;
  const [role, setRole] = useState('');
  const { completeProfile, isPending } = useCompleteProfile();

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
  };
  // Allow user to change their role — reset everything
  const handleChangeRole = () => {
    setRole('');
    reset();
  };

  const onSubmit = (data) => {
    const { school: schoolInput, faculty, department, matricNo, level } = data;
    const baseData = {
      role,
      schoolInput,
    };

    const roleSpecificData = {
      student: {
        level: parseInt(level),
        matricNo,
        faculty,
        department,
      },
      lecturer: {
        faculty,
        department,
      },
      admin: {},
    };

    completeProfile({ ...baseData, ...roleSpecificData[role] });
  };

  return (
    <div className='lg:w-2/4 w-full flex flex-col m-auto min-h-screen p-3 justify-center'>
      <Logo />

      <div className='w-full max-w-[40rem]  mx-auto px-5 sm:px-8 mt-10 md:mt-15'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2'>
            Finish Account Setup
          </h1>
          <p className='text-gray-600'>
            Just a few more details to get you started
          </p>
        </div>

        {/* Step 1: Select role if not selected */}
        {!role && (
          <SelectRole onSelect={handleSelectRole} selectedRole={role} />
        )}

        {/* Step 2: Show form based on selected role */}
        {role && (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Header showing user’s chosen role and option to change */}
              {role && <ChangeRole role={role} onClick={handleChangeRole} />}

              {role === 'admin' && <AdminStepTwo />}

              {role === 'lecturer' && <SchoolInfo />}

              {role === 'student' && (
                <SchoolInfo showLevel={true} showMatric={true} />
              )}

              {/* Submit button */}
              <Button
                type='submit'
                fullWidth
                size='lg'
                className='mt-8'
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
                  'Continue to Dashboard'
                )}
              </Button>
            </form>
          </FormProvider>
        )}
      </div>
    </div>
  );
}

export default CompleteProfile;
