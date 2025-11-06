import { useButtonState } from '../../../hooks/useButtonState';
import { useAllCourses } from '../general/useAllCourses';
import { useEnrollCourse } from './useEnrollCourse';
import { useUnenrollCourse } from './useUnenrollCourse';
import { useState } from 'react';
import SearchBar from '../../../components/SearchBar';
import CourseAssignmentCard from '../../../components/CourseAssignmentCard';
import LecturerCourseCardSkeleton from '../../../components/LecturerCourseCardSkeleton';
import { BookOpen, Check, X } from 'lucide-react';
import EmptyCard from '../../../components/EmptyCard';
import BulkActionBar from '../../../components/BulkActionBar';
import SelectionInfoBar from '../../../components/SelectionInfoBar';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import { useFilteredCourses } from '../../../hooks/useFilteredCourses';
import { useSelection } from '../../../hooks/useSelection';

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
    setActiveCourseId(courseId); // track which course is enrolling
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
    setActiveCourseId(courseId); // track which course is enrolling

    if (isSelected(courseId)) toggle(courseId); // remove from selection if selected
    unenrollCourse(courseId, {
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
          setIsBulkEnrolling(null);
          clear();
        },
      }
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
          {/* Mobile */}
          <div className=' '>
            {isLoading ? (
              <LecturerCourseCardSkeleton showSkeletonHead={false} />
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4 gap-5 w-full'>
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
                    primaryActionText='Enroll'
                    secondaryActionText='Unenroll'
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
