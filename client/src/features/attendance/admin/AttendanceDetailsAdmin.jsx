import { FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '../../../components/Alert';
import AttendanceReportHeader from '../../../components/AttendanceReportHeader';
import BackButton from '../../../components/BackButton';
import DataTable from '../../../components/DataTable';
import DownloadReportButton from '../../../components/DownloadReportButton';
import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import ReportSkeleton from '../../../components/skeletons/ReportSkeleton';
import AdminAttendanceDetailsRow from '../../../components/tableRows/AdminAttendanceDetailsRow';
import { useFilteredUsers } from '../../../hooks/filters/useFilteredUsers';
import { usePagination } from '../../../hooks/usePagination';
import { useSchoolInfo } from '../../../hooks/useSchoolInfo';
import { useSearchQuery } from '../../../hooks/useSearchQuery';

import { useAttendanceDetails } from './useAttendanceDetails';
import { useDownloadReport } from './useDownloadReport';

function AttendanceDetailsAdmin() {
  const { courseId } = useParams();
  const [searchQuery, setSearchQuery] = useSearchQuery();
  const { data, isPending } = useAttendanceDetails(courseId);
  const { downloadAttendanceReport, isPending: isDownloading } =
    useDownloadReport();

  const { user } = useSchoolInfo();
  const { courseInfo, summary, students = [] } = data || {};
  const navigate = useNavigate();

  // filter students by search
  const filteredStudents = useFilteredUsers(students, searchQuery);

  const handleDownload = () => {
    if (!courseId) {
      toast.error('Course ID is missing');
      return;
    }
    downloadAttendanceReport({ courseId, role: user?.role });
  };

  const columns = [
    'S/N',
    'Matric No',
    'Name',
    'Enrolled At',
    'Sessions',
    'Attended',
    'Missed',
    'Rate',
    'Status',
  ];

  const renderRow = (student) => (
    <AdminAttendanceDetailsRow
      key={student.studentId}
      student={student}
      index={filteredStudents.indexOf(student)}
    />
  );

  // pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    currentData: paginatedStudents,
    setCurrentPage,
  } = usePagination(filteredStudents, 10);

  //  skeleton while loading
  if (isPending) {
    return (
      <div className='w-full'>
        <PageHeader
          showGreeting={false}
          title='Course Attendance Report'
          subtitle='Detailed attendance records for all students'
        />
        <div className='mb-6'>
          <BackButton navigate={navigate} text='Back' />
        </div>
        <ReportSkeleton />
      </div>
    );
  }

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Course Attendance Report'
        subtitle='Detailed attendance records for all students'
      />

      <div className='mb-6'>
        <BackButton navigate={navigate} text='Back' />
      </div>

      <AttendanceReportHeader
        course={courseInfo}
        summary={summary}
        showCourseDetails={true}
      />

      {/* Info Alert */}
      <Alert
        type='info'
        size='md'
        className='mb-6'
        message='Students are counted only for sessions after their enrollment date.'
      />

      {/* Search and Download */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <div className='flex gap-3 justify-between items-center'>
          <SearchBar
            placeholder='Search by matric No or name...'
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <DownloadReportButton
            onDownload={handleDownload}
            isDownloading={isDownloading}
            disabled={!courseId}
          >
            Download Report
          </DownloadReportButton>
        </div>
      </div>

      {/* Results Summary */}
      {filteredStudents.length > 0 ? (
        <div className='mb-4 text-sm text-gray-600'>
          Showing {filteredStudents.length} of {students.length} students
        </div>
      ) : null}

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <EmptyCard
          icon={FileText}
          title='No students found'
          message={
            searchQuery
              ? 'Try adjusting your search'
              : 'No students enrolled in this course'
          }
          iconBg='bg-gray-100'
          iconColor='text-gray-400'
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={paginatedStudents}
            renderRow={renderRow}
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
    </div>
  );
}

export default AttendanceDetailsAdmin;
