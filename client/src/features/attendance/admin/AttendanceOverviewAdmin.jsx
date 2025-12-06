import { useState } from 'react';
import { FileText, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/Button';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import FilterBar from '../../../components/FilterBar';
import PageHeader from '../../../components/PageHeader';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import AdminAttendanceOverviewRow from '../../../components/tableRows/AdminAttendanceOverviewRow';
import { MAX_LEVEL } from '../../../config/level';
import { useFilteredCourses } from '../../../hooks/filters/useFilteredCourses';
import { useFilters } from '../../../hooks/filters/useFilters';
import { useButtonState } from '../../../hooks/useButtonState';
import { usePagination } from '../../../hooks/usePagination';
import { generateLevel } from '../../../utils/courseHelpers';

import { useAttendanceReport } from './useAttendanceReport';

function AttendanceOverviewAdmin() {
  const navigate = useNavigate();
  const { disableButton } = useButtonState();
  const { data, isPending } = useAttendanceReport();
  const [showFilters, setShowFilters] = useState(false);

  const {
    searchQuery,
    filters,
    handleSearch,
    handleFilterChange,
    clearFilters,
    hasActiveFilters,
    activeFiltersCount,
  } = useFilters({ faculty: '', department: '', level: '' });

  const courses = data?.data || [];

  // filtering
  const filteredCourses = useFilteredCourses(courses, searchQuery, filters);
  //  unique faculties and departments for filter dropdowns
  const faculties = [
    ...new Map(courses.map((c) => [c.faculty?._id, c.faculty])).values(),
  ].filter(Boolean);

  const departments = [
    ...new Map(courses.map((c) => [c.department?._id, c.department])).values(),
  ].filter(Boolean);
  const levels = generateLevel(MAX_LEVEL);

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
    'Course',
    'Department',
    'Level',
    'Students',
    'Avg Attendance',
    'Eligible',
    'Not Eligible',
    'Action',
  ];

  // Render table row
  const renderRow = (course) => (
    <AdminAttendanceOverviewRow
      key={course._id}
      course={course}
      onViewReport={(id) => navigate(`/attendance/course/${id}`)}
    />
  );

  return (
    <div className='w-full'>
      {/* Header */}
      <PageHeader
        showGreeting={false}
        title='Attendance Reports'
        subtitle='View attendance reports and sessions across all courses'
      />

      {/* Search & Filters */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <div className='flex flex-col gap-4'>
          {/* Search Bar and Actions */}
          <div className='flex flex-col sm:flex-row justify-between gap-3'>
            <div className='flex-1'>
              <SearchBar
                placeholder='Search courses by code or title...'
                value={searchQuery}
                onChange={handleSearch}
                disabled={disableButton || isPending}
              />
            </div>

            <Button
              variant='outline'
              size='md'
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
              disabled={disableButton || isPending}
              className='flex-1 sm:flex-none'
            >
              <span className='sm:hidden'>Filters</span>
              <span className='hidden sm:inline font-medium text-base'>
                Filters
              </span>
              {activeFiltersCount > 0 && (
                <span className='font-medium text-sm'>
                  ({activeFiltersCount})
                </span>
              )}
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className='border-t border-gray-100 pt-4'>
              <FilterBar
                filters={[
                  {
                    label: 'Faculty',
                    name: 'faculty',
                    htmlFor: 'faculty-filter',
                    placeHolder: 'All Faculties',
                    data: faculties,
                    labelKey: 'name',
                    value: filters.faculty,
                  },
                  {
                    label: 'Department',
                    name: 'department',
                    htmlFor: 'department-filter',
                    placeHolder: 'All Departments',
                    data: departments,
                    labelKey: 'name',
                    value: filters.department,
                  },
                  {
                    label: 'Level',
                    name: 'level',
                    htmlFor: 'level-filter',
                    placeHolder: 'All Levels',
                    data: levels,
                    labelKey: 'level',
                    value: filters.level,
                  },
                ]}
                hasActiveFilters={hasActiveFilters}
                clearFilters={clearFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Table or Empty State */}

      {filteredCourses.length === 0 && !isPending ? (
        <EmptyCard
          icon={FileText}
          title='No courses found'
          message='Try adjusting your search or filters'
          iconBg='bg-gray-100'
          iconColor='text-gray-400'
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={paginatedCourses}
            renderRow={renderRow}
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

export default AttendanceOverviewAdmin;