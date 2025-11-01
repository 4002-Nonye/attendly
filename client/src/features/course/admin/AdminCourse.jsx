import { useState } from 'react';
import {
  BookOpen,
  Edit,
  Plus,
  Search,
  Trash2,
  ClipboardList,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/PageHeader';
import Button from '../../../components/Button';
import EmptyCard from '../../../components/EmptyCard';
import SearchBar from '../../../components/SearchBar';
import DataTable from '../../../components/DataTable';

import ConfirmDeleteDialog from '../../../components/ConfirmDeleteDialog';
//import { useDeleteCourse } from './useDeleteCourse';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import CourseForm from './CourseForm';
import { useAllCourses } from '../general/useAllCourses';
import { useButtonState } from '../../../hooks/useButtonState';

function AdminCourse() {
  const { disableButton } = useButtonState();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [filters, setFilters] = useState({
    department: searchParams.get('department') || '',
    level: searchParams.get('level') || '',
  });
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const { data: courses, isPending: isCoursesPending } = useAllCourses({
    enabled: !disableButton,
  });

  //const { data, isPending } = useCourses({ search: debouncedQuery });
  //const { deleteCourse, isPending: isDeleting } = useDeleteCourse();

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const isSearchPending = searchQuery !== debouncedQuery;
  const isLoading = disableButton ? false : isCoursesPending || isSearchPending;

  const handleSearch = (value) => {
    setSearchQuery(value);
    const params = {};
    if (value.trim()) params.search = value;
    if (filters.department) params.department = filters.department;
    if (filters.level) params.level = filters.level;
    setSearchParams(params);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);

    const params = {};
    if (searchQuery.trim()) params.search = searchQuery;
    if (newFilters.department) params.department = newFilters.department;
    if (newFilters.level) params.level = newFilters.level;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ department: '', level: '' });
    setSearchQuery('');
    setSearchParams({});
  };

  const handleViewAttendance = (course) => {
    // TODO
    // Navigate to attendance page for this course
    navigate(`/admin/courses/${course._id}/attendance`);
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleDelete = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // deleteCourse(selectedCourse._id, {
    //   onSuccess: () => {
    //     setShowDeleteModal(false);
    //     setSelectedCourse(null);
    //   },
    // });
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCourse(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  const columns = ['Course', 'Department', 'Level', 'Unit', 'Actions'];

  const renderRow = (course) => (
    <tr key={course._id} className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4'>
        <div>
          <div className='text-sm font-semibold text-gray-900 uppercase'>
            {course.courseCode}
          </div>
          <div className='text-sm text-gray-600 capitalize'>
            {course.courseTitle}
          </div>
        </div>
      </td>
      <td className='px-6 py-4'>
        <div className='text-sm text-gray-700 capitalize'>
          {course.department?.name}
        </div>
        <div className='text-xs text-gray-500 capitalize'>
          Faculty <span className='lowercase'>of</span> {course.faculty?.name}
        </div>
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>{course.level}L</td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {course.unit} {course.unit === 1 ? 'Unit' : 'Units'}
      </td>

      <td className='px-6 py-4'>
        <div className='flex items-start gap-3'>
          <button
            type='button'
            onClick={() => handleViewAttendance(course)}
            className='text-green-500 hover:text-green-700 transition-colors'
            title='View attendance'
          >
            <ClipboardList size={20} />
          </button>
          <button
            type='button'
            onClick={() => handleEdit(course)}
            className='text-blue-500 hover:text-blue-700 transition-colors'
            title='Edit course'
          >
            <Edit size={20} />
          </button>
          <button
            type='button'
            onClick={() => handleDelete(course)}
            className='text-red-500 hover:text-red-700 transition-colors'
            title='Delete course'
          >
            <Trash2 size={20} />
          </button>
        </div>
      </td>
    </tr>
  );

  const filteredCourses = courses?.courses || [];

  // Mock departments for filter dropdown (replace with actual API data)
  const departments = [
    { _id: 'd1', name: 'Computer Science' },
    { _id: 'd2', name: 'Mathematics' },
    { _id: 'd3', name: 'English' },
    { _id: 'd4', name: 'Physics' },
    { _id: 'd5', name: 'Biology' },
    { _id: 'd6', name: 'Economics' },
    { _id: 'd7', name: 'Chemistry' },
    { _id: 'd8', name: 'Political Science' },
  ];

  const levels = [100, 200, 300, 400, 500, 600, 700];

  const hasActiveFilters = filters.department || filters.level || searchQuery;

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Courses'
        subtitle='Manage all courses in your institution'
      />

      {/* Search, Filters & CTA */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        {/* Filters Row */}

        {/* Search & Add Button Row */}
        <div className='flex justify-between gap-3 items-center'>
          <SearchBar
            placeholder='Search courses...'
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
            <span className='hidden sm:inline font-medium'>Add Course</span>
          </Button>
        </div>

        <div className='flex flex-wrap gap-3 mt-4'>
          <select
            disabled={disableButton}
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className='px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          >
            <option value=''>All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>

          <select
            disabled={disableButton}
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className='px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          >
            <option value=''>All Levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level} Level
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className='px-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline'
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Courses Table or Empty States */}
      {!filteredCourses.length && !isLoading ? (
        <EmptyCard
          icon={searchQuery ? Search : BookOpen}
          title={searchQuery ? 'No courses found' : 'No courses yet'}
          message={
            searchQuery
              ? 'Try adjusting your search query'
              : 'Get started by adding your first course'
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
              Add Course
            </Button>
          )}
        </EmptyCard>
      ) : (
        <DataTable
          columns={columns}
          renderRow={renderRow}
          data={filteredCourses}
          isPending={isLoading}
          skeleton={false}
        />
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <CourseForm
          isOpen={showModal}
          onClose={handleCloseModal}
          initialData={selectedCourse}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title='Delete Course'
        message='Deleting this course will remove all associated data including enrolled students and materials. This action cannot be undone.'
        //   isDeleting={isDeleting}
      />
    </div>
  );
}

export default AdminCourse;
