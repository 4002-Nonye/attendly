import { Clock } from 'lucide-react';
import PropTypes from 'prop-types';

import { getSessionStatusBadge } from '../../utils/courseHelpers';
import { formatTime, formatYear } from '../../utils/dateHelper';
import StatusBadge from '../StatusBadge';

function StudentAttendanceDetailsRow({ session }) {
  return (
    <tr className='hover:bg-gray-50 transition-colors'>
      {/* Date */}
      <td className='px-6 py-4 text-sm font-medium text-gray-900'>
        {formatYear(session.sessionDate)}
      </td>

      {/* Lecturer */}
      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {session.startedBy}
      </td>

      {/* Started At */}
      <td className='px-6 py-4 text-sm text-gray-700 whitespace-nowrap'>
        <span className='flex items-center gap-1'>
          <Clock className='w-4 h-4 text-gray-400' />
          {formatTime(session.sessionDate)}
        </span>
      </td>

      {/* Marked At */}
      <td className='px-6 py-4 text-sm text-gray-700 whitespace-nowrap'>
        {session.timeMarked ? (
          <span className='flex items-center gap-1'>
            <Clock className='w-4 h-4 text-gray-400' />
            {formatTime(session.timeMarked)}
          </span>
        ) : (
          <span className='text-gray-400'>-</span>
        )}
      </td>

      {/* Student Status */}
      <td className='px-6 py-4'>
        <StatusBadge status={session.studentStatus} />
      </td>

      {/* Session Status */}
      <td className='px-6 py-4'>
        <span className={getSessionStatusBadge(session.sessionStatus)}>
          {session.sessionStatus}
        </span>
      </td>
    </tr>
  );
}

StudentAttendanceDetailsRow.propTypes = {
  session: PropTypes.object.isRequired,
};

export default StudentAttendanceDetailsRow;
