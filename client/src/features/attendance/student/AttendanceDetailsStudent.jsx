import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import Button from '../../../components/Button';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import { formatYear, formatTime } from '../../../utils/dateHelper';
import { useStudentSessionDetails } from './useStudentSessionDetails';
import SessionStudentsSkeleton from '../../../components/SessionStudentSkeleton';

function AttendanceDetailsStudent() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isPending } = useStudentSessionDetails(courseId);

  const course = data?.course || {};
  const sessions = data?.sessions || [];

  const columns = ['Date', 'Lecturer', 'Started At', 'Marked At', 'Status'];

  const renderRow = (session) => (
    <tr key={session.sessionId} className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4 text-sm font-medium text-gray-900'>
        {formatYear(session.sessionDate)}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {session.startedBy}
      </td>

      <td className='px-6 py-4 text-sm text-gray-700 whitespace-nowrap'>
        <span className='flex items-center gap-1'>
          <Clock className='w-4 h-4 text-gray-400' />
          {formatTime(session.sessionStartTime)}
        </span>
      </td>

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

      <td className='px-6 py-4'>
        {session.studentStatus === 'Present' ? (
          <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium'>
            <CheckCircle className='w-4 h-4' />
            Present
          </span>
        ) : session.studentStatus === 'Not yet taken' ? (
          <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium'>
            <Clock className='w-4 h-4' />
            Pending
          </span>
        ) : (
          <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium'>
            <XCircle className='w-4 h-4' />
            Absent
          </span>
        )}
      </td>
    </tr>
  );

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Course Attendance Details'
        subtitle='View your attendance history for this course'
      />

      {/* Back Button */}
      <div className='mb-6'>
        <Button variant='outline' size='md' onClick={() => navigate(-1)}>
          <ArrowLeft className='w-4 h-4' />
          Back
        </Button>
      </div>

      {isPending ? (
        <SessionStudentsSkeleton showSearchbar={false} />
      ) : (
        <>
          {/* Course Summary Card */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6'>
            <div className='border-b border-gray-100 pb-4 mb-4'>
              <h3 className='text-lg font-semibold text-gray-900 uppercase'>
                {course.courseCode}
              </h3>
              <p className='text-sm text-gray-600 capitalize mt-1'>
                {course.courseTitle}
              </p>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4'>
              <div>
                <p className='text-sm text-gray-600 mb-1'>Total Sessions</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {course.totalSessions}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600 mb-1'>Attended</p>
                <p className='text-2xl font-bold text-green-600'>
                  {course.totalAttended}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600 mb-1'>Missed</p>
                <p className='text-2xl font-bold text-red-600'>
                  {course.totalAbsent}
                </p>
              </div>
              {course.totalPending > 0 && (
                <div>
                  <p className='text-sm text-gray-600 mb-1'>Pending</p>
                  <p className='text-2xl font-bold text-yellow-600'>
                    {course.totalPending}
                  </p>
                </div>
              )}
              <div>
                <p className='text-sm text-gray-600 mb-1'>Attendance Rate</p>
                <p className='text-2xl font-bold text-blue-600'>
                  {course.attendancePercentage}%
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600 mb-1'>Exam Eligibility</p>
                {course.eligible ? (
                  <span className='inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium'>
                    <CheckCircle className='w-4 h-4' />
                    Eligible
                  </span>
                ) : (
                  <span className='inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium'>
                    <XCircle className='w-4 h-4' />
                    Not Eligible
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sessions Table */}
          {sessions.length === 0 ? (
            <EmptyCard
              icon={Calendar}
              title='No sessions yet'
              message='No attendance records found for this course'
              iconBg='bg-gray-100'
              iconColor='text-gray-400'
            />
          ) : (
            <DataTable columns={columns} renderRow={renderRow} data={sessions} />
          )}
        </>
      )}
    </div>
  );
}

export default AttendanceDetailsStudent;