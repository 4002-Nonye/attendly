import { Check, X } from 'lucide-react';
import { getBadgeColor } from '../utils/courseHelpers';
import Button from './Button';
import ClipLoader from 'react-spinners/ClipLoader';
import PropTypes from 'prop-types';

function CourseAssignmentCard({
  course,
  onPrimaryAction, //  assign/enroll
  onSecondaryAction, //  unassign/unenroll
  isLoading,
  showCheckbox = false,
  isSelected = false,
  onToggleSelect,
  primaryActionText = 'Assign',
  secondaryActionText = 'Unassign',
}) {
  const badgeColor = getBadgeColor(course.level);
  const isActionCompleted = course.status;

  return (
    <div className='relative'>
      {/* Checkbox for bulk selection */}
      {showCheckbox && (
        <div className='absolute left-2 top-4'>
          <input
            type='checkbox'
            checked={isSelected}
            disabled={isActionCompleted}
            onChange={() => onToggleSelect(course._id)}
            className={`w-4 h-4 rounded border-gray-300 focus:ring-0`}
          />
        </div>
      )}

      {/* Card container */}
      <div
        className={`group rounded-lg px-7 py-4 shadow-sm transition-all flex h-full flex-col 

        `}
      >
        {/* Header */}
        <div className='mb-4'>
          <div className='flex items-start justify-between gap-2 mb-2'>
            <h3 className='font-semibold text-sm text-gray-900 leading-tight'>
              {course.courseTitle}
            </h3>
            <span
              className={`text-xs font-medium whitespace-nowrap px-2 py-0.5 rounded border ${badgeColor}`}
            >
              {course.courseCode}
            </span>
          </div>
          <p className='text-xs text-gray-500'>
            {course.department?.name || 'No department info'}
          </p>
        </div>

        {/* Stats */}
        <div className='flex flex-wrap items-center gap-2 text-xs mb-4 pb-4 border-b border-gray-100 text-gray-500'>
          <span>
            <span className='font-semibold text-gray-900'>{course.level}</span>{' '}
            Level
          </span>
          <span>•</span>
          <span>
            <span className='font-semibold text-gray-900'>{course.unit}</span>{' '}
            Unit
          </span>
          <span>•</span>
          <span>
            Status:{' '}
            <span
              className={`font-semibold ${
                isActionCompleted ? 'text-green-700' : 'text-gray-600'
              }`}
            >
              {isActionCompleted
                ? `${primaryActionText}ed`
                : `${secondaryActionText}ed`}
            </span>
          </span>
        </div>

        {/* Action Button */}
        {isActionCompleted ? (
          <Button
            onClick={() => onSecondaryAction(course._id)}
            variant='danger'
            className='gap-1  mt-auto text-sm'
            size='md'
            disabled={isLoading}
          >
            {isLoading ? (
              <ClipLoader size={20} color='white' />
            ) : (
              secondaryActionText
            )}
          </Button>
        ) : (
          <Button
            onClick={() => onPrimaryAction(course._id)}
            variant='primary'
            className='gap-1  mt-auto text-sm'
            size='md'
            disabled={isLoading}
          >
            {isLoading ? (
              <ClipLoader size={20} color='white' />
            ) : (
              primaryActionText
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

CourseAssignmentCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    courseCode: PropTypes.string.isRequired,
    courseTitle: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    unit: PropTypes.number.isRequired,
    department: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
    totalStudents: PropTypes.number,
    totalSessions: PropTypes.number,
    status: PropTypes.bool,
  }).isRequired,
  onPrimaryAction: PropTypes.func.isRequired,
  onSecondaryAction: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  showCheckbox: PropTypes.bool,
  isSelected: PropTypes.bool,
  onToggleSelect: PropTypes.func,
  primaryActionText: PropTypes.string,
  secondaryActionText: PropTypes.string,
  isActionCompleted: PropTypes.bool.isRequired,
};

export default CourseAssignmentCard;
