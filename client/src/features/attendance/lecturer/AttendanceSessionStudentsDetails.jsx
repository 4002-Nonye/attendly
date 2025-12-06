import { useMemo } from 'react';
import {  Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import BackButton from '../../../components/BackButton';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import SessionInfoCard from '../../../components/SessionInfoCard';
import SessionStudentsSkeleton from '../../../components/skeletons/SessionStudentSkeleton';
import LecturerSessionAttendanceRow from '../../../components/tableRows/LecturerSessionAttendanceRow';
import { useFilteredUsers } from '../../../hooks/filters/useFilteredUsers';
import { usePagination } from '../../../hooks/usePagination';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import { formatTime, formatYear } from '../../../utils/dateHelper';

import { useSessionStudentDetails } from './useSessionStudentDetails';

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

  // filter students based on search query
  const filteredStudents = useFilteredUsers(students, searchQuery);

  // calculate stats
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

  // pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    currentData: paginatedStudents,
    setCurrentPage,
  } = usePagination(filteredStudents, 10);

  
  const isSessionEnded =
    session.status === 'ended' || session.status === 'closed';

  const columns = ['Matric Number', 'Full Name', 'Status', 'Time Marked'];

const renderRow = (student) => (
  <LecturerSessionAttendanceRow key={student.studentId} student={student} />
);

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Session Attendance Details'
        subtitle='View individual student attendance for this session'
      />

      {/* Back Button */}
      <div className='mb-6'>
        <BackButton navigate={navigate} text='Back' />
      </div>

      {isPending ? (
        <SessionStudentsSkeleton />
      ) : (
        <>
          {/* Session Info Card */}
          {session._id && (
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
          )}

          {/* Search Bar */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
            <SearchBar
              placeholder='Search by name or matric No...'
              value={searchQuery}
              onChange={setSearchQuery}
              disabled={false}
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
            <>
              {' '}
              <DataTable
                columns={columns}
                renderRow={renderRow}
                data={paginatedStudents}
                showSkeletonHead={false}
              />
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AttendanceSessionStudentsDetails;
