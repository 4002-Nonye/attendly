import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ReportButton from '../ReportButton';

function LecturerAttendanceOverviewRow({ course, onNavigate }) {
  return (
    <tr className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4'>
        <Link
          to={`course/${course._id}`}
          className='text-sm font-medium text-blue-600 hover:underline'
          title='View sessions for this course'
        >
          #{course._id.slice(-6).toUpperCase()}
        </Link>
      </td>
      <td className='px-6 py-4'>
        <span className='text-sm font-semibold text-gray-900 block capitalize'>
          {course.courseCode}
        </span>
        <span className='text-sm text-gray-600 block capitalize'>
          {course.courseTitle}
        </span>
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {course.totalSessions || 0}
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <ReportButton courseId={course._id} navigate={onNavigate} />
      </td>
    </tr>
  );
}

LecturerAttendanceOverviewRow.propTypes = {
  course: PropTypes.object.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default LecturerAttendanceOverviewRow;