import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Search } from 'lucide-react';
import { useButtonState } from '../../../hooks/useButtonState';
import DataTable from '../../../components/DataTable';
import Button from '../../../components/Button';
import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import SearchBar from '../../../components/SearchBar';
import { useAttendanceOverview } from './useAttendanceOverview';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import { useFilteredCourses } from '../../../hooks/filters/useFilteredCourses';
import { getAttendanceColor } from '../../../utils/courseHelpers';
import ReportButton from '../../../components/ReportButton';

function AttendanceOverviewLecturer() {
  const { disableButton } = useButtonState();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useSearchQuery();

  const { data, isPending } = useAttendanceOverview();

  // filter courses
  const filteredCourses = useFilteredCourses(data?.overview, searchQuery);

  const columns = [
    'ID',
    'Course',
    'Total Sessions',
    'Total Students',
    'Avg Attendance',
    'Actions',
  ];

  const renderRow = (course) => (
    <tr key={course._id} className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4'>
        <Link
          to={`course/${course._id}`}
          className='text-sm  font-medium text-blue-600 hover:underline'
          title='View sessions for this course'
        >
          #{course._id.slice(-6).toUpperCase()}
        </Link>
      </td>
      <td className='px-6 py-4'>
        <span className='text-sm font-semibold text-gray-900 block capitalize'>
          {course.courseCode}
        </span>
        <span className='text-sm text-gray-600 block capitalize'>
          {course.courseTitle}
        </span>
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 text-center'>
        {course.totalSessions || 0}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 text-center'>
        {course.totalStudents || 0}
      </td>
      <td className='px-6 py-4 text-center'>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getAttendanceColor(
            course.averageAttendance
          )}`}
        >
          {course.averageAttendance?.toFixed(1) || 0}%
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <ReportButton courseId={course._id} navigate={navigate} />
      </td>
    </tr>
  );

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Attendance Records'
        subtitle='View attendance reports and session details for your courses'
      />

      {/* Search Bar */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <SearchBar
          placeholder='Search course code or title...'
          value={searchQuery}
          onChange={setSearchQuery}
          disabled={disableButton}
        />
      </div>

      {/* Table or Empty State */}
      {!filteredCourses?.length && !isPending ? (
        <EmptyCard
          icon={searchQuery ? Search : Calendar}
          title={searchQuery ? 'No courses found' : 'No attendance data'}
          message={
            searchQuery
              ? 'Try adjusting your search query'
              : 'There are no attendance records at the moment'
          }
          iconBg='bg-gray-100'
          iconColor='text-gray-400'
        />
      ) : (
        <DataTable
          columns={columns}
          renderRow={renderRow}
          data={filteredCourses}
          isPending={isPending}
          showSkeletonHead={false}
        />
      )}
    </div>
  );
}

export default AttendanceOverviewLecturer;
