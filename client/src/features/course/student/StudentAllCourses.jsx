import { useButtonState } from '../../../hooks/useButtonState';
import { useAllCourses } from '../general/useAllCourses';
import { useEnrollCourse } from './useEnrollCourse';
import { useUnenrollCourse } from './useUnenrollCourse';
import { useState } from 'react';
import SearchBar from '../../../components/SearchBar';
import CourseAssignmentCard from '../../../components/CourseAssignmentCard';
import LecturerCourseCardSkeleton from '../../../components/LecturerCourseCardSkeleton';
import { BookOpen, Check } from 'lucide-react';
import EmptyCard from '../../../components/EmptyCard';
import BulkActionBar from '../../../components/BulkActionBar';
import SelectionInfoBar from '../../../components/SelectionInfoBar';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import { useFilteredCourses } from '../../../hooks/filters/useFilteredCourses';
import { useSelection } from '../../../hooks/useSelection';
import DataTable from '../../../components/DataTable';
import Button from '../../../components/Button';
import { ClipLoader } from 'react-spinners';
import { getStatusStyle } from '../../../utils/courseHelpers';

// Constants
const ACTION_TEXTS = {
  ENROLL: 'Enroll',
  UNENROLL: 'Unenroll',
  ENROLL_SELECTED: 'Enroll Selected',
};

const COLUMNS = ['', 'Course', 'Level', 'Unit', 'Status', 'Actions'];

function StudentAllCourses() {
  const { disableButton } = useButtonState();
  const { data: courseData, isPending } = useAllCourses({
    enabled: !disableButton,
  });

  const { enrollCourse } = useEnrollCourse();
  const { unenrollCourse } = useUnenrollCourse();
  const [searchQuery, setSearchQuery] = useSearchQuery();

  const isLoading = disableButton ? false : isPending;

  // filter courses based on search
  const filteredCourses = useFilteredCourses(courseData?.courses, searchQuery);

  // toggle course selection
  const { selected, toggle, isSelected, clear } = useSelection();

  //track which course is currently pending in action
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [isBulkEnrolling, setIsBulkEnrolling] = useState(false);

  const handleSingleEnroll = (courseId) => {
    setActiveCourseId(courseId);
    if (isSelected(courseId)) toggle(courseId);

    enrollCourse(
      {
        courseIds: [courseId],
      },
      {
        onSettled: () => setActiveCourseId(null),
      }
    );
  };

  const handleUnenroll = (courseId) => {
    setActiveCourseId(courseId);

    unenrollCourse(courseId, {
      onSuccess: () => {
        if (isSelected(courseId)) toggle(courseId);
      },
      onSettled: () => setActiveCourseId(null),
    });
  };

  const handleBulkEnroll = () => {
    setIsBulkEnrolling(true);

    enrollCourse(
      {
        courseIds: selected,
      },
      {
        onSettled: () => {
          setIsBulkEnrolling(false);
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
      <tr key={course._id} className='hover:bg-gray-50 transition-colors'>
        <td className='px-4 py-4'>
          <input
            type='checkbox'
            checked={isSelected(course._id) || course.status}
            disabled={course.status}
            onChange={() => toggle(course._id)}
            className='w-4 h-4 rounded border-gray-300 focus:ring-0 transition-colors'
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
            <span className={`${statusStyle}`}>Enrolled</span>
          ) : (
            <span className={`${statusStyle}`}>Not Enrolled</span>
          )}
        </td>

        <td className='px-6 py-4'>
          <Button
            onClick={() =>
              course.status
                ? handleUnenroll(course._id)
                : handleSingleEnroll(course._id)
            }
            variant={course.status ? 'danger' : 'primary'}
            className='gap-1 w-30'
            size='sm'
            disabled={isCourseActionPending}
          >
            {isCourseActionPending ? (
              <ClipLoader size={16} color='white' />
            ) : course.status ? (
              'Unenroll'
            ) : (
              'Enroll'
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

      {/* Empty State */}
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
          {/* Desktop Table */}
          <div className='hidden lg:block'>
            <DataTable
              columns={COLUMNS}
              renderRow={renderRow}
              data={filteredCourses}
              isPending={isLoading}
              showSkeletonHead={false}
            />
          </div>

          {/* Mobile Cards */}
          <div className='lg:hidden'>
            {isLoading ? (
              <LecturerCourseCardSkeleton showSkeletonHead={false} />
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 w-full'>
                {filteredCourses.map((course) => (
                  <CourseAssignmentCard
                    key={course._id}
                    course={course}
                    onPrimaryAction={handleSingleEnroll}
                    onSecondaryAction={handleUnenroll}
                    isLoading={activeCourseId === course._id}
                    showCheckbox
                    isSelected={isSelected(course._id) || course.status}
                    onToggleSelect={toggle}
                    primaryActionText={ACTION_TEXTS.ENROLL}
                    secondaryActionText={ACTION_TEXTS.UNENROLL}
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
          actionLabel='Enroll Selected'
          icon={Check}
          isPending={isBulkEnrolling}
          onAction={() => handleBulkEnroll()}
        />
      )}
    </div>
  );
}

export default StudentAllCourses;
