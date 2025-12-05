import { useState } from 'react';
import { BookOpen, Check } from 'lucide-react';
import { ClipLoader } from 'react-spinners';

import BulkActionBar from '../../../components/BulkActionBar';
import Button from '../../../components/Button';
import CourseAssignmentCard from '../../../components/CourseAssignmentCard';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import SearchBar from '../../../components/SearchBar';
import SelectionInfoBar from '../../../components/SelectionInfoBar';
import LecturerCourseCardSkeleton from '../../../components/skeletons/LecturerCourseCardSkeleton';
import { useFilteredCourses } from '../../../hooks/filters/useFilteredCourses';
import { useButtonState } from '../../../hooks/useButtonState';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import { useSelection } from '../../../hooks/useSelection';
import { getStatusStyle } from '../../../utils/courseHelpers';
import { useAllCourses } from '../general/useAllCourses';

import { useAssignCourse } from './useAssignCourse';
import { useUnassignCourse } from './useUnassignCourse';

// Constants
const ACTION_TEXTS = {
  ASSIGN: 'Assign',
  UNASSIGN: 'Unenroll',
  ENROLL_SELECTED: 'Enroll Selected',
};

 const COLUMNS = ['', 'Course', 'Level', 'Unit', 'Status', 'Actions'];

function LecturerAllCourses() {
  const { disableButton } = useButtonState();
  const { data: courseData, isPending } = useAllCourses({
    enabled: !disableButton,
  });
  const [searchQuery, setSearchQuery] = useSearchQuery();

  const { assignToCourse } = useAssignCourse();
  const { unassignFromCourse } = useUnassignCourse();

  //track which course is currently pending in action
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [isBulkAssigning, setIsBulkAssigning] = useState(false);

  const isLoading = disableButton ? false : isPending;

  // filter courses based on search
  const filteredCourses = useFilteredCourses(courseData?.courses, searchQuery);

  // toggle course selection
  const { selected, toggle, isSelected, clear } = useSelection();

  // handle single assign
  const handleAssignSingle = (courseId) => {
    setActiveCourseId(courseId); // tract which course is assigning
    if (isSelected(courseId)) toggle(courseId);

    assignToCourse(
      {
        courseIds: [courseId],
      },
      {
        onSettled: () => setActiveCourseId(null),
      }
    );
  };

  // handle unassign
  const handleUnassign = (courseId) => {
    setActiveCourseId(courseId);

    unassignFromCourse(courseId, {
      onSuccess: () => {
        if (isSelected(courseId)) toggle(courseId);
      },
      onSettled: () => setActiveCourseId(null),
    });
  };

  // handle bulk assign
  const handleBulkAssign = (courseIds = selected) => {
    setIsBulkAssigning(true);
    assignToCourse(
      {
        courseIds,
      },
      {
        onSettled: () => {
          setIsBulkAssigning(false);
          clear();
        },
      }
    );
  };

  const renderRow = (course) => {
    const isCourseActionPending = activeCourseId === course._id;
    const statusText = course.status ? 'active' : 'inactive';
    const statusStyle = getStatusStyle(statusText);

    return (
      <tr key={course._id} className={`hover:bg-gray-50 transition-colors `}>
        <td className='px-4 py-4'>
          <input
            type='checkbox'
            checked={isSelected(course._id) || course.status}
            disabled={course.status}
            onChange={() => toggle(course._id)}
            className={`w-4 h-4  rounded border-gray-300 focus:ring-0 `}
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
            <span className={`${statusStyle}`}>Assigned</span>
          ) : (
            <span className={`${statusStyle}`}>Unassigned</span>
          )}
        </td>

        <td className='px-6 py-4'>
          <Button
            onClick={() =>
              course.status
                ? handleUnassign(course._id)
                : handleAssignSingle(course._id)
            }
            variant={course.status ? 'danger' : 'primary'}
            className='gap-1 w-30'
            size='sm'
            disabled={isCourseActionPending || isBulkAssigning}
          >
            {isCourseActionPending ? (
              <ClipLoader size={16} color='white' />
            ) : course.status ? (
              'Unassign'
            ) : (
              'Assign'
            )}
          </Button>
        </td>
      </tr>
    );
  };

 

  return (
    <div className='w-full'>
      {/* Search Bar */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <SearchBar
          placeholder='Search courses...'
          value={searchQuery}
          onChange={setSearchQuery}
          disabled={disableButton}
        />
      </div>

      {/* Selection Info */}
      {selected.length > 0 && (
        <SelectionInfoBar count={selected.length} onClear={clear} />
      )}

      {/* Table */}
      {!filteredCourses.length && !isLoading ? (
        <EmptyCard
          icon={BookOpen}
          title={searchQuery ? 'No courses found' : 'No courses available'}
          message={
            searchQuery
              ? 'Try adjusting your search query'
              : 'No courses available for your department yet'
          }
          iconColor='text-gray-400'
          iconBg='bg-gray-100'
        />
      ) : (
        <>
          {/* Desktop */}
          <div className='hidden lg:block'>
            <DataTable
              columns={COLUMNS}
              renderRow={renderRow}
              data={filteredCourses}
              isPending={isLoading}
              showSkeletonHead={false}
            />
          </div>

          {/* Mobile */}
          <div className=' lg:hidden '>
            {isLoading ? (
              <LecturerCourseCardSkeleton showSkeletonHead={false} />
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 w-full'>
                {filteredCourses.map((course) => (
                  <CourseAssignmentCard
                    key={course._id}
                    course={course}
                    onPrimaryAction={handleAssignSingle}
                    onSecondaryAction={handleUnassign}
                    isLoading={activeCourseId === course._id}
                    showCheckbox
                    isSelected={isSelected(course._id) || course.status}
                    onToggleSelect={toggle}
                    primaryActionText={ACTION_TEXTS.ASSIGN}
                    secondaryActionText={ACTION_TEXTS.UNASSIGN}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Bulk Actions Footer */}
      {selected.length > 0 && (
        <BulkActionBar
          count={selected.length}
          actionLabel='Assign Selected'
          icon={Check}
          isPending={isBulkAssigning}
          onAction={() => handleBulkAssign()}
        />
      )}
    </div>
  );
}

export default LecturerAllCourses;
