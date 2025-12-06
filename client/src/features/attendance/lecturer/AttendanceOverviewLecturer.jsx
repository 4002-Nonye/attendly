import { Calendar, Search } from 'lucide-react';
import {  useNavigate } from 'react-router-dom';

import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import LecturerAttendanceOverviewRow from '../../../components/tableRows/LecturerAttendanceOverviewRow';
import { useFilteredCourses } from '../../../hooks/filters/useFilteredCourses';
import { useButtonState } from '../../../hooks/useButtonState';
import { usePagination } from '../../../hooks/usePagination';
import { useSearchQuery } from '../../../hooks/useSearchQuery';

import { useAttendanceOverview } from './useAttendanceOverview';

function AttendanceOverviewLecturer() {
  const { disableButton } = useButtonState();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useSearchQuery();

  const { data, isPending } = useAttendanceOverview();

  // filter courses
  const filteredCourses = useFilteredCourses(data?.overview, searchQuery);

  // pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    currentData: paginatedCourses,
    setCurrentPage,
  } = usePagination(filteredCourses, 10);

  const columns = ['ID', 'Course', 'Total Sessions', 'Actions'];

  const renderRow = (course) => (
    <LecturerAttendanceOverviewRow
      key={course._id}
      course={course}
      onNavigate={navigate}
    />
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
        <>
          <DataTable
            columns={columns}
            renderRow={renderRow}
            data={paginatedCourses}
            isPending={isPending}
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

export default AttendanceOverviewLecturer;
