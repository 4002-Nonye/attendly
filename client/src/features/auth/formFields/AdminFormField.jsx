import { useEffect } from 'react';
import { useFormStep } from '../../../contexts/useFormStep';

import ProgressBar from '../../../components/ProgressBar'
import AdminStepTwo from '../steps/admin/AdminStepTwo';

import PersonalInfoStep from '../steps/general/PersonalInfoStep';
import SecurityStep from '../steps/general/SecurityStep';

function AdminFormField() {
  const { step, setTotalSteps ,totalSteps} = useFormStep();
  useEffect(() => {
    setTotalSteps(3);
  }, [setTotalSteps]);

  return (
    <>
      <ProgressBar
        totalSteps={totalSteps}
        stepTitles={['Personal Info', 'School Info', 'Security']}
      />

      <div className='flex flex-col gap-2 md:gap-4'>
        {/* STEP 1 */}
        {step === 1 && <PersonalInfoStep />}

        {/* STEP 2 */}

        {step === 2 && <AdminStepTwo />}

        {/* STEP 3 */}
        {step === 3 && <SecurityStep />}
      </div>
    </>
  );
}

export default AdminFormField;
