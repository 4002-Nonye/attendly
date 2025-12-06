import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';

import { getStatusStyle } from '../../utils/courseHelpers';
import Button from '../Button';

function LecturerAssignedCoursesRow({
  course,
  onCreateSession,
  isCreatingSession,
}) {
  const statusStyle = getStatusStyle(course.sessionStatus);
  const isActive = course.isOngoing;

  return (
    <tr className='hover:bg-gray-50 transition-colors'>
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
      <td className='px-6 py-4 text-sm'>
        <span className={statusStyle}>{course.sessionStatus}</span>
      </td>
      <td className='px-6 py-4'>
        <Button
          variant={!isActive ? 'primary' : 'secondary'}
          size='sm'
          className='capitalize text-sm mt-auto w-35'
          disabled={isCreatingSession || isActive}
          onClick={() => onCreateSession(course._id)}
        >
          {isCreatingSession ? (
            <ClipLoader size={22} color='white' />
          ) : isActive ? (
            'Session active'
          ) : (
            'Start Session'
          )}
        </Button>
      </td>
    </tr>
  );
}

LecturerAssignedCoursesRow.propTypes = {
  course: PropTypes.object.isRequired,
  onCreateSession: PropTypes.func.isRequired,
  isCreatingSession: PropTypes.bool.isRequired,
};

export default LecturerAssignedCoursesRow;