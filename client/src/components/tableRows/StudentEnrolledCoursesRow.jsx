import PropTypes from 'prop-types';

import { getStatusStyle } from '../../utils/courseHelpers';

function StudentEnrolledCoursesRow({ course }) {
  const statusStyle = getStatusStyle(course.sessionStatus);

  return (
    <tr className='hover:bg-gray-50 transition-colors capitalize'>
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
        <span
          className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${statusStyle}`}
        >
          {course.sessionStatus}
        </span>
      </td>
    </tr>
  );
}

StudentEnrolledCoursesRow.propTypes = {
  course: PropTypes.object.isRequired,
};

export default StudentEnrolledCoursesRow;