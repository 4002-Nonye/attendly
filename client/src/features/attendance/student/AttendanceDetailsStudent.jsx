import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import Button from '../../../components/Button';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import Alert from '../../../components/Alert';
import { formatYear, formatTime } from '../../../utils/dateHelper';
import { useStudentSessionDetails } from './useStudentSessionDetails';
import SessionStudentsSkeleton from '../../../components/SessionStudentSkeleton';
import StudentSessionSummary from '../../../components/StudentSessionSummary';

function AttendanceDetailsStudent() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isPending } = useStudentSessionDetails(courseId);

  const course = data?.course || {};
  const sessions = data?.sessions || [];

  const columns = [
    'Date',
    'Lecturer',
    'Started At',
    'Marked At',
    'Status',
    'Session Status',
  ];

  const renderRow = (session) => (
    <tr key={session.sessionId} className='hover:bg-gray-50 transition-colors'>
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
        {session.studentStatus === 'Present' ? (
          <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium'>
            <CheckCircle className='w-4 h-4' />
            Present
          </span>
        ) : session.studentStatus === 'Pending' ? (
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

      {/* TODO: USE RESUABLE UTILS */}
      {/* Session Status */}
      <td className='px-6 py-4'>
        {session.sessionStatus === 'ended' ? (
          <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium'>
            Ended
          </span>
        ) : session.sessionStatus === 'active' ? (
          <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium'>
            Active
          </span>
        ) : (
          <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium capitalize'>
            {session.sessionStatus}
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
            <>
              {/* Course Summary Card */}
              <StudentSessionSummary course={course} />

              {/* Info Alert */}
              <Alert type='info' size='sm' showBorder className='mb-6'>
                <div className='space-y-2 text-sm'>
                  <p>
                    Your attendance rate and eligibility are calculated based on
                    completed sessions only. Active sessions are not yet
                    counted.
                  </p>
                  <p>
                    Eligibility is determined using your school's attendance
                    threshold, though lecturers may adjust this for individual
                    course reports.
                  </p>
                </div>
              </Alert>

              <DataTable
                columns={columns}
                renderRow={renderRow}
                data={sessions}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AttendanceDetailsStudent;
