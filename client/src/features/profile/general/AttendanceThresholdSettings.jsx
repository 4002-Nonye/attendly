import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { useUpdateThresholdLect } from '../lecturer/useUpdateThresholdLect';
import Button from '../../../components/Button';
import Alert from '../../../components/Alert';
import { useUpdateThresholdAdmin } from '../../settings/useUpdateThresholdAdmin';

function AttendanceThresholdSettings({
  data,
  schoolThreshold,
  isAdmin = false,
}) {
  const [threshold, setThreshold] = useState(
    data.attendanceThreshold.toString()
  );
  const [hasError, setHasError] = useState(false);

  const { updateAttendanceThresholdLecturer, isPending: isUpdatingLect } =
    useUpdateThresholdLect();
  const { updateAttendanceThresholdAdmin, isPending: isUpdatingAdmin } =
    useUpdateThresholdAdmin();

  const isPending = isUpdatingAdmin || isUpdatingLect;
  const initialThreshold = data.attendanceThreshold;
  const isSchoolDefault = Number(threshold) === schoolThreshold;

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value === '') {
      setThreshold('');
      setHasError(false);
      return;
    }

    // only allow numbers
    if (!/^\d+$/.test(value)) return;

    const numValue = Number(value);

    // show error indicator if out of range
    if (numValue < 50 || numValue > 100) {
      setHasError(true);
    } else {
      setHasError(false);
    }

    setThreshold(value);
  };

  // clamp to valid range when user leaves input
  const handleBlur = () => {
    if (threshold === '') {
      setThreshold(initialThreshold.toString());
      setHasError(false);
      return;
    }

    let n = Number(threshold);

    // clamp to valid range
    if (n < 50) n = 50;
    if (n > 100) n = 100;

    setThreshold(n.toString());
    setHasError(false);
  };

  const handleSave = () => {
    const numeric = Number(threshold);

    // Check if actually different from initial
    if (numeric === initialThreshold) {
      toast.error('No changes to save');
      return;
    }
    if (!isAdmin) {
      updateAttendanceThresholdLecturer({ threshold: numeric });
    } else {
      updateAttendanceThresholdAdmin({ threshold: numeric });
    }
  };

  const handleResetToSchool = () => {
    if (Number(threshold) === schoolThreshold) {
      toast.error('Already using school default');
      return;
    }
    setThreshold(schoolThreshold.toString());
    setHasError(false);
  };

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
            <TrendingUp className='w-5 h-5 text-green-600' />
          </div>
          <div>
            <h3 className='text-lg font-bold text-gray-900'>
              Attendance Settings
            </h3>
            <p className='text-sm text-gray-500'>
              Set {isAdmin ? 'school-wide' : 'your default'} attendance
              threshold
            </p>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        {/* School Default Info - Only show for lecturers */}
        {!isAdmin && schoolThreshold && (
          <div className='bg-blue-50 border border-blue-100 rounded-lg p-3'>
            <p className='text-xs text-blue-800'>
              <span className='font-semibold'>School Default:</span>{' '}
              {schoolThreshold}%
              {isSchoolDefault && (
                <span className='ml-2 text-green-700'>✓ Currently using</span>
              )}
            </p>
          </div>
        )}

        {/* Admin School-Wide Info */}
        {isAdmin && (
          <Alert
            type='info'
            size='sm'
            showBorder
            message='This threshold applies to all lecturers and students across the school.'
          />
        )}

        {/* Threshold Input */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Attendance Threshold (%)
          </label>
          <div className='relative'>
            <input
              type='number'
              value={threshold}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 pr-12 text-lg font-semibold border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                hasError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder='Enter threshold'
              disabled={isPending}
              min='50'
              max='100'
            />
            <span className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium'>
              %
            </span>
          </div>

          {/* Error message */}
          {hasError && (
            <p className='text-xs text-red-600 font-medium'>
              Threshold must be between 50% and 100%
            </p>
          )}

          {/* Info message */}
          {!hasError && (
            <p className='text-xs text-gray-500'>
              Students need at least this percentage for exam eligibility
              (50-100%)
            </p>
          )}
        </div>

        {/* Quick Select Buttons - Responsive */}
        <div>
          <span className='text-sm text-gray-600 font-medium block mb-2'>
            Quick select:
          </span>
          <div className='flex flex-wrap gap-2'>
            {[50, 65, 70, 75, 80, 85, 90].map((value) => (
              <Button
                key={value}
                variant='pill'
                size='sm'
                active={Number(threshold) === value}
                disabled={isPending}
                onClick={() => {
                  setThreshold(value.toString());
                  setHasError(false);
                }}
                className='px-3 py-1.5 text-sm'
              >
                {value}%
              </Button>
            ))}
          </div>
        </div>

        {/* Info Box - Only for lecturers */}
        {!isAdmin && (
          <Alert
            type='info'
            size='sm'
            showBorder
            message='This threshold will apply to all your courses by default.'
          />
        )}

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3'>
          {/* Reset to School Default - Only show for lecturers */}
          {!isAdmin && schoolThreshold && (
            <Button
              onClick={handleResetToSchool}
              disabled={isPending || isSchoolDefault}
              variant='outline'
              size='sm'
              fullWidth
              className='gap-2 order-2 sm:order-1'
            >
              Reset to Default
            </Button>
          )}

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={
              isPending || hasError || Number(threshold) === initialThreshold
            }
            variant='primary'
            size='sm'
            fullWidth
            className={`gap-2 order-1 ${
              !isAdmin && schoolThreshold ? 'sm:order-2' : ''
            }`}
          >
            {isPending ? (
              <>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                Saving...
              </>
            ) : (
              <>Save Threshold</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

AttendanceThresholdSettings.propTypes = {
  data: PropTypes.shape({
    attendanceThreshold: PropTypes.number.isRequired,
  }).isRequired,
  schoolThreshold: PropTypes.number,
  isAdmin: PropTypes.bool,
};

export default AttendanceThresholdSettings;
