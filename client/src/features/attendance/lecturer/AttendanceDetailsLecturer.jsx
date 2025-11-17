import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, FileText } from 'lucide-react';
import Button from '../../../components/Button';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import { getAttendanceColor } from '../../../utils/courseHelpers';
import { useSessionDetails } from './useSessionDetails';
import { formatYear, formatTime } from '../../../utils/dateHelper';

function AttendanceDetailsLecturer() {
  const { courseId } = useParams();

  const navigate = useNavigate();

  const { data, isPending } = useSessionDetails(courseId);

  const sessions = data?.sessionDetails || [];
  const course = data?.course || [];
  const columns = [
    'Date',
    'Time',
    'Total Students',
    'Present',
    'Absent',
    'Attendance Rate',
    'Actions',
  ];

  const renderRow = (session) => (
    <tr key={session._id} className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4 text-sm font-medium text-gray-900'>
        {formatYear(session.createdAt)}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 whitespace-nowrap'>
        {formatTime(session.createdAt)}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 '>
        {session.totalStudents}
      </td>
      <td className='px-6 py-4 text-sm text-green-600 font-medium'>
        {session.totalPresent}
      </td>
      <td className='px-6 py-4 text-sm text-red-600 font-medium'>
        {session.totalAbsent}
      </td>
      <td className='px-6 py-4'>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAttendanceColor(
            session.averageAttendance
          )}`}
        >
          {session.averageAttendance.toFixed(1)}%
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <Link to={`session/${session._id}`}>
          <Button variant='outline' size='sm'>
            <Eye className='w-4 h-4 block sm:hidden' />
            <span className='hidden sm:inline'>View details</span>
          </Button>
        </Link>
      </td>
    </tr>
  );

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Course Sessions'
        subtitle='View all attendance sessions for this course'
      />

      {/* Back Button and Report Button */}
      <div className='flex justify-between items-center mb-6'>
        <Button variant='outline' size='md' onClick={() => navigate(-1)}>
          <ArrowLeft className='w-4 h-4' />
          Back to overview
        </Button>

        <Button
          variant='primary'
          size='md'
          onClick={() => navigate(`/lecturer/attendance/report/${courseId}`)}
        >
          <span>View Report</span>
        </Button>
      </div>

      {/* Course Info */}

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 capitalize'>
          {course.courseCode} - {course.courseTitle}
        </h3>
        <p className='text-sm text-gray-600 mt-1'>
          Total Sessions:{' '}
          <span className='font-medium'>{sessions?.length || 0}</span>
        </p>
      </div>
      {/* Sessions Table */}
      {sessions.length === 0 && !isPending ? (
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
