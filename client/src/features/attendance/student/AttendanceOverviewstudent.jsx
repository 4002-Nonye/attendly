import { AlertCircle, BookOpen, Calendar, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/Button';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import StudentAttendanceCardSkeleton from '../../../components/skeletons/StudentCardSkeleton';
import StudentAttendanceCard from '../../../components/StudentAttendanceCard';
import { useFilteredCourses } from '../../../hooks/filters/useFilteredCourses';
import { usePagination } from '../../../hooks/usePagination';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import {
  getAttendanceColor,
  getEligibilityStyle,
} from '../../../utils/courseHelpers';

import { useStudentAttReport } from './useStudentAttReport';

function AttendanceOverviewStudent() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useSearchQuery();

  const { data, isPending } = useStudentAttReport();

  const courses = data?.report || [];

  // Filter courses by search query
  const filteredCourses = useFilteredCourses(courses, searchQuery);

  // pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    currentData: paginatedCourses,
    setCurrentPage,
  } = usePagination(filteredCourses, 10);

  // Table columns
  const columns = [
    'Course Code',
    'Course Title',
    'Sessions',
    'Attended',
    'Pending',
    'Missed',

    'Attendance Rate',
    'Eligibility',
    'Actions',
  ];

  // Table row renderer
  const renderRow = (course) => (
    <tr key={course.courseId} className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4 text-sm font-semibold text-gray-900 uppercase'>
        {course.courseCode}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {course.courseTitle}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 text-center'>
        {course.totalSessions}
      </td>
      <td className='px-6 py-4 text-sm font-medium text-green-600 text-center'>
        {course.totalAttended}
      </td>
      <td className='px-6 py-4 text-sm font-medium text-yellow-600 text-center'>
        {course.totalPending}
      </td>
      <td className='px-6 py-4 text-sm font-medium text-red-600 text-center'>
        {course.totalMissed}
      </td>
      <td className='px-6 py-4 text-center'>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAttendanceColor(
            course.attendancePercentage
          )}`}
        >
          {course.attendancePercentage}%
        </span>
      </td>
      <td className='px-6 py-4 text-center'>
        {course.eligible ? (
          <span className={getEligibilityStyle(course.eligible)}>
            <Calendar className='w-3 h-3' />
            Eligible
          </span>
        ) : (
          <span className={getEligibilityStyle(course.eligible)}>
            <AlertCircle className='w-3 h-3' />
            Not Eligible
          </span>
        )}
      </td>

      <td className='px-6 py-4 text-center'>
        <Button
          onClick={() => navigate(`/attendance/course/${course.courseId}`)}
          variant='primary'
          size='sm'
          disabled={!course.totalSessions}
        >
          <span className='hidden sm:inline'>View Details</span>
        </Button>
      </td>
    </tr>
  );

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='My Attendance'
        subtitle='Track your attendance across all enrolled courses'
      />

      {/* Search Bar */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <SearchBar
          placeholder='Search courses by code or title...'
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Empty State */}
      {!filteredCourses.length && !isPending ? (
        <EmptyCard
          icon={searchQuery ? Search : BookOpen}
          title={searchQuery ? 'No courses found' : 'No courses yet'}
          message={
            searchQuery
              ? 'Try adjusting your search query'
              : 'You are not enrolled in any courses yet'
          }
          iconBg='bg-gray-100'
          iconColor='text-gray-400'
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className='hidden md:block'>
            <DataTable
              columns={columns}
              renderRow={renderRow}
              data={paginatedCourses}
              isPending={isPending}
              showSkeletonHead={false}
            />
          </div>

          {/* Mobile Card View */}
          {isPending ? (
            <div className='md:hidden'>
              <StudentAttendanceCardSkeleton />
            </div>
          ) : (
            <div className='md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {paginatedCourses.map((course) => (
                <StudentAttendanceCard key={course.courseId} course={course} />
              ))}
            </div>
          )}

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

export default AttendanceOverviewStudent;
