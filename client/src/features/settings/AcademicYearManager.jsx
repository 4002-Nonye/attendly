import { useState } from 'react';
import { Calendar, Check } from 'lucide-react';
import PropTypes from 'prop-types';

import Button from '../../components/Button';
import { useButtonState } from '../../hooks/useButtonState';

import { useSwitchSemester } from './useSwitchSemester';

function AcademicYearManager({
  currentYear,
  currentSemester,
  onCreateNewYear,
}) {
  const [selectedSemester, setSelectedSemester] = useState(currentSemester);
  const hasChanged = selectedSemester !== currentSemester;
  const { switchSemester, isPending } = useSwitchSemester();
  const {disableButton}=useButtonState()

  const handleSemesterSwitch = () => {
    switchSemester({
      semester: selectedSemester,
    });
  };

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
          <Calendar className='w-5 h-5 text-blue-600' />
        </div>
        <div>
          <h3 className='text-lg font-bold text-gray-900'>Academic Period</h3>
          <p className='text-sm text-gray-500'>
            Current year and semester settings
          </p>
        </div>
      </div>

      <div className='space-y-6'>
        {/* Current Academic Year  */}
        <div className='flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100'>
          <div>
            <p className='text-xs font-medium text-blue-600 mb-1'>
              Academic Year
            </p>
            <p className='text-lg font-bold text-blue-900'>{currentYear}</p>
          </div>

        </div>

        {/* Semester Selector */}
        <div>
          <div className='flex items-center justify-between mb-3'>
            <label className='text-sm font-semibold text-gray-700'>
              Select Semester
            </label>
            {hasChanged && (
              <span className='text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded'>
                Unsaved
              </span>
            )}
          </div>

          <div className='grid grid-cols-2 gap-3'>
            {['First', 'Second'].map((semester) => {
              const isSelected = selectedSemester === semester;
              

              return (
                <button
                  key={semester}
                  onClick={() => setSelectedSemester(semester)}
                  disabled={isPending||disableButton}
                  className={`relative p-4 rounded-lg border-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className='flex flex-col items-center gap-2'>
                    <span className='text-base'>{semester}</span>
                    <span className='text-xs text-gray-500'>Semester</span>
                  </div>

                 
                </button>
              );
            })}
          </div>

          {/* Switch Button */}
          {hasChanged && (
            <Button
              onClick={handleSemesterSwitch}
              disabled={isPending|| disableButton}
              variant='primary'
              size='md'
              className='mt-4'
              fullWidth
            >
              {isPending ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  <span>Switching...</span>
                </>
              ) : (
                <>Switch to {selectedSemester} Semester</>
              )}
            </Button>
          )}
        </div>

        {/* Divider */}
        <div className='border-t border-gray-200'></div>

        {/* Create New Year */}
        <div className='p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'>
          <div className='text-center mb-3'>
            <p className='text-sm font-medium text-gray-700 mb-1'>
              Start New Academic Year
            </p>
            <p className='text-xs text-gray-500'>
              Create and activate a new academic year
            </p>
          </div>
          <Button
            variant='primary'
            fullWidth
            size='sm'
            onClick={onCreateNewYear}
            disabled={isPending}
          >
            Create New Academic Year
          </Button>
        </div>
      </div>
    </div>
  );
}

AcademicYearManager.propTypes = {
  currentYear: PropTypes.string.isRequired,
  currentSemester: PropTypes.oneOf(['First', 'Second']).isRequired,
  onCreateNewYear: PropTypes.bool,
};

export default AcademicYearManager;
