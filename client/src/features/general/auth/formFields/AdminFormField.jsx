import { useEffect } from 'react';
import ProgressBar from '../../../../components/ProgressBar';
import { useFormStep } from '../../../../contexts/useFormStep';

import AdminStepThree from '../steps/admin/AdminStepThree';
import AdminStepTwo from '../steps/admin/AdminStepTwo';
import GeneralStep from '../steps/GeneralStep';

function AdminFormField() {
  const { step, setTotalSteps } = useFormStep();
  useEffect(() => {
    setTotalSteps(3);
  }, [setTotalSteps]);

  return (
    <>
      <ProgressBar
        totalSteps={3}
        stepTitles={['Personal Info', 'School Info', 'Security']}
      />

      <div className='flex flex-col gap-4'>
        {/* STEP 1 */}
        {step === 1 && <GeneralStep />}

        {/* STEP 2 */}

        {step === 2 && <AdminStepTwo />}

        {/* STEP 3 */}
        {step === 3 && <AdminStepThree />}
      </div>
    </>
  );
}

export default AdminFormField;
