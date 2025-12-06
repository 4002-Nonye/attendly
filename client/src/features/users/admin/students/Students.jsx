import { useState } from 'react';
import { Filter, Search, Users } from 'lucide-react';

import Button from '../../../../components/Button';
import DataTable from '../../../../components/DataTable';
import EmptyCard from '../../../../components/EmptyCard';
import FilterBar from '../../../../components/FilterBar';
import PageHeader from '../../../../components/PageHeader';
import Pagination from '../../../../components/Pagination';
import SearchBar from '../../../../components/SearchBar';
import StudentRow from '../../../../components/tableRows/StudentRow';
import { MAX_LEVEL } from '../../../../config/level';
import { useFilteredUsers } from '../../../../hooks/filters/useFilteredUsers';
import { useFilters } from '../../../../hooks/filters/useFilters';
import { useButtonState } from '../../../../hooks/useButtonState';
import { usePagination } from '../../../../hooks/usePagination';
import { generateLevel } from '../../../../utils/courseHelpers';
import { useAllDepartments } from '../../../department/admin/useAllDepartments';
import { useAllFaculties } from '../../../faculty/admin/useAllFaculties';

import { useStudents } from './useStudents';

function Students() {
  const { disableButton } = useButtonState();
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

  // fetch data
  const { data: facultiesData } = useAllFaculties();
  const { data: departmentData } = useAllDepartments();
  const { data: studentsData, isPending } = useStudents();

  const faculties = facultiesData?.faculties;
  const departments = departmentData?.departments;
  const levels = generateLevel(MAX_LEVEL);

  // filtered students
  const filteredStudents = useFilteredUsers(
    studentsData?.students,
    searchQuery,
    filters
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

  const columns = [
    'Student',
    'Matric No',
    'Email',
    'Faculty',
    'Department',
    'Level',
    'Courses',
  ];

const renderRow = (student) => (
  <StudentRow key={student._id} student={student} />
);

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Students'
        subtitle='View all students in your institution'
      />

      {/* Search & Filters */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <div className='flex flex-col gap-4'>
          {/* Search Bar and Actions */}
          <div className='flex flex-col sm:flex-row justify-between gap-3'>
            {/* Search */}
            <div className='flex-1'>
              <SearchBar
                placeholder='Search students by name, email or matric no...'
                value={searchQuery}
                onChange={handleSearch}
                disabled={disableButton}
              />
            </div>

            {/* Filter Button */}
            <Button
              variant='outline'
              size='md'
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
              disabled={disableButton}
              className='sm:flex-none'
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
            <div className='border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm'>
              <FilterBar
                filters={[
                  {
                    label: 'faculty',
                    name: 'faculty',
                    htmlFor: 'faculty-filter',
                    placeHolder: 'All Faculties',
                    data: faculties,
                    labelKey: 'name',
                    value: filters.faculty,
                  },
                  {
                    label: 'department',
                    name: 'department',
                    htmlFor: 'department-filter',
                    placeHolder: 'All Departments',
                    data: departments,
                    labelKey: 'name',
                    value: filters.department,
                  },
                  {
                    label: 'level',
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

      {/* Students Table or Empty States */}
      {!filteredStudents?.length && !isPending ? (
        <EmptyCard
          icon={hasActiveFilters ? Search : Users}
          title={hasActiveFilters ? 'No students found' : 'No students yet'}
          message={
            hasActiveFilters
              ? 'Try adjusting your search query or filters'
              : 'Get started by adding your first student'
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
export default Students;
