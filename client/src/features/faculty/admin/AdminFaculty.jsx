import { useState } from 'react';
import { Building2, Edit, Plus, Search, Trash2 } from 'lucide-react';

import Button from '../../../components/Button';
import ConfirmDeleteDialog from '../../../components/ConfirmDeleteDialog';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import FacultyRow from '../../../components/tableRows/FacultyRow';
import { useFilteredFaculties } from '../../../hooks/filters/useFilteredFaculties';
import { useButtonState } from '../../../hooks/useButtonState';
import { useOpenModalFromActions } from '../../../hooks/useOpenModalFromActions';
import { usePagination } from '../../../hooks/usePagination';
import { useSearchQuery } from '../../../hooks/useSearchQuery';

import FacultyForm from './FacultyForm';
import { useDeleteFaculty } from './useDeleteFaculty';
import { useFacultyStats } from './useFacultyStats';

function AdminFaculty() {
  const { disableButton } = useButtonState();
  const { data: faculties, isPending } = useFacultyStats(
    { enabled: !disableButton }
  );
  const { deleteFaculty, isPending: isDeleting } = useDeleteFaculty();
  const [searchQuery, setSearchQuery] = useSearchQuery('name');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const isLoading = !disableButton && isPending;

  // open modal when quick actions button is clicked in dashboard
  useOpenModalFromActions('mode', 'add', setShowModal);

  const handleEdit = (faculty) => {
    setSelectedFaculty(faculty);
    setShowModal(true);
  };

  const handleDelete = (faculty) => {
    setSelectedFaculty(faculty);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteFaculty(selectedFaculty._id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        setSelectedFaculty(null);
      },
    });
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedFaculty(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFaculty(null);
  };

  const columns = [
    'Faculty',
    'Departments',
    'Courses',
    'Lecturers',
    'Students',
    'Actions',
  ];

  const renderRow = (faculty) => (
  <FacultyRow
    key={faculty._id}
    faculty={faculty}
    onEdit={handleEdit}
    onDelete={handleDelete}
  />
);


  const filteredFaculties = useFilteredFaculties(
    faculties?.facultyStats,
    searchQuery
  );
  
  // pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    currentData: paginatedFaculties,
    setCurrentPage,
  } = usePagination(filteredFaculties, 10);

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Faculties'
        subtitle='Manage all faculties in your institution'
      />

      {/* Search & CTA */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <div className='flex flex-col sm:flex-row justify-between gap-3'>
          {/* Search */}
          <div className='flex-1'>
            <SearchBar
              placeholder='Search faculties...'
              value={searchQuery}
              onChange={setSearchQuery}
              disabled={disableButton}
            />
          </div>

          {/* Add Button */}
          <Button
            variant='primary'
            size='md'
            onClick={() => setShowModal(true)}
            disabled={disableButton}
            className='sm:flex-none'
          >
            <Plus className='w-5 h-5' />
            <span className='sm:hidden'>Add</span>
            <span className='hidden sm:inline font-medium'>Add Faculty</span>
          </Button>
        </div>
      </div>

      {/* Faculties Table or Empty States */}
      {!filteredFaculties.length && !isLoading ? (
        <EmptyCard
          icon={searchQuery ? Search : Building2}
          title={searchQuery ? 'No faculties found' : 'No faculties yet'}
          message={
            searchQuery
              ? 'Try adjusting your search query'
              : 'Get started by adding your first faculty'
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
              Add Faculty
            </Button>
          )}
        </EmptyCard>
      ) : (
        <>
          <DataTable
            columns={columns}
            renderRow={renderRow}
            data={paginatedFaculties}
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
      <FacultyForm
        isOpen={showModal}
        onClose={handleCloseModal}
        initialData={selectedFaculty}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title='Delete Faculty'
        message='Deleting this faculty will also delete all departments and courses tied to it. This action cannot be undone.'
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default AdminFaculty;