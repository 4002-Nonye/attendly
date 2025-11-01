import { Edit, Layers, Plus, Search, Trash2 } from 'lucide-react';
import Button from '../../../components/Button';
import PageHeader from '../../../components/PageHeader';
import DepartmentForm from './DepartmentForm';
import SearchBar from '../../../components/SearchBar';
import ConfirmDeleteDialog from '../../../components/ConfirmDeleteDialog';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useSearchParams } from 'react-router-dom';
import EmptyCard from '../../../components/EmptyCard';
import DataTable from '../../../components/DataTable';
import { useDepartmentStats } from './useDepartmentStats';
import { useDeleteDepartment } from './useDeleteDepartment';
import { useButtonState } from '../../../hooks/useButtonState';

function AdminDepartment() {
  const { disableButton } = useButtonState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('name') || ''
  );
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  const { data, isPending } = useDepartmentStats(
    { name: debouncedQuery },
    { enabled: !disableButton }
  );

  const { deleteDepartment, isPending: isDeleting } = useDeleteDepartment();

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Check if search is still pending (debouncing)
  const isSearchPending = searchQuery !== debouncedQuery;
  const isLoading = disableButton ? false : isPending || isSearchPending;

  const filteredDepartments = data?.departmentStats || [];

  // Update URL when search query changes
  const handleSearch = (value) => {
    setSearchQuery(value);
    if (value) setSearchParams({ name: value });
    else setSearchParams({});
  };

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

      {/* Search & CTA */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <div className='flex justify-between gap-3 items-center'>
          <SearchBar
            placeholder='Search departments...'
            value={searchQuery}
            onChange={handleSearch}
            disabled={disableButton}
          />
          <Button
            variant='primary'
            size='md'
            onClick={() => setShowModal(true)}
            disabled={disableButton}
          >
            <Plus className='w-5 h-5' />
            <span className='hidden sm:inline font-medium'>Add Department</span>
          </Button>
        </div>
      </div>

      {/* Faculties Table or Empty States */}
      {!filteredDepartments.length && !isLoading ? (
        <EmptyCard
          icon={searchQuery ? Search : Layers}
          title={searchQuery ? 'No departments found' : 'No departments yet'}
          message={
            searchQuery
              ? 'Try adjusting your search query'
              : 'Get started by adding your first department'
          }
          iconBg='bg-gray-100'
          iconColor='text-gray-400'
        >
          {!searchQuery && (
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
          skeleton={false}
        />
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <DepartmentForm
          isOpen={showModal}
          onClose={handleCloseModal}
          initialData={selectedDepartment}
        />
      )}

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
