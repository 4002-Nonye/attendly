import { Clock } from 'lucide-react';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';

import { formatTime } from '../../utils/dateHelper';
import Button from '../Button';

function StudentActiveSessionRow({ session, onMarkAttendance, isMarking }) {
  const marked = session.attendanceMarked;

  return (
    <tr className='hover:bg-gray-50'>
      {/* Course */}
      <td className='px-6 py-4'>
        <div>
          <div className='text-sm font-semibold text-gray-900 uppercase'>
            {session.course.courseCode}
          </div>
          <div className='text-sm text-gray-600 capitalize'>
            {session.course.courseTitle}
          </div>
        </div>
      </td>

      {/* Status */}
      <td className='px-6 py-4'>
        <div className='flex items-center gap-2'>
          <span className='relative flex h-2 w-2'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
          </span>
          <span className='text-sm font-medium text-green-700 capitalize'>
            {session.status}
          </span>
        </div>
      </td>

      {/* Started By */}
      <td className='px-6 py-4'>
        <div className='text-sm font-medium text-gray-900 whitespace-nowrap'>
          {session.startedBy.fullName}
        </div>
      </td>

      {/* Started At */}
      <td className='px-6 py-4'>
        <div className='flex items-center gap-1.5 text-sm text-gray-700 whitespace-nowrap'>
          <Clock size={16} className='text-gray-400' />
          {formatTime(session.createdAt)}
        </div>
      </td>

      {/* Actions */}
      <td className='px-6 py-4'>
        <Button
          onClick={() => onMarkAttendance(session._id)}
          variant={marked ? 'secondary' : 'primary'}
          disabled={isMarking || marked}
          size='sm'
          className='capitalize whitespace-nowrap w-38'
        >
          {isMarking ? (
            <ClipLoader size={22} color='#fff' />
          ) : marked ? (
            'Marked'
          ) : (
            'Mark attendance'
          )}
        </Button>
      </td>
    </tr>
  );
}

StudentActiveSessionRow.propTypes = {
  session: PropTypes.object.isRequired,
  onMarkAttendance: PropTypes.func.isRequired,
  isMarking: PropTypes.bool.isRequired,
};

export default StudentActiveSessionRow;