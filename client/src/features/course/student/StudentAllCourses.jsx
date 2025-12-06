import { useState } from 'react';
import { BookOpen, Check } from 'lucide-react';

import BulkActionBar from '../../../components/BulkActionBar';
import CourseAssignmentCard from '../../../components/CourseAssignmentCard';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import SelectionInfoBar from '../../../components/SelectionInfoBar';
import LecturerCourseCardSkeleton from '../../../components/skeletons/LecturerCourseCardSkeleton';
import StudentAllCoursesRow from '../../../components/tableRows/StudentAllCourses';
import { useFilteredCourses } from '../../../hooks/filters/useFilteredCourses';
import { useButtonState } from '../../../hooks/useButtonState';
import { usePagination } from '../../../hooks/usePagination';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import { useSelection } from '../../../hooks/useSelection';
import { useAllCourses } from '../general/useAllCourses';

import { useEnrollCourse } from './useEnrollCourse';
import { useUnenrollCourse } from './useUnenrollCourse';

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

  // pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    currentData: paginatedCourses,
    setCurrentPage,
  } = usePagination(filteredCourses, 10);

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

const renderRow = (course) => (
  <StudentAllCoursesRow
    key={course._id}
    course={course}
    isSelected={isSelected(course._id)}
    onToggle={toggle}
    onEnroll={handleSingleEnroll}
    onUnenroll={handleUnenroll}
    isActionPending={activeCourseId === course._id}
  />
);


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
              data={paginatedCourses}
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
                {paginatedCourses.map((course) => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
            />
          )}
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
