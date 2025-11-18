import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Eye } from 'lucide-react';
import Button from '../../../components/Button';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import AttendanceCourseInfoSkeleton from '../../../components/AttendanceCourseInfoSkeleton';
import { useSessionDetails } from './useSessionDetails';
import { getAttendanceColor } from '../../../utils/courseHelpers';
import { formatYear, formatTime } from '../../../utils/dateHelper';
import BackButton from '../../../components/BackButton';
import ReportButton from '../../../components/ReportButton';
import AttendanceSessionInfoCard from '../../../components/AttendanceSessionInfoCard';



function AttendanceDetailsLecturer() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isPending } = useSessionDetails(courseId);

  const sessions = data?.sessionDetails || [];
  const course = data?.course || {};

  
  const columns = [
    'Date',
    'Started At',
    'Ended At',
    'Total Students',
    'Present',
    'Absent/Pending',
    'Attendance Rate',
    'Actions',
  ];


// Session Row
const renderRow = (session) => {
  const isActive = session.status === 'active';
  const isEnded = session.status === 'ended';

  return (
    <tr key={session._id} className='hover:bg-gray-50 transition-colors'>
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
          <span className='text-red-600 font-medium'>{session.totalAbsent}</span>
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
        ) : (
          <span className='text-xs text-gray-500 italic'>In Progress</span>
        )}
      </td>
      <td className='px-6 py-4'>
        <Link to={`session/${session._id}`}>
          <Button variant='outline' size='sm'>
            <Eye className='w-4 h-4 block sm:hidden' />
            <span className='hidden sm:inline'>View</span>
          </Button>
        </Link>
      </td>
    </tr>
  );
};

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Course Sessions'
        subtitle='View all attendance sessions for this course'
      />

      {/* Back & Report Buttons */}
      <div className='flex justify-between items-center mb-6'>
        <BackButton navigate={navigate} text='Back to overview' />
        <ReportButton courseId={courseId} isPending={isPending} navigate={navigate} />
      </div>

      {/* Course Info */}
      {isPending ? (
        <AttendanceCourseInfoSkeleton />
      ) : course._id ? (
        <AttendanceSessionInfoCard course={course} sessions={sessions} />
      ) : null}

      {/* Sessions Table */}
      {!sessions.length && !isPending ? (
        <EmptyCard
          icon={Calendar}
          title='No sessions yet'
          message='Start taking attendance for this course'
          iconBg='bg-gray-100'
          iconColor='text-gray-400'
        />
      ) : (
        <DataTable
          columns={columns}
          renderRow={renderRow}
          data={sessions}
          isPending={isPending}
          showSkeletonHead={false}
        />
      )}
    </div>
  );
}

export default AttendanceDetailsLecturer;
