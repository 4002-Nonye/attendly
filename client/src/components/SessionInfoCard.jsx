
import PropTypes from 'prop-types';
import { Calendar, Clock } from 'lucide-react';
import Alert from './Alert';
import SessionStatsGrid from './SessionStatsGrid';
import { getStatusStyle } from '../utils/courseHelpers';

function SessionInfoCard({
  course,
  session,
  stats,
  isSessionEnded,

}) {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6'>
      {/* Header */}
      <div className='border-b border-gray-100 pb-4 mb-4'>
        <h3 className='text-lg font-semibold text-gray-900'>
          <span className='uppercase'>{course.courseCode}</span> -{' '}
          <span className='capitalize'>{course.courseTitle}</span>
        </h3>

        {/* Date + Time */}
        <div className='flex items-center gap-4 mt-2 text-sm text-gray-600'>
          <span className='flex items-center gap-1'>
            <Calendar className='w-4 h-4' />
            {session.formattedDate}
          </span>
          <span className='flex items-center gap-1'>
            <Clock className='w-4 h-4' />
            {session.formattedStartTime}
          </span>
        </div>

        {/* Status */}
        <div className='mt-3'>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
            getStatusStyle(session.status)
            }`}
          >
            Session: {session.status}
          </span>
        </div>
      </div>

      {/* Stats Grid Component */}
      <SessionStatsGrid
        stats={stats}
        isSessionEnded={isSessionEnded}
        sessionStatus={session.status}
      />

      {/* Active-session warning */}
      {session.status === 'active' && stats.pendingCount > 0 && (
        <div className='mt-4 pt-4 border-t border-gray-100'>
          <Alert
            type='warning'
            message={
              <>
                This session is still active. {stats.pendingCount} student
                {stats.pendingCount !== 1 ? 's' : ''}{' '}
                {stats.pendingCount !== 1 ? 'have' : 'has'} not yet marked
                attendance.
              </>
            }
          />
        </div>
      )}
    </div>
  );
}

SessionInfoCard.propTypes = {
  course: PropTypes.shape({
    courseCode: PropTypes.string.isRequired,
    courseTitle: PropTypes.string.isRequired,
  }).isRequired,
  session: PropTypes.shape({
    status: PropTypes.string.isRequired,
    formattedDate: PropTypes.string.isRequired,
    formattedStartTime: PropTypes.string.isRequired,
  }).isRequired,
  stats: PropTypes.object.isRequired,
  isSessionEnded: PropTypes.bool.isRequired,

};

export default SessionInfoCard;
