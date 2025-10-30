import { useState } from 'react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import PageHeader from '../../../components/PageHeader';
import Button from '../../../components/Button';
import EmptyCard from '../../../components/EmptyCard';
import SearchBar from '../../../components/SearchBar';
import DataTable from '../../../components/DataTable';
import FacultyForm from './FacultyForm';
import { useFacultyStats } from './useFacultyStats';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { useDeleteFaculty } from './useDeleteFaculty';
import ConfirmDeletDialog from '../../../components/ConfirmDeleteDialog';

function AdminFaculty() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState({
    name: searchParams.get('name') || '',
  });
  const [debouncedQuery] = useDebounce(searchQuery, 500); // wait 500ms
  const [showModal, setShowModal] = useState(false);

  const { data: faculties, isPending } = useFacultyStats(debouncedQuery);
  const { deleteFaculty, isPending: isDeleting } = useDeleteFaculty();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // update URL when search query changes
  const handleSearch = (value) => {
    setSearchQuery({ name: value });

    if (value) setSearchParams({ name: value });
    else {
      setSearchParams({});
    }
  };
  const handleEdit = (faculty) => {
    setShowModal(true);
    setSelectedFaculty(faculty);
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
    'Faculty Name',
    'Departments',
    'Courses',
    'Lecturers',
    'Students',
    'Actions',
  ];

  const renderRow = (faculty) => {
    return (
      <tr key={faculty._id} className='hover:bg-gray-50 transition-colors'>
        <td className='px-6 py-4'>
          <span className='text-sm font-medium capitalize text-gray-900'>
            {faculty.name}
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
            <Button
              size=''
              onClick={() => handleEdit(faculty)}
              className='text-blue-500 hover:text-blue-700'
            >
              <Edit size={20} />
            </Button>
            <Button
              size=''
              onClick={() => handleDelete(faculty)}
              className='text-red-500 hover:text-red-700'
            >
              <Trash2 size={20} />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  const filteredFaculties = faculties?.facultyStats;

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Faculties'
        subtitle='Manage all faculties in your institution'
      />

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <div className='flex justify-between gap-3 items-center'>
          <SearchBar
            placeholder='Search faculties...'
            value={searchQuery.name}
            onChange={handleSearch}
          />

          <Button
            variant='primary'
            size='md'
            onClick={() => setShowModal(true)}
          >
            <Plus className='w-5 h-5' />
            <span className='hidden sm:inline font-medium'>Add Faculty</span>
          </Button>
        </div>
      </div>

      {/* Faculties Table */}
      {!filteredFaculties?.length && !isPending ? (
        <EmptyCard
          icon={Search}
          message={
            searchQuery
              ? 'Try adjusting your search query'
              : 'Get started by adding your first faculty'
          }
          title={searchQuery ? 'No faculties found' : 'No faculties yet'}
          iconBg='bg-gray-100'
          iconColor='text-gray-400'
        >
          {!searchQuery && (
            <Button
              variant='primary'
              size='md'
              icon={Plus}
              onClick={() => setShowModal(true)}
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
        />
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <FacultyForm onClose={handleCloseModal} initialData={selectedFaculty} />
      )}

      {/*confirm delete Modal */}
      {showDeleteModal && (
        <ConfirmDeletDialog
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title='Confirm Deletion'
          isDeleting={isDeleting}
          message='Deleting this faculty will also delete all departments and courses
            tied to it. This action cannot be undone.'
        />
      )}
    </div>
  );
}

export default AdminFaculty;
