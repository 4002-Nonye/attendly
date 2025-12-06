import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';

import { getStatusStyle } from '../../utils/courseHelpers';
import Button from '../Button';

function StudentAllCoursesRow({
  course,
  isSelected,
  onToggle,
  onEnroll,
  onUnenroll,
  isActionPending,
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
          className='w-4 h-4 rounded border-gray-300 focus:ring-0 transition-colors'
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
          <span className={statusStyle}>Enrolled</span>
        ) : (
          <span className={statusStyle}>Not Enrolled</span>
        )}
      </td>

      <td className='px-6 py-4'>
        <Button
          onClick={() =>
            course.status ? onUnenroll(course._id) : onEnroll(course._id)
          }
          variant={course.status ? 'danger' : 'primary'}
          className='gap-1 w-30'
          size='sm'
          disabled={isActionPending}
        >
          {isActionPending ? (
            <ClipLoader size={16} color='white' />
          ) : course.status ? (
            'Unenroll'
          ) : (
            'Enroll'
          )}
        </Button>
      </td>
    </tr>
  );
}

StudentAllCoursesRow.propTypes = {
  course: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onEnroll: PropTypes.func.isRequired,
  onUnenroll: PropTypes.func.isRequired,
  isActionPending: PropTypes.bool.isRequired,
};

export default StudentAllCoursesRow;