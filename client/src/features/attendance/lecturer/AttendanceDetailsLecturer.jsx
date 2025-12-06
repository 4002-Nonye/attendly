import { Calendar } from 'lucide-react';
import {  useNavigate, useParams } from 'react-router-dom';

import AttendanceSessionInfoCard from '../../../components/AttendanceSessionInfoCard';
import BackButton from '../../../components/BackButton';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import Pagination from '../../../components/Pagination';
import ReportButton from '../../../components/ReportButton';
import AttendanceDetailsSkeleton from '../../../components/skeletons/AttendanceDetailsSkeleton';
import LecturerAttendanceDetailsRow from '../../../components/tableRows/LecturerAttendanceDetailsRow';
import { usePagination } from '../../../hooks/usePagination';

import { useSessionDetails } from './useSessionDetails';

function AttendanceDetailsLecturer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isPending } = useSessionDetails(courseId);

  const sessions = data?.sessionDetails || [];
  const course = data?.course || {};

  // pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    currentData: paginatedSessions,
    setCurrentPage,
  } = usePagination(sessions, 10);

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

  const renderRow = (session) => (
    <LecturerAttendanceDetailsRow key={session._id} session={session} />
  );

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Course Sessions'
        subtitle='View all attendance sessions for this course'
      />

      {/* Back & Report Buttons */}
      <div className='flex justify-between items-center mb-6'>
        <BackButton navigate={navigate} text='Back' />
        <ReportButton
          courseId={courseId}
          isPending={isPending}
          navigate={navigate}
        />
      </div>

      {isPending ? (
        <AttendanceDetailsSkeleton />
      ) : (
        <>
          {/* Course Info */}
          {course._id && (
            <AttendanceSessionInfoCard course={course} sessions={sessions} />
          )}

          {/* Sessions Table */}
          {!sessions.length ? (
            <EmptyCard
              icon={Calendar}
              title='No sessions yet'
              message='Start taking attendance for this course'
              iconBg='bg-gray-100'
              iconColor='text-gray-400'
            />
          ) : (
            <>
              <DataTable
                columns={columns}
                renderRow={renderRow}
                data={paginatedSessions}
                isPending={false}
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

export default AttendanceDetailsLecturer;
