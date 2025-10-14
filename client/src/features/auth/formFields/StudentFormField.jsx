import ProgressBar from '../../../components/ProgressBar';
import { useFormStep } from '../../../contexts/useFormStep';
import PersonalInfoStep from'../steps/general/PersonalInfoStep';
import SchoolInfo from '../steps/general/SchoolInfo';
import SecurityStep from '../steps/general/SecurityStep';

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

        {step === 2 && <SchoolInfo showLevel={true} showMatric={true} />}

        {/* STEP 3 */}
        {step === 3 && <SecurityStep />}
      </div>
    </>
  );
}

export default StudentFormField;
