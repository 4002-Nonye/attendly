import PropTypes from 'prop-types';
import { useFormStep } from '../contexts/useFormStep';

function ProgressBar({ totalSteps, stepTitles = [] }) {
  const { step } = useFormStep();

  return (
    <div className='w-full mb-12'>
      <div className='relative'>
        {/* Circles container */}
        <div className='relative flex justify-between items-center'>
          {Array.from({ length: totalSteps }).map((_, index) => {
            const current = index + 1;
            const isCompleted = current <= step;
            const isActive = current === step;

            return (
              <div key={current} className='flex flex-col items-center'>
                {/* Circle */}
                <div
                  className={`flex items-center justify-center w-11 h-11 rounded-full border-2 text-sm font-semibold z-10 transition-all duration-300 ease-in-out
                    ${
                      isCompleted
                        ? 'bg-blue-950 border-blue-950 text-white'
                        : isActive
                        ? 'border-blue-950 text-blue-950 bg-white'
                        : 'border-gray-300 text-gray-400 bg-white'
                    }`}
                >
                  {current}
                </div>

                {/* Step title */}
                {stepTitles[current - 1] && (
                  <p
                    className={`mt-3  text-sm text-center whitespace-nowrap transition-colors duration-300 ${
                      isActive
                        ? 'text-blue-950 font-medium'
                        : 'text-gray-400 font-normal'
                    }`}
                  >
                    {stepTitles[current - 1]}
                  </p>
                )}
              </div>
            );
          })}

          {/* Connecting line background */}
          <div className='absolute top-[22px] left-[30px] right-[30px] h-[2px] bg-gray-200 -z-0'></div>
          
          {/* Progress line overlay */}
          {step > 1 && (
            <div 
              className='absolute top-[22px] left-[30px] h-[2px] bg-blue-950 -z-0 transition-all duration-500 ease-in-out'
              style={{ width: `calc(((100% - 60px) / ${totalSteps - 1}) * ${step - 1})` }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
}

ProgressBar.propTypes = {
  totalSteps: PropTypes.number.isRequired,
  stepTitles: PropTypes.arrayOf(PropTypes.string),
};

export default ProgressBar;