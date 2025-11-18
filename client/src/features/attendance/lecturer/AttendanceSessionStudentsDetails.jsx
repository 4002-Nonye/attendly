import { useState } from 'react';
import { Clock, Calendar, AlertCircle, Search } from 'lucide-react';

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

function AttendanceSessionStudentsDetails() {
  const { courseId, sessionId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useSearchQuery();

  const { data, isPending } = useSessionStudentDetails({
    courseId,
    sessionId,
  });

  const students = data?.students || [];
  const session = data?.session || {};
  const course = session?.course || {};

  // Filter students based on search query
  const filteredStudents = useFilteredUsers(students, searchQuery);

  const columns = ['Matric Number', 'Full Name', 'Status', 'Time Marked'];

  // Helper function to get status badge styling
  const getStatusStyle = (status) => {
    const styles = {
      Present: 'bg-green-100 text-green-800',
      Absent: 'bg-red-100 text-red-800',
      Pending: 'bg-yellow-100 text-yellow-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    if (status === 'Present') return '✓';
    if (status === 'Absent') return '✗';
    if (status === 'Pending') return '⏳';
    return '';
  };

  const renderRow = (student) => (
    <tr key={student.studentId} className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4 text-sm font-medium text-gray-900 uppercase'>
        {student.matricNo}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {student.fullName}
      </td>
      <td className='px-6 py-4'>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
            student.status
          )}`}
        >
          {getStatusIcon(student.status)} {student.status}
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

  // Calculate counts from filtered students
  const presentCount = filteredStudents.filter(
    (s) => s.status === 'Present'
  ).length;
  const absentCount = filteredStudents.filter(
    (s) => s.status === 'Absent'
  ).length;
  const pendingCount = filteredStudents.filter(
    (s) => s.status === 'Pending'
  ).length;
  const totalStudents = filteredStudents.length;

  // Calculate attendance rate (only for ended sessions)
  const isSessionEnded =
    session.status === 'ended' || session.status === 'closed';
  const attendanceRate =
    isSessionEnded && totalStudents > 0
      ? ((presentCount / totalStudents) * 100).toFixed(1)
      : null;

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
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6'>
          <div className='border-b border-gray-100 pb-4 mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              <span className='uppercase'>{course.courseCode}</span> -{' '}
              <span className='capitalize'>{course.courseTitle}</span>
            </h3>
            <div className='flex items-center gap-4 mt-2 text-sm text-gray-600'>
              <span className='flex items-center gap-1'>
                <Calendar className='w-4 h-4' />
                {formatYear(session.createdAt)}
              </span>
              <span className='flex items-center gap-1'>
                <Clock className='w-4 h-4' />
                {formatTime(session.createdAt)}
              </span>
            </div>
            <div className='mt-3'>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  session.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : session.status === 'ended' || session.status === 'closed'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                Session: {session.status}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
            <div>
              <p className='text-sm text-gray-600'>Total Students</p>
              <p className='text-2xl font-bold text-gray-900'>
                {students.length}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Present</p>
              <p className='text-2xl font-bold text-green-600'>
                {students.filter((s) => s.status === 'Present').length}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>
                {isSessionEnded ? 'Absent' : 'Pending'}
              </p>
              <p
                className={`text-2xl font-bold ${
                  isSessionEnded ? 'text-red-600' : 'text-yellow-600'
                }`}
              >
                {isSessionEnded
                  ? students.filter((s) => s.status === 'Absent').length
                  : students.filter((s) => s.status === 'Pending').length}
              </p>
            </div>
            {session.status === 'active' &&
              students.filter((s) => s.status === 'Absent').length > 0 && (
                <div>
                  <p className='text-sm text-gray-600'>Absent</p>
                  <p className='text-2xl font-bold text-red-600'>
                    {students.filter((s) => s.status === 'Absent').length}
                  </p>
                </div>
              )}
            <div>
              <p className='text-sm text-gray-600'>Attendance Rate</p>
              <p className='text-2xl font-bold text-blue-600'>
                {isSessionEnded && students.length > 0
                  ? `${(
                      (students.filter((s) => s.status === 'Present').length /
                        students.length) *
                      100
                    ).toFixed(1)}%`
                  : '-'}
              </p>
            </div>
          </div>

          {/* Warning for Active Sessions */}
          {session.status === 'active' &&
            students.filter((s) => s.status === 'Pending').length > 0 && (
              <div className='mt-4 pt-4 border-t border-gray-100'>
                <div className='flex items-start gap-2 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg'>
                  <AlertCircle className='w-4 h-4 mt-0.5 flex-shrink-0' />
                  <p>
                    This session is still active.{' '}
                    {students.filter((s) => s.status === 'Pending').length}{' '}
                    student
                    {students.filter((s) => s.status === 'Pending').length !== 1
                      ? 's'
                      : ''}
                    {students.filter((s) => s.status === 'Pending').length !== 1
                      ? ' have'
                      : ' has'}{' '}
                    not yet marked attendance.
                  </p>
                </div>
              </div>
            )}
        </div>
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
