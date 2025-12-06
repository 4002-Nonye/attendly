import { ArrowLeft, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '../../../components/Alert';
import Button from '../../../components/Button';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import Pagination from '../../../components/Pagination';
import SessionStudentsSkeleton from '../../../components/skeletons/SessionStudentSkeleton';
import StudentSessionSummary from '../../../components/StudentSessionSummary';
import StudentAttendanceDetailsRow from '../../../components/tableRows/StudentAttendanceDetailsRow';
import { usePagination } from '../../../hooks/usePagination';

import { useStudentSessionDetails } from './useStudentSessionDetails';

function AttendanceDetailsStudent() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isPending } = useStudentSessionDetails(courseId);

  const course = data?.course || {};
  const sessions = data?.sessions || [];

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
    'Lecturer',
    'Started At',
    'Marked At',
    'Status',
    'Session Status',
  ];

  const renderRow = (session) => (
  <StudentAttendanceDetailsRow key={session.sessionId} session={session} />
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
                data={paginatedSessions}
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

export default AttendanceDetailsStudent;
