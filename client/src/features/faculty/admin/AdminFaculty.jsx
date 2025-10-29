import { useState } from 'react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import PageHeader from '../../../components/PageHeader';
import Button from '../../../components/Button';
import EmptyCard from '../../../components/EmptyCard';
import SearchBar from '../../../components/SearchBar';

// Mock data
const mockFaculties = [
  {
    id: 1,
    name: 'Faculty of Science',
    departmentCount: 10,
    studentCount: 500,
  },
  {
    id: 2,
    name: 'Faculty of Arts',
    departmentCount: 8,
    studentCount: 350,
  },
];

function AdminFaculty() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const filteredFaculties = mockFaculties.filter((faculty) =>
    faculty.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (faculty) => {
    setSelectedFaculty(faculty);
    setShowEditModal(true);
  };

  const handleDelete = (faculty) => {
    setSelectedFaculty(faculty);
    setShowDeleteModal(true);
  };

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Faculties'
        subtitle='Manage all faculties in your institution'
      />

      {/* Actions Bar */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <div className='flex justify-between gap-3 items-center'>
          <SearchBar
            placeholder='Search faculties...'
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <Button
            variant='primary'
            size='md'
            onClick={() => setShowAddModal(true)}
          >
            <Plus className='w-5 h-5' />
            <span className='hidden sm:inline font-medium'>Add Faculty</span>
          </Button>
        </div>
      </div>

      {/* Faculties Table */}
      {filteredFaculties.length > 0 ? (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                    Faculty Name
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                    Departments
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                    Students
                  </th>
                  <th className='px-6 py-4 text-right text-sm font-semibold text-gray-700'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {filteredFaculties.map((faculty) => (
                  <tr
                    key={faculty.id}
                    className='hover:bg-gray-50 transition-colors'
                  >
                    <td className='px-6 py-4'>
                      <span className='text-sm font-medium text-gray-900'>
                        {faculty.name}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-sm text-gray-700'>
                        {faculty.departmentCount}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-sm text-gray-700'>
                        {faculty.studentCount}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center justify-end'>
                        <Button
                          onClick={() => handleEdit(faculty)}
                          size='sm'
                          className='text-blue-500 hover:text-blue-700'
                        >
                          <Edit size={20} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(faculty)}
                          size='sm'
                          className='text-red-500 hover:text-red-700'
                        >
                          <Trash2 size={20} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
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
              onClick={() => setShowAddModal(true)}
            >
              Add Faculty
            </Button>
          )}
        </EmptyCard>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'
          onClick={() => setShowAddModal(false)}
        >
          <div
            className='bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200'
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-xl font-bold text-gray-900 mb-4'>
              Add New Faculty
            </h3>
            <input
              type='text'
              placeholder='Faculty name'
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            <div className='flex gap-3 justify-end'>
              <Button
                variant='secondary'
                size='md'
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button variant='primary' size='md'>
                Add Faculty
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedFaculty && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'
          onClick={() => {
            setShowEditModal(false);
            setSelectedFaculty(null);
          }}
        >
          <div
            className='bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200'
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-xl font-bold text-gray-900 mb-4'>
              Edit Faculty
            </h3>
            <input
              type='text'
              defaultValue={selectedFaculty.name}
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            <div className='flex gap-3 justify-end'>
              <Button
                variant='secondary'
                size='md'
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedFaculty(null);
                }}
              >
                Cancel
              </Button>
              <Button variant='primary' size='md'>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedFaculty && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedFaculty(null);
          }}
        >
          <div
            className='bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200'
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-xl font-bold text-gray-900 mb-2'>
              Delete Faculty
            </h3>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete{' '}
              <strong>{selectedFaculty.name}</strong>? This action cannot be
              undone.
            </p>
            <div className='flex gap-3 justify-end'>
              <Button
                variant='secondary'
                size='md'
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedFaculty(null);
                }}
              >
                Cancel
              </Button>
              <Button variant='danger' size='md'>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminFaculty;
