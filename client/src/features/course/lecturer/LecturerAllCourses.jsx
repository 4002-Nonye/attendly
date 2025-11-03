import { useState } from 'react';
import { BookOpen, Check, X } from 'lucide-react';
import Button from '../../../components/Button';
import EmptyCard from '../../../components/EmptyCard';
import DataTable from '../../../components/DataTable';

import SearchBar from '../../../components/SearchBar';
import { useButtonState } from '../../../hooks/useButtonState';
import { useSearchParams } from 'react-router-dom';
import { useAllCourses } from '../general/useAllCourses';

function LecturerAllCourses() {
  const { data: coursesData, isPending } = useAllCourses();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const { disableButton } = useButtonState();

  // course structure
  const courses =
    coursesData?.courses?.map((course) => ({
      _id: course._id,
      courseCode: course.courseCode,
      courseTitle: course.courseTitle,
      level: course.level,
      unit: course.unit,

    })) || [];

  // Filter courses based on search
  const filteredCourses = courses.filter(
    (course) =>
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (value) => {
    setSearchQuery(value);

    const params = new URLSearchParams(searchParams);
    if (value.trim()) {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    setSearchParams(params);
  };

  // Toggle individual course selection
  const handleToggleSelect = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Handle individual register
  const handleRegisterOne = (courseId) => {
    console.log('Register course:', courseId);

  };

  // Handle individual unregister
  const handleUnregisterOne = (courseId) => {
    console.log('Unregister course:', courseId);

  };

  // Handle bulk register
  const handleBulkRegister = () => {
    console.log('Bulk register courses:', selectedCourses);

  };



const renderRow = (course) => (
  <tr
    key={course._id}
    className={`hover:bg-gray-50 transition-colors ${
      selectedCourses.includes(course._id) ? 'bg-blue-50' : ''
    }`}
  >
    <td className='px-4 py-4'>
      <input
        type='checkbox'
        checked={selectedCourses.includes(course._id)}
        onChange={() => handleToggleSelect(course._id)}
        className='w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 text-blue-600 cursor-pointer hover:border-blue-400'
      />
    </td>

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

    <td className='px-6 py-4 text-sm text-gray-700'>{course.level}L</td>
    <td className='px-6 py-4 text-sm text-gray-700'>{course.unit}</td>

    {/* <td className='px-6 py-4'>
      <Button
        variant='primary'
        size='sm'
        onClick={() => handleRegisterOne(course._id)}
        className='w-30 gap-2'
      >
        <Check size={18} /> Assign
      </Button>
    </td> */}
  </tr>
);

  const columns = ['', 'Course', 'Level', 'Unit'];

  return (
    <div className='w-full '>
      {/* Search Bar */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <SearchBar
          placeholder='Search courses...'
          value={searchQuery}
          onChange={handleSearch}
          disabled={disableButton}
        />
      </div>

      {/* Selection Info */}
      {selectedCourses.length > 0 && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between'>
          <span className='text-sm text-blue-800 font-medium'>
            {selectedCourses.length} course
            {selectedCourses.length > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => setSelectedCourses([])}
            className='text-sm text-blue-600 hover:text-blue-800 underline'
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      {!filteredCourses.length ? (
        <EmptyCard
          icon={BookOpen}
          title='No courses found'
          message='Try adjusting your search query'
          iconColor='text-gray-400'
          iconBg='bg-gray-100'
        />
      ) : (
        <DataTable
          columns={columns}
          renderRow={renderRow}
          data={filteredCourses}
          skeleton={false}
        />
      )}

      {/* Bulk Actions Footer */}
      {selectedCourses.length > 0 && (
        <div className='rounded-xl shadow-sm border border-gray-100 p-4 mt-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
            {/* Selection info */}
            <div className='text-sm text-gray-600 text-center sm:text-left'>
              <span className='font-medium text-gray-900'>
                {selectedCourses.length}
              </span>{' '}
              course{selectedCourses.length > 1 ? 's' : ''} selected
            </div>

            {/* Button */}
            <Button
              variant='primary'
              size='md'
              onClick={handleBulkRegister}
              className=' '
            >
              <Check size={18} />
              Assign Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LecturerAllCourses;
