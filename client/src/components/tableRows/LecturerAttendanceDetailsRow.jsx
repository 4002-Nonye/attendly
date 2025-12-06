import { Eye } from 'lucide-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getAttendanceColor } from '../../utils/courseHelpers';
import { formatTime, formatYear } from '../../utils/dateHelper';
import Button from '../Button';

function LecturerAttendanceDetailsRow({ session }) {
  const isActive = session.status === 'active';
  const isEnded = session.status === 'ended';

  return (
    <tr className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4 text-sm font-medium text-gray-900'>
        {formatYear(session.createdAt)}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 whitespace-nowrap'>
        {formatTime(session.createdAt)}
      </td>
      <td
        className={`px-6 py-4 text-sm whitespace-nowrap ${
          isActive ? 'text-green-600 font-medium' : 'text-gray-700'
        }`}
      >
        {isActive ? 'Ongoing' : formatTime(session.updatedAt)}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 text-center'>
        {session.totalStudents}
      </td>
      <td className='px-6 py-4 text-sm text-green-600 font-medium text-center'>
        {session.totalPresent}
      </td>
      <td className='px-6 py-4 text-sm text-center'>
        {isEnded ? (
          <span className='text-red-600 font-medium'>
            {session.totalAbsent}
          </span>
        ) : isActive ? (
          <span className='text-yellow-600 font-medium'>
            {session.totalPending}{' '}
            <span className='text-xs text-gray-500'>(Pending)</span>
          </span>
        ) : (
          <span className='text-gray-400'>-</span>
        )}
      </td>
      <td className='px-6 py-4 text-center'>
        {session.averageAttendance !== null ? (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAttendanceColor(
              session.averageAttendance
            )}`}
          >
            {session.averageAttendance.toFixed(1)}%
          </span>
        ) : session.totalStudents > 0 ? (
          <span className='text-xs text-gray-500 italic'>In Progress</span>
        ) : (
          <span className='text-xs text-gray-500 italic'>—</span>
        )}
      </td>
      <td className='px-6 py-4'>
        <Link to={`session/${session._id}`}>
          <Button variant='outline' size='sm'>
            <Eye className='w-4 h-4 block sm:hidden' />
            <span className='hidden sm:inline'>View details</span>
          </Button>
        </Link>
      </td>
    </tr>
  );
}

LecturerAttendanceDetailsRow.propTypes = {
  session: PropTypes.object.isRequired,
};

export default LecturerAttendanceDetailsRow;