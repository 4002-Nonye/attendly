import { useState } from 'react';
import {  Filter, Layers, Plus, Search } from 'lucide-react';

import Button from '../../../components/Button';
import ConfirmDeleteDialog from '../../../components/ConfirmDeleteDialog';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import FilterBar from '../../../components/FilterBar';
import PageHeader from '../../../components/PageHeader';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import DepartmentRow from '../../../components/tableRows/DepartmentRow';
import { useFilteredDepartments } from '../../../hooks/filters/useFilteredDepartments';
import { useFilters } from '../../../hooks/filters/useFilters';
import { useButtonState } from '../../../hooks/useButtonState';
import { useOpenModalFromActions } from '../../../hooks/useOpenModalFromActions';
import { usePagination } from '../../../hooks/usePagination';
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
  
  // pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    currentData: paginatedDepartments,
    setCurrentPage,
  } = usePagination(filteredDepartments, 10);

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
    <DepartmentRow
      key={department._id}
      department={department}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
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
          <div className='flex flex-col sm:flex-row justify-between gap-3'>
            {/* Search */}
            <div className='flex-1'>
              <SearchBar
                placeholder='Search departments...'
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
                <span className='hidden sm:inline font-medium'>
                  Add Department
                </span>
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className='border-t border-gray-100 pt-4 grid md:grid-cols-3 lg:grid-cols-5 gap-2 text-sm'>
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
          title={
            hasActiveFilters ? 'No departments found' : 'No departments yet'
          }
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
        <>
          <DataTable
            columns={columns}
            renderRow={renderRow}
            data={paginatedDepartments}
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