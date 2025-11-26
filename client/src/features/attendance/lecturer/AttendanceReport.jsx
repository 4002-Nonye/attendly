import { AlertCircle, Calendar, Download, Search } from 'lucide-react';
import { useAttendanceReport } from './useAttendanceReport';
import { useNavigate, useParams } from 'react-router-dom';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import { useFilteredUsers } from '../../../hooks/filters/useFilteredUsers';
import {
  getAttendanceColor,
  getEligibilityStyle,
} from '../../../utils/courseHelpers';
import ReportSkeleton from '../../../components/ReportSkeleton';
import PageHeader from '../../../components/PageHeader';
import Alert from '../../../components/Alert';
import SearchBar from '../../../components/SearchBar';

import DataTable from '../../../components/DataTable';
import BackButton from '../../../components/BackButton';
import AttendanceReportHeader from '../../../components/AttendanceReportHeader';
import EmptyCard from '../../../components/EmptyCard';
import DownloadReportButton from '../../../components/DownloadReportButton';
import toast from 'react-hot-toast';
import { useDownloadReport } from '../admin/useDownloadReport';

function AttendanceReport() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useSearchQuery();
  const { courseId } = useParams();

  const { data, isPending } = useAttendanceReport(courseId);
  const { downloadAttendanceReport, isPending: isDownloading } =
    useDownloadReport();
  const course = data?.course || {};
  const summary = data?.summary || {};
  const students = data?.students || [];

  const filteredStudents = useFilteredUsers(students, searchQuery);

  const handleDownload = () => {
    if (!courseId) {
      toast.error('Course ID is missing');
      return;
    }
    downloadAttendanceReport(courseId);
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

  const renderRow = (student) => {
    return (
      <tr key={student.matricNo} className='hover:bg-gray-50 transition-colors'>
        <td className='px-6 py-4 text-sm font-medium text-gray-900 uppercase'>
          {student.matricNo}
        </td>
        <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
          {student.fullName}
        </td>
        <td className='px-6 py-4'>
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium'>
            Session {student.enrolledAtSession}
          </span>
        </td>
        <td className='px-6 py-4 '>
          <span className='text-sm font-semibold text-gray-900'>
            {student.totalSessions}
          </span>
        </td>
        <td className='px-6 py-4 '>
          <span className='text-sm font-semibold text-green-600'>
            {student.totalAttended}
          </span>
        </td>
        <td className='px-6 py-4 '>
          <span className='text-sm font-semibold text-red-600'>
            {student.totalAbsent}
          </span>
        </td>
        <td className='px-6 py-4 '>
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getAttendanceColor(
              student.attendancePercentage
            )}`}
          >
            {student.attendancePercentage}%
          </span>
        </td>
        <td className='px-6 py-4  '>
          {student.eligible ? (
            <span className={getEligibilityStyle(student.eligible)}>
              <Calendar className='w-3 h-3' />
              Eligible
            </span>
          ) : (
            <span className={getEligibilityStyle(student.eligible)}>
              <AlertCircle className='w-3 h-3' />
              Not Eligible
            </span>
          )}
        </td>
      </tr>
    );
  };

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

      {isPending && <ReportSkeleton />}

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
        <DataTable
          columns={columns}
          renderRow={renderRow}
          data={filteredStudents}
          isPending={false}
          showSkeletonHead={false}
        />
      )}
    </div>
  );
}

export default AttendanceReport;
