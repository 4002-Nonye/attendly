import ProgressBar from '../../../../components/ProgressBar';
import { useFormStep } from '../../../../contexts/useFormStep';
import GeneralStep from '../steps/GeneralStep';

function LecturerFormField() {
  const { step } = useFormStep();
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

        {/* {step === 2 && <AdminStepTwo />} */}

        {/* STEP 3 */}
        {/* {step === 3 && <AdminStepThree />} */}
      </div>
    </>
  );
}

export default LecturerFormField;
