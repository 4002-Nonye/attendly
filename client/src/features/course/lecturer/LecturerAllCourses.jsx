import { useState } from 'react';
import { BookOpen, Check, X } from 'lucide-react';
import Button from '../../../components/Button';
import EmptyCard from '../../../components/EmptyCard';
import DataTable from '../../../components/DataTable';
import SearchBar from '../../../components/SearchBar';
import { useButtonState } from '../../../hooks/useButtonState';
import { useSearchParams } from 'react-router-dom';
import { useAllCourses } from '../general/useAllCourses';
import BulkActionBar from '../../../components/BulkActionBar';
import SelectionInfoBar from '../../../components/SelectionInfoBar';
import { useAssignCourse } from './useAssignCourse';

function LecturerAllCourses() {
  const { data: coursesData, isPending } = useAllCourses();
  const { assignToCourse, isPending: isAssigning } = useAssignCourse();
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
      status: course.status, // true = assigned , fasle = unassigned
    })) || [];

  // filter courses based on search
  const filteredCourses = courses.filter(
    (course) =>
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //  count 'unassigned' courses in selected list
  const unassignedSelectedCourses = filteredCourses.filter(
    (course) => selectedCourses.includes(course._id) && !course.status
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams);
    if (value.trim()) params.set('search', value);
    else params.delete('search');
    setSearchParams(params);
  };

  // toggle individual course selection
  const handleToggleSelect = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  // handle single assign
  const handleAssignSingle = (courseId) => {
    assignToCourse({
      courseIds: [courseId],
    });
  };

  // handle unassign
  const handleUnassign = (courseId) => {
    console.log('Unassign course:', courseId);
  };

  // handle bulk assign
  const handleBulkAssign = (courseIds = selectedCourses) => {
    const unassignedIds = filteredCourses
      .filter((c) => courseIds.includes(c._id) && !c.status)
      .map((c) => c._id);

    console.log('Bulk assign courses:', unassignedIds);
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
          checked={course.status || selectedCourses.includes(course._id)}
          disabled={course.status}
          onChange={() => handleToggleSelect(course._id)}
          className={`w-4 h-4 rounded border-gray-300 focus:ring-0 transition-colors ${
            course.status
              ? 'text-green-600 cursor-not-allowed opacity-60'
              : 'text-blue-600 cursor-pointer hover:border-blue-400'
          }`}
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

      <td className='px-6 py-4'>
        {course.status ? (
          <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full'>
            <Check size={14} />
            Assigned
          </span>
        ) : (
          <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full'>
            Unassigned
          </span>
        )}
      </td>

      <td className='px-6 py-4'>
        {course.status ? (
          <Button
            onClick={() => handleUnassign(course._id)}
            variant='secondaryDanger'
            className='gap-1 w-30'
            size='sm'
          >
            <X size={16} />
            Unassign
          </Button>
        ) : (
          <Button
            onClick={() => handleAssignSingle(course._id)}
            variant='primary'
            className='gap-1 w-30'
            size='sm'
          >
            {isAssigning ? (
              <ClipLoader size={16} color='white' />
            ) : (
              <>
                <Check size={16} /> Assign
              </>
            )}
          </Button>
        )}
      </td>
    </tr>
  );

  const columns = ['', 'Course', 'Level', 'Unit', 'Status', 'Actions'];

  return (
    <div className='w-full'>
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
      {unassignedSelectedCourses.length > 0 && (
        <SelectionInfoBar
          count={unassignedSelectedCourses.length}
          onClear={() => setSelectedCourses([])}
        />
      )}

      {/* Table */}
      {!filteredCourses.length && !isPending ? (
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
          isPending={isPending}
          showSkeletonHead={false}
        />
      )}

      {/* Bulk Actions Footer */}
      {unassignedSelectedCourses.length > 0 && (
        <BulkActionBar
          count={unassignedSelectedCourses.length}
          actionLabel='Assign Selected'
          icon={Check}
          onAction={() =>
            handleBulkAssign(unassignedSelectedCourses.map((c) => c._id))
          }
        />
      )}
    </div>
  );
}

export default LecturerAllCourses;
