import {  BookOpen, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import StudentAttendanceCardSkeleton from '../../../components/skeletons/StudentCardSkeleton';
import StudentAttendanceCard from '../../../components/StudentAttendanceCard';
import StudentAttendanceOverviewRow from '../../../components/tableRows/StudentAttendanceOverviewRow';
import { useFilteredCourses } from '../../../hooks/filters/useFilteredCourses';
import { usePagination } from '../../../hooks/usePagination';
import { useSearchQuery } from '../../../hooks/useSearchQuery';

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
  <StudentAttendanceOverviewRow
    key={course.courseId}
    course={course}
    onViewDetails={(id) => navigate(`/attendance/course/${id}`)}
  />
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
