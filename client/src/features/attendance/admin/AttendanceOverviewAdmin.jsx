import { useState } from 'react';
import { FileText, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAttendanceReport } from './useAttendanceReport';
import PageHeader from '../../../components/PageHeader';
import SearchBar from '../../../components/SearchBar';
import FilterBar from '../../../components/FilterBar';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import Button from '../../../components/Button';
import { useFilters } from '../../../hooks/filters/useFilters';
import { useButtonState } from '../../../hooks/useButtonState';
import { useFilteredCourses } from '../../../hooks/filters/useFilteredCourses';
import {
  generateLevel,
  getAttendanceColor,
} from '../../../utils/courseHelpers';
import { MAX_LEVEL } from '../../../config/level';

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

  // Get courses from API response
  const courses = data?.data || [];

  // Use the hook for filtering
  const filteredCourses = useFilteredCourses(courses, searchQuery, filters);
  // Get unique faculties and departments for filter dropdowns
  const faculties = [
    ...new Map(courses.map((c) => [c.faculty?._id, c.faculty])).values(),
  ].filter(Boolean);

  const departments = [
    ...new Map(courses.map((c) => [c.department?._id, c.department])).values(),
  ].filter(Boolean);
  const levels = generateLevel(MAX_LEVEL);
  // Table columns
  const columns = [
    'Course',
    'Department',
    'Students',
    'Avg Attendance',
    'Eligible',
    'Not Eligible',
    'Action',
  ];

  // Render table row
  const renderRow = (course) => (
    <tr key={course._id} className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4'>
        <div>
          <p className='text-sm font-semibold text-gray-900 uppercase'>
            {course.courseCode}
          </p>
          <p className='text-xs text-gray-600 capitalize'>
            {course.courseTitle}
          </p>
        </div>
      </td>
      <td className='px-6 py-4'>
        <div>
          <p className='text-sm text-gray-700 capitalize'>
            {course.department?.name || '-'}
          </p>
          <p className='text-xs text-gray-500 capitalize'>
            Faculty of {course.faculty?.name || '-'}
          </p>
        </div>
      </td>
      <td className='px-6 py-4 text-sm font-medium text-gray-900'>
        {course.totalStudents}
      </td>
      <td className='px-6 py-4'>
        {course.totalSessions > 0 ? (
          <span
            className={`text-sm font-bold ${getAttendanceColor(
              course.avgAttendance
            )}`}
          >
            {course.avgAttendance}%
          </span>
        ) : (
          <span className='text-sm text-gray-400'>No sessions</span>
        )}
      </td>
      <td className='px-6 py-4 text-sm font-medium text-green-600'>
        {course.eligibleCount}
      </td>
      <td className='px-6 py-4 text-sm font-medium text-red-600'>
        {course.notEligibleCount}
      </td>
      <td className='px-6 py-4'>
        <button
          className='flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={() => navigate(`/attendance/course/${course._id}`)}
          disabled={course.totalStudents === 0}
          title={
            course.totalStudents === 0
              ? 'No students enrolled'
              : 'View detailed report'
          }
        >
          <FileText className='w-4 h-4' />
          View Report
        </button>
      </td>
    </tr>
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
          <div className='flex justify-between gap-3 items-center'>
            <SearchBar
              placeholder='Search courses by code or title...'
              value={searchQuery}
              onChange={handleSearch}
              disabled={disableButton || isPending}
            />

            <Button
              variant='outline'
              size='md'
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
              disabled={disableButton || isPending}
            >
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
            <div className='border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
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

      {/* Results Summary */}
      {!isPending && filteredCourses.length > 0 && (
        <div className='mb-4 text-sm text-gray-600'>
          Showing {filteredCourses.length} course
          {filteredCourses.length !== 1 ? 's' : ''}
        </div>
      )}

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
        <DataTable
          columns={columns}
          data={filteredCourses}
          renderRow={renderRow}
          isPending={isPending}
          showSkeletonHead={false}
        />
      )}
    </div>
  );
}

export default AttendanceOverviewAdmin;
