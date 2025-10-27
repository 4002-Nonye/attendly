import { Link } from 'react-router-dom';
import { ArrowRight} from 'lucide-react';
import { getBadgeColor, getProgressBarColor } from '../utils/courseHelpers';
import { useSchoolInfo } from '../hooks/useSchoolInfo';

function StudentCourseCard({ course }) {
  const { user } = useSchoolInfo();
  const { level } = user;
  const badgeColor = getBadgeColor(level);

  return (
    <div className='group relative bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-200'>
      {/* Header */}
      <div className='mb-4'>
        <div className='flex items-start justify-between gap-2 mb-3'>
          <div className='flex justify-between items-center w-full'>
            <h3 className='font-semibold text-base text-gray-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors'>
              {course.courseTitle}
            </h3>
            <span
              className={` text-xs font-medium px-2.5 py-1 rounded-md border ${badgeColor}`}
            >
              {course.courseCode}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='flex gap-3  items-center pb-4 border-b border-gray-100'>
        <div className='text-center flex  items-center gap-2'>
          <p className='text-xs  text-gray-500 '>Attended</p>
          <p className='text-xs text-gray-900 font-bold'>
            {course.totalAttended}
          </p>
        </div>
        <div className='text-center flex  items-center gap-2'>
          <p className='text-xs  text-gray-500 '>Total Sessions</p>
          <p className='text-xs text-gray-900 font-bold'>
            {course.totalSessions}
          </p>
        </div>
      </div>

      {/* Progress Bar  */}
      <div className='my-3'>
        <div className='flex justify-between text-xs text-gray-600 mb-2'>
          <span>Progress</span>
          <span className='font-medium'>{course.attendancePercentage}%</span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2.5 overflow-hidden'>
          <div
            className={`h-full rounded-full ${getProgressBarColor(
              course.attendancePercentage
            )} transition-all duration-500 ease-out`}
            style={{ width: `${course.attendancePercentage}%` }}
          />
        </div>
      </div>

      {/* CTA */}
      <Link
        to={`/courses/${course.courseId}`}
        className='flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-100 group-hover:shadow-sm transition-all'
      >
        <span>View Details</span>

        <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
      </Link>
    </div>
  );
}

export default StudentCourseCard;
