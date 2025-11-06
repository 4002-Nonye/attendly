import { useState } from 'react';
import { Building2, Edit, Plus, Search, Trash2 } from 'lucide-react';
import PageHeader from '../../../components/PageHeader';
import Button from '../../../components/Button';
import EmptyCard from '../../../components/EmptyCard';
import SearchBar from '../../../components/SearchBar';
import DataTable from '../../../components/DataTable';
import FacultyForm from './FacultyForm';
import { useFacultyStats } from './useFacultyStats';

import { useDeleteFaculty } from './useDeleteFaculty';
import ConfirmDeleteDialog from '../../../components/ConfirmDeleteDialog';
import { useButtonState } from '../../../hooks/useButtonState';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import { useOpenModalFromActions } from '../../../hooks/useOpenModalFromActions';



function AdminFaculty() {
  const { disableButton } = useButtonState();
  const { data: faculties, isPending } = useFacultyStats(
    { enabled: !disableButton } // options
  );
  const { deleteFaculty, isPending: isDeleting } = useDeleteFaculty();
  const [searchQuery, setSearchQuery] = useSearchQuery('name');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const isLoading = disableButton ? false : isPending;

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
    <tr key={faculty._id} className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4'>
        <span className='text-sm font-medium capitalize text-gray-900'>
          Faculty <span className='lowercase'>of</span> {faculty.name}
        </span>
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {faculty.totalDepartments}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {faculty.totalCourses}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {faculty.totalLecturers}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {faculty.totalStudents}
      </td>
      <td className='px-6 py-4'>
        <div className='flex items-start gap-3'>
          <button
            type='button'
            onClick={() => handleEdit(faculty)}
            className='text-blue-500 hover:text-blue-700 transition-colors'
            title='Edit faculty'
          >
            <Edit size={20} />
          </button>
          <button
            type='button'
            onClick={() => handleDelete(faculty)}
            className='text-red-500 hover:text-red-700 transition-colors'
            title='Delete faculty'
          >
            <Trash2 size={20} />
          </button>
        </div>
      </td>
    </tr>
  );

  const filteredFaculties =
    faculties?.facultyStats?.filter((faculty) => {
      const fullName = `faculty of ${faculty.name}`.toLowerCase(); // 'append faculty of'
      const query = searchQuery.toLowerCase();
      return (
        faculty.name.toLowerCase().includes(query) ||
        fullName.includes(searchQuery)
      );
    }) || [];


  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Faculties'
        subtitle='Manage all faculties in your institution'
      />

      {/* Search & CTA */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <div className='flex justify-between gap-3 items-center'>
          <SearchBar
            placeholder='Search faculties...'
            value={searchQuery}
            onChange={setSearchQuery}
            disabled={disableButton}
          />
          <Button
            variant='primary'
            size='md'
            onClick={() => setShowModal(true)}
            disabled={disableButton}
          >
            <Plus className='w-5 h-5' />
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
        <DataTable
          columns={columns}
          renderRow={renderRow}
          data={filteredFaculties}
          isPending={isLoading}
          showSkeletonHead={false}
        />
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
