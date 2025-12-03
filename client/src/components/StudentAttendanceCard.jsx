import { useNavigate } from 'react-router-dom';
import { Calendar, AlertCircle, Clock } from 'lucide-react';
import PropTypes from 'prop-types';
import { getBadgeColor, getProgressBarColor } from '../utils/courseHelpers';
import { useSchoolInfo } from '../hooks/useSchoolInfo';
import Button from './Button';

function StudentAttendanceCard({ course, attendanceView = true }) {
  const { user } = useSchoolInfo();
  const { level } = user;
  const badgeColor = getBadgeColor(level);
  const navigate = useNavigate();
  
  const activeSessions = course.totalSessions - course.endedSessions;


  return (
    <div className='group relative bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-200 flex flex-col justify-between h-full'>
      {/* Header Section */}
      <div className='flex-grow'>
        {/* Course Title & Code */}
        <div className='flex items-start justify-between gap-3 mb-4'>
          <h3 className='flex-1 font-semibold capitalize text-base text-gray-900 leading-tight group-hover:text-blue-600 transition-colors'>
            {course.courseTitle}
          </h3>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-md border whitespace-nowrap ${badgeColor}`}
          >
            {course.courseCode}
          </span>
        </div>

        {/* Total Sessions Info */}
        <div className='flex items-center gap-1.5 mb-3 text-xs text-gray-600'>
          <Clock className='w-3.5 h-3.5' />
          <span>
            {course.totalSessions} total session{course.totalSessions !== 1 ? 's' : ''}
            {activeSessions > 0 && (
              <span className='text-yellow-600 font-medium ml-1'>
                ({activeSessions} active)
              </span>
            )}
          </span>
        </div>

        {/* Stats Row */}
        <div className='flex items-center gap-4 mb-4'>
          <div className='flex items-center gap-2'>
            <span className='text-xs text-gray-500'>Attended</span>
            <span className='text-sm font-bold text-green-600'>
              {course.totalAttended}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-xs text-gray-500'>Missed</span>
            <span className='text-sm font-bold text-red-600'>
              {course.totalMissed}
            </span>
          </div>
          {course.totalPending > 0 && (
            <div className='flex items-center gap-2'>
              <span className='text-xs text-gray-500'>Pending</span>
              <span className='text-sm font-bold text-yellow-600'>
                {course.totalPending}
              </span>
            </div>
          )}
        </div>

        {/* Eligibility Status */}
        {attendanceView && (
          <div className='mb-4'>
            {course.eligible ? (
              <span className='inline-flex items-center gap-1.5 text-green-700 text-xs font-medium'>
                <Calendar className='w-3.5 h-3.5' />
                Eligible for Exams
              </span>
            ) : (
              <span className='inline-flex items-center gap-1.5 text-red-700 text-xs font-medium'>
                <AlertCircle className='w-3.5 h-3.5' />
                Not Eligible for Exams
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className='space-y-3'>
        {/* Divider */}
        <div className='border-t border-gray-200' />

        {/* Progress Bar */}
        <div>
          <div className='flex justify-between items-center text-xs text-gray-600 mb-2'>
            <span>Attendance Rate</span>
            <span className='font-semibold text-gray-900'>
              {course.attendancePercentage}%
            </span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressBarColor(
                course.attendancePercentage
              )}`}
              style={{ width: `${course.attendancePercentage}%` }}
            />
          </div>
          {/* Clarification text */}
          <p className='text-[10px] text-gray-500 mt-1.5 text-center'>
            Based on {course.endedSessions} completed session{course.endedSessions !== 1 ? 's' : ''}
          </p>
        </div>

        {/* View Details Button */}
        <Button
          onClick={() => navigate(`/attendance/course/${course.courseId}`)}
          variant='primary'
          size='sm'
          fullWidth
          disabled={!course.totalSessions}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}

StudentAttendanceCard.propTypes = {
  course: PropTypes.object.isRequired,
  attendanceView: PropTypes.bool,
};

export default StudentAttendanceCard;