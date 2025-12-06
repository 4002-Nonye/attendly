import {  Calendar, Search } from 'lucide-react';
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
import LecturerAttendanceReportRow from '../../../components/tableRows/LecturerAttendanceReportRow';
import { useFilteredUsers } from '../../../hooks/filters/useFilteredUsers';
import { usePagination } from '../../../hooks/usePagination';
import { useSchoolInfo } from '../../../hooks/useSchoolInfo';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import { useDownloadReport } from '../admin/useDownloadReport';

import { useAttendanceReport } from './useAttendanceReport';

function AttendanceReport() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useSearchQuery();
  const { courseId } = useParams();
  const { user } = useSchoolInfo();

  const { data, isPending } = useAttendanceReport(courseId);
  const { downloadAttendanceReport, isPending: isDownloading } =
    useDownloadReport();
  const course = data?.course || {};
  const summary = data?.summary || {};
  const students = data?.students || [];

  const filteredStudents = useFilteredUsers(students, searchQuery);

  // pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    currentData: paginatedStudents,
    setCurrentPage,
  } = usePagination(filteredStudents, 10);

  const handleDownload = () => {
    if (!courseId) {
      toast.error('Course ID is missing');
      return;
    }
    downloadAttendanceReport({ courseId, role: user?.role });
  };

  const columns = [
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
  <LecturerAttendanceReportRow key={student.matricNo} student={student} />
);


  return (
    <div className='w-full'>
      {/* Header */}
      <PageHeader
        showGreeting={false}
        title='Attendance Report'
        subtitle='Student attendance report for this course'
      />

      {/* Back Button */}
      <div className='mb-6'>
        <BackButton navigate={navigate} text='Back' />
      </div>

      {isPending ? (
        <ReportSkeleton />
      ) : (
        <>
          <AttendanceReportHeader course={course} summary={summary} />

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

          {/* Table or Empty State */}
          {!filteredStudents?.length ? (
            <EmptyCard
              icon={searchQuery ? Search : Calendar}
              title={searchQuery ? 'No students found' : 'No attendance data'}
              message={
                searchQuery
                  ? 'Try adjusting your search query'
                  : 'There are no attendance records for this course'
              }
              iconBg='bg-gray-100'
              iconColor='text-gray-400'
            />
          ) : (
            <>
              <DataTable
                columns={columns}
                renderRow={renderRow}
                data={paginatedStudents}
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

export default AttendanceReport;
