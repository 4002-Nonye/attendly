import { useState } from 'react';
import { BookOpen, Check } from 'lucide-react';
import Button from '../../../components/Button';
import EmptyCard from '../../../components/EmptyCard';
import DataTable from '../../../components/DataTable';
import SearchBar from '../../../components/SearchBar';
import { useButtonState } from '../../../hooks/useButtonState';
import { useAllCourses } from '../general/useAllCourses';
import BulkActionBar from '../../../components/BulkActionBar';
import SelectionInfoBar from '../../../components/SelectionInfoBar';
import { useAssignCourse } from './useAssignCourse';
import { useUnassignCourse } from './useUnassignCourse';
import { ClipLoader } from 'react-spinners';
import CourseAssignmentCard from '../../../components/CourseAssignmentCard';
import LecturerCourseCardSkeleton from '../../../components/LecturerCourseCardSkeleton';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import { useFilteredCourses } from '../../../hooks/useFilteredCourses';
import { useSelection } from '../../../hooks/useSelection';
import { getStatusStyle } from '../../../utils/courseHelpers';

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
    setActiveCourseId(courseId); // track which course is unassigning

    if (isSelected(courseId)) toggle(courseId); // remove from selection if selected

    unassignFromCourse(courseId, {
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

  const columns = ['', 'Course', 'Level', 'Unit', 'Status', 'Actions'];

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
              columns={columns}
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
                    primaryActionText='Assign'
                    secondaryActionText='Unassign'
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
