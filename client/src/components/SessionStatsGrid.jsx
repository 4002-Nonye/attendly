import PropTypes from 'prop-types';

function SessionStatsGrid({ stats, isSessionEnded, sessionStatus }) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
      {/* Total Students */}
      <div>
        <p className='text-sm text-gray-600'>Total Students</p>
        <p className='text-lg font-bold text-gray-900'>
          {stats.totalStudents}
        </p>
      </div>

      {/* Present */}
      <div>
        <p className='text-sm text-gray-600'>Present</p>
        <p className='text-lg font-bold text-green-600'>
          {stats.presentCount}
        </p>
      </div>

      {/* Absent or Pending */}
      <div>
        <p className='text-sm text-gray-600'>
          {isSessionEnded ? 'Absent' : 'Pending'}
        </p>
        <p
          className={`text-lg font-bold ${
            isSessionEnded ? 'text-red-600' : 'text-yellow-600'
          }`}
        >
          {isSessionEnded ? stats.absentCount : stats.pendingCount}
        </p>
      </div>

      {/* Show Absent separately only for active sessions */}
      {sessionStatus === 'active' && stats.absentCount > 0 && (
        <div>
          <p className='text-sm text-gray-600'>Absent</p>
          <p className='text-lg font-bold text-red-600'>
            {stats.absentCount}
          </p>
        </div>
      )}

      {/* Attendance Rate */}
      <div>
        <p className='text-sm text-gray-600'>Attendance Rate</p>
        <p className='text-lg font-bold text-blue-600'>
          {isSessionEnded && stats.totalStudents > 0
            ? `${stats.attendanceRate}%`
            : '-'}
        </p>
      </div>
    </div>
  );
}

SessionStatsGrid.propTypes = {
  stats: PropTypes.object.isRequired,
  isSessionEnded: PropTypes.bool.isRequired,
  sessionStatus: PropTypes.string.isRequired,
};

export default SessionStatsGrid;
