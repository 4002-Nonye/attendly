import { useState } from 'react';
import { Edit, Filter, Layers, Plus, Search, Trash2 } from 'lucide-react';

import Button from '../../../components/Button';
import ConfirmDeleteDialog from '../../../components/ConfirmDeleteDialog';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import FilterBar from '../../../components/FilterBar';
import PageHeader from '../../../components/PageHeader';
import SearchBar from '../../../components/SearchBar';
import { useFilteredDepartments } from '../../../hooks/filters/useFilteredDepartments';
import { useFilters } from '../../../hooks/filters/useFilters';
import { useButtonState } from '../../../hooks/useButtonState';
import { useOpenModalFromActions } from '../../../hooks/useOpenModalFromActions';
import { useAllFaculties } from '../../faculty/admin/useAllFaculties';

import DepartmentForm from './DepartmentForm';
import { useDeleteDepartment } from './useDeleteDepartment';
import { useDepartmentStats } from './useDepartmentStats';

function AdminDepartment() {
  const { disableButton } = useButtonState();
  const [showFilters, setShowFilters] = useState(false);

  const { data, isPending } = useDepartmentStats({ enabled: !disableButton });

  const { deleteDepartment, isPending: isDeleting } = useDeleteDepartment();

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const { data: facultiesData } = useAllFaculties();

  const isLoading = !disableButton && isPending;

  const {
    searchQuery,
    filters,
    handleSearch,
    handleFilterChange,
    clearFilters,
    hasActiveFilters,
    activeFiltersCount,
  } = useFilters({ faculty: '' });

  const filteredDepartments = useFilteredDepartments(
    data?.departmentStats,
    searchQuery,
    filters
  );
  

  // open modal when quick actions button is clicked in dashboard
  useOpenModalFromActions('mode', 'add', setShowModal);

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setShowModal(true);
  };

  const handleDelete = (department) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteDepartment(selectedDepartment._id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        setSelectedDepartment(null);
      },
    });
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedDepartment(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDepartment(null);
  };

  const columns = [
    'Deparment',
    'Duration',
    'Courses',
    'Lecturers',
    'Students',
    'Actions',
  ];

  const renderRow = (department) => (
    <tr key={department._id} className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4'>
        <div className='text-sm text-gray-700 capitalize'>
          {department.name}
        </div>
        <div className='text-xs text-gray-500 capitalize'>
          Faculty <span className='lowercase'>of</span>{' '}
          {department.faculty.name}
        </div>
      </td>

      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {String(department.maxLevel)[0]}-year
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {department.totalCourses}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {department.totalLecturers}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {department.totalStudents}
      </td>
      <td className='px-6 py-4'>
        <div className='flex items-start gap-3'>
          <button
            type='button'
            onClick={() => handleEdit(department)}
            className='text-blue-500 hover:text-blue-700 transition-colors'
            title='Edit faculty'
          >
            <Edit size={20} />
          </button>
          <button
            type='button'
            onClick={() => handleDelete(department)}
            className='text-red-500 hover:text-red-700 transition-colors'
            title='Delete faculty'
          >
            <Trash2 size={20} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Departments'
        subtitle='Manage all departments in your institution'
      />

      {/* Search & Filters */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <div className='flex flex-col gap-4'>
          <div className='flex justify-between gap-3 items-center'>
            <SearchBar
              placeholder='Search departments...'
              value={searchQuery}
              onChange={handleSearch}
              disabled={disableButton}
            />

            <div className='flex gap-3'>
              <Button
                variant='outline'
                icon={Filter}
                size='md'
                onClick={() => setShowFilters(!showFilters)}
                disabled={disableButton}
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

              <Button
                variant='primary'
                size='md'
                onClick={() => setShowModal(true)}
                disabled={disableButton}
              >
                <Plus className='w-5 h-5' />
                <span className='hidden sm:inline font-medium'>
                  Add Department
                </span>
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className='border-t border-gray-100 pt-4 grid grid-cols-5 gap-2 text-sm'>
              <FilterBar
                filters={[
                  {
                    label: 'faculty',
                    name: 'faculty',
                    htmlFor: 'faculty-filter',
                    placeHolder: 'All Faculties',
                    data: facultiesData?.faculties,
                    labelKey: 'name',
                    value: filters.faculty,
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

      {/* Faculties Table or Empty States */}
      {!filteredDepartments.length && !isLoading ? (
        <EmptyCard
          icon={hasActiveFilters ? Search : Layers}
          title={hasActiveFilters ? 'No departments found' : 'No departments yet'}
          message={
            hasActiveFilters
              ? 'Try adjusting your search query'
              : 'Get started by adding your first department'
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
              Add department
            </Button>
          )}
        </EmptyCard>
      ) : (
        <DataTable
          columns={columns}
          renderRow={renderRow}
          data={filteredDepartments}
          isPending={isLoading}
          showSkeletonHead={false}
        />
      )}

      {/* Add/Edit Modal */}
      <DepartmentForm
        isOpen={showModal}
        onClose={handleCloseModal}
        initialData={selectedDepartment}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title='Delete Department'
        message='Deleting this department will also delete all courses tied to it. This action cannot be undone.'
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default AdminDepartment;
