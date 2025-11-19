import { useMemo } from 'react';
import { Clock, Search } from 'lucide-react';

import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import SearchBar from '../../../components/SearchBar';
import EmptyCard from '../../../components/EmptyCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useSessionStudentDetails } from './useSessionStudentDetails';
import { formatTime, formatYear } from '../../../utils/dateHelper';
import AttendanceCourseInfoSkeleton from '../../../components/AttendanceCourseInfoSkeleton';
import BackButton from '../../../components/BackButton';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import { useFilteredUsers } from '../../../hooks/filters/useFilteredUsers';
import { getStatusBadge } from '../../../utils/courseHelpers';

import SessionInfoCard from '../../../components/SessionInfoCard';

function AttendanceSessionStudentsDetails() {
  const { courseId, sessionId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useSearchQuery();

  const { data, isPending } = useSessionStudentDetails({
    courseId,
    sessionId,
  });

  const students = useMemo(() => data?.students || [], [data?.students]);
  const session = data?.session || {};
  const course = session?.course || {};

  // Filter students based on search query
  const filteredStudents = useFilteredUsers(students, searchQuery);

  // Calculate stats 
  const stats = useMemo(() => {
    const presentCount = students.filter((s) => s.status === 'Present').length;
    const absentCount = students.filter((s) => s.status === 'Absent').length;
    const pendingCount = students.filter((s) => s.status === 'Pending').length;
    const totalStudents = students.length;
    const attendanceRate =
      totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : 0;

    return {
      presentCount,
      absentCount,
      pendingCount,
      totalStudents,
      attendanceRate,
    };
  }, [students]);

  const isSessionEnded =
    session.status === 'ended' || session.status === 'closed';

  const columns = ['Matric Number', 'Full Name', 'Status', 'Time Marked'];

const renderRow = (student) => {
  const { className, label, icon: Icon } = getStatusBadge(student.status);

  return (
    <tr key={student.studentId} className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4 text-sm font-medium text-gray-900 uppercase'>
        {student.matricNo}
      </td>

      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {student.fullName}
      </td>

      <td className='px-6 py-4 whitespace-nowrap'>
        <span
          className={`inline-flex items-center gap-1 px-2.5  rounded-full text-xs font-medium py-1 ${className}`}
        >
          <Icon className='w-4 h-4 ' />
          {label}
        </span>
      </td>

      <td className='px-6 py-4 text-sm text-gray-700'>
        {student.timeMarked ? (
          <span className='flex items-center gap-1'>
            <Clock className='w-4 h-4' />
            {formatTime(student.timeMarked)}
          </span>
        ) : (
          <span className='text-gray-400'>-</span>
        )}
      </td>
    </tr>
  );
};

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Session Attendance Details'
        subtitle='View individual student attendance for this session'
      />

      {/* Back Button */}
      <div className='mb-6'>
        <BackButton navigate={navigate} text='Back to sessions' />
      </div>

      {/* Session Info Card with Skeleton */}
      {isPending ? (
        <AttendanceCourseInfoSkeleton height={'10rem'} />
      ) : session._id ? (
        <SessionInfoCard
          course={course}
          session={{
            status: session.status,
            formattedDate: formatYear(session.createdAt),
            formattedStartTime: formatTime(session.createdAt),
          }}
          stats={stats}
          isSessionEnded={isSessionEnded}

        />
      ) : null}

      {/* Search Bar */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <SearchBar
          placeholder='Search by name or matric number...'
          value={searchQuery}
          onChange={setSearchQuery}
          disabled={isPending}
        />
      </div>

      {/* Students Table */}
      {!filteredStudents.length && !isPending ? (
        <EmptyCard
          icon={Search}
          title='No students found'
          message={
            searchQuery
              ? 'Try adjusting your search query'
              : 'No students enrolled in this session'
          }
          iconBg='bg-gray-100'
          iconColor='text-gray-400'
        />
      ) : (
        <DataTable
          columns={columns}
          renderRow={renderRow}
          data={filteredStudents}
          isPending={isPending}
          showSkeletonHead={false}
        />
      )}
    </div>
  );
}

export default AttendanceSessionStudentsDetails;
