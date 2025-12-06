import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';

import { getStatusStyle } from '../../utils/courseHelpers';
import Button from '../Button';

function LecturerAllCoursesRow({
  course,
  isSelected,
  onToggle,
  onAssign,
  onUnassign,
  isActionPending,
  isBulkAssigning,
}) {
  const statusText = course.status ? 'active' : 'inactive';
  const statusStyle = getStatusStyle(statusText);

  return (
    <tr className='hover:bg-gray-50 transition-colors'>
      <td className='px-4 py-4'>
        <input
          type='checkbox'
          checked={isSelected || course.status}
          disabled={course.status}
          onChange={() => onToggle(course._id)}
          className='w-4 h-4 rounded border-gray-300 focus:ring-0'
        />
      </td>

      <td className='px-6 py-4'>
        <div>
          <div className='text-sm font-semibold text-gray-900 uppercase'>
            {course.courseCode}
          </div>
          <div className='text-sm text-gray-600 capitalize'>
            {course.courseTitle}
          </div>
        </div>
      </td>

      <td className='px-6 py-4 text-sm text-gray-700'>{course.level}L</td>
      <td className='px-6 py-4 text-sm text-gray-700'>{course.unit}</td>

      <td className='px-6 py-4'>
        {course.status ? (
          <span className={statusStyle}>Assigned</span>
        ) : (
          <span className={statusStyle}>Unassigned</span>
        )}
      </td>

      <td className='px-6 py-4'>
        <Button
          onClick={() =>
            course.status ? onUnassign(course._id) : onAssign(course._id)
          }
          variant={course.status ? 'danger' : 'primary'}
          className='gap-1 w-30'
          size='sm'
          disabled={isActionPending || isBulkAssigning}
        >
          {isActionPending ? (
            <ClipLoader size={16} color='white' />
          ) : course.status ? (
            'Unassign'
          ) : (
            'Assign'
          )}
        </Button>
      </td>
    </tr>
  );
}

LecturerAllCoursesRow.propTypes = {
  course: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onAssign: PropTypes.func.isRequired,
  onUnassign: PropTypes.func.isRequired,
  isActionPending: PropTypes.bool.isRequired,
  isBulkAssigning: PropTypes.bool.isRequired,
};

export default LecturerAllCoursesRow;
