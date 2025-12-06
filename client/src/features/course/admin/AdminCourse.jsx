import { useState } from 'react';
import { BookOpen, Filter, Plus, Search, Trash2 } from 'lucide-react';

import Button from '../../../components/Button';
import ConfirmDeleteDialog from '../../../components/ConfirmDeleteDialog';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import FilterBar from '../../../components/FilterBar';
import PageHeader from '../../../components/PageHeader';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import AdminCourseRow from '../../../components/tableRows/AdminCourseRow';
import { MAX_LEVEL } from '../../../config/level';
import { useFilteredCourses } from '../../../hooks/filters/useFilteredCourses';
import { useFilters } from '../../../hooks/filters/useFilters';
import { useButtonState } from '../../../hooks/useButtonState';
import { useOpenModalFromActions } from '../../../hooks/useOpenModalFromActions';
import { usePagination } from '../../../hooks/usePagination';
import { generateLevel } from '../../../utils/courseHelpers';
import { useAllCourses } from '../general/useAllCourses';

import CourseForm from './CourseForm';
import { useDeleteCourse } from './useDeleteCourse';

function AdminCourse() {
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
  } = useFilters({ department: '', level: '' });

  const { data: courses, isPending: isCoursesPending } = useAllCourses({
    enabled: !disableButton,
  });

  const filteredCourses = useFilteredCourses(
    courses?.courses,
    searchQuery,
    filters
  );

  const { deleteCourse, isPending: isDeleting } = useDeleteCourse();

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const isLoading = disableButton ? false : isCoursesPending;

  // open modal when quick actions button is clicked in dashboard
  useOpenModalFromActions('mode', 'add', setShowModal);

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleDelete = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteCourse(selectedCourse._id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        setSelectedCourse(null);
      },
    });
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCourse(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  // pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    currentData: paginatedCourses,
    setCurrentPage,
  } = usePagination(filteredCourses, 10);

  const columns = ['Course', 'Department', 'Level', 'Unit', 'Actions'];

  const renderRow = (course) => (
    <AdminCourseRow
      key={course._id}
      course={course}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );

  const allCourses = courses?.courses || [];

  // generate options for dept dropdown
  const departments = Array.from(
    new Map(
      allCourses?.map((course) => [course.department._id, course.department])
    ).values()
  );

  const levels = generateLevel(MAX_LEVEL);

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Courses'
        subtitle='Manage all courses in your institution'
      />

      {/* Search & Filters */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <div className='flex flex-col gap-4'>
          {/* Search Bar and Actions */}
          <div className='flex flex-col sm:flex-row justify-between gap-3'>
            {/* Search  */}
            <div className='flex-1'>
              <SearchBar
                placeholder='Search courses...'
                value={searchQuery}
                onChange={handleSearch}
                disabled={disableButton}
              />
            </div>

            {/* Action Buttons */}
            <div className='flex gap-2 sm:gap-3'>
              <Button
                variant='outline'
                icon={Filter}
                size='md'
                onClick={() => setShowFilters(!showFilters)}
                disabled={disableButton}
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

              <Button
                variant='primary'
                size='md'
                onClick={() => setShowModal(true)}
                disabled={disableButton}
                className='flex-1 sm:flex-none'
              >
                <Plus className='w-5 h-5' />
                <span className='sm:hidden'>Add</span>
                <span className='hidden sm:inline font-medium'>Add Course</span>
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className='border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-5 gap-4 text-sm'>
              <FilterBar
                filters={[
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

      {/* Courses Table or Empty States */}
      {!filteredCourses.length && !isLoading ? (
        <EmptyCard
          icon={hasActiveFilters ? Search : BookOpen}
          title={hasActiveFilters ? 'No courses found' : 'No courses yet'}
          message={
            hasActiveFilters
              ? 'Try adjusting your search or filter settings'
              : 'Get started by adding your first course'
          }
          iconBg='bg-gray-100'
          iconColor='text-gray-400'
        >
          {!hasActiveFilters && (
            <Button
              variant='primary'
              size='md'
              icon={Plus}
              onClick={() => setShowModal(true)}
              disabled={disableButton}
            >
              Add Course
            </Button>
          )}
        </EmptyCard>
      ) : (
        <>
          <DataTable
            columns={columns}
            renderRow={renderRow}
            data={paginatedCourses}
            isPending={isLoading}
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

      {/* Add/Edit Modal */}
      <CourseForm
        isOpen={showModal}
        onClose={handleCloseModal}
        initialData={selectedCourse}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title='Delete Course'
        message='Deleting this course will remove all associated data including enrolled students and materials. This action cannot be undone.'
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default AdminCourse;
