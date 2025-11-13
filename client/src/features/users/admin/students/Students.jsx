import { useState } from 'react';
import { Users, Filter, Search } from 'lucide-react';
import { useButtonState } from '../../../../hooks/useButtonState';
import PageHeader from '../../../../components/PageHeader';
import SearchBar from '../../../../components/SearchBar';
import Button from '../../../../components/Button';
import DataTable from '../../../../components/DataTable';
import EmptyCard from '../../../../components/EmptyCard';
import FilterBar from '../../../../components/FilterBar';
import { useFilters } from '../../../../hooks/useFilters';
import { useStudents } from './useStudents';
import { useAllFaculties } from '../../../faculty/admin/useAllFaculties';
import { useAllDepartments } from '../../../department/admin/useAllDepartments';
import { generateLevel } from '../../../../utils/courseHelpers';
import { MAX_LEVEL } from '../../../../config/level';
import { useFilteredUsers } from '../../../../hooks/useFilteredUsers';

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
    <tr key={student._id} className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4'>
        <span className='text-sm font-medium capitalize text-gray-900'>
          {student.fullName}
        </span>
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 uppercase'>
        {student.matricNo}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>{student.email}</td>
      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {student.faculty?.name}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {student.department?.name}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>{student.level}L</td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {student.coursesTotal}
      </td>
    </tr>
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
          <div className='flex justify-between gap-3 items-center'>
            <SearchBar
              placeholder='Search students by name, email or matric no...'
              value={searchQuery}
              onChange={handleSearch}
              disabled={disableButton}
            />

            <Button
              variant='outline'
              size='md'
              className='gap-2'
              onClick={() => setShowFilters(!showFilters)}
              disabled={disableButton}
            >
              <Filter className='w-4 h-4' />
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
            <div className='border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:w-3/4'>
              <FilterBar
                filters={[
                  {
                    name: 'faculty',
                    htmlFor: 'faculty-filter',
                    placeHolder: 'All Faculties',
                    data: faculties,
                    labelKey: 'name',
                    value: filters.faculty,
                  },
                  {
                    name: 'department',
                    htmlFor: 'department-filter',
                    placeHolder: 'All Departments',
                    data: departments,
                    labelKey: 'name',
                    value: filters.department,
                  },
                  {
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
        <DataTable
          columns={columns}
          renderRow={renderRow}
          data={filteredStudents}
          isPending={isPending}
          showSkeletonHead={false}
        />
      )}
    </div>
  );
}

export default Students;
