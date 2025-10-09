import ProgressBar from '../../../../components/ProgressBar';
import { useFormStep } from '../../../../contexts/useFormStep';
import PersonalInfoStep from '../steps/general/PersonalInfoStep';
import SecurityStep from '../steps/general/SecurityStep';
import StudentStepTwo from '../steps/student/StudentStepTwo';

function StudentFormField() {
  const { step } = useFormStep();
  return (
    <>
      <ProgressBar
        totalSteps={3}
        stepTitles={['Personal Info', 'School Info', 'Security']}
      />

      <div className='flex flex-col gap-2 md:gap-4'>
        {/* STEP 1 */}
        {step === 1 && <PersonalInfoStep />}

        {/* STEP 2 */}

        {step === 2 && <StudentStepTwo />}

        {/* STEP 3 */}
        {step === 3 && <SecurityStep />}
      </div>
    </>
  );
}

export default StudentFormField;
