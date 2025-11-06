import { useSearchParams } from 'react-router-dom';
import { useButtonState } from '../../../hooks/useButtonState';
import { useAllCourses } from '../general/useAllCourses';
import { useEnrollCourse } from './useEnrollCourse';
import { useUnenrollCourse } from './useUnenrollCourse';
import { useState } from 'react';
import SearchBar from '../../../components/SearchBar';
import CourseAssignmentCard from '../../../components/CourseAssignmentCard';
import LecturerCourseCardSkeleton from '../../../components/LecturerCourseCardSkeleton';
import DataTable from '../../../components/DataTable';
import { BookOpen, Check, X } from 'lucide-react';
import EmptyCard from '../../../components/EmptyCard';
import Button from '../../../components/Button';
import { ClipLoader } from 'react-spinners';
import BulkActionBar from '../../../components/BulkActionBar';

function StudentAllCourses() {
  const { disableButton } = useButtonState();
  const { data: courseData, isPending } = useAllCourses({
    enabled: !disableButton,
  });
  // course
  const courses = courseData?.courses || [];
  const { enrollCourse } = useEnrollCourse();
  const { unenrollCourse } = useUnenrollCourse();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );

  const isLoading = disableButton ? false : isPending;

  // filter courses based on search
  const filteredCourses = courses.filter(
    (course) =>
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams);
    if (value.trim()) params.set('search', value);
    else params.delete('search');
    setSearchParams(params);
  };

  // toggle course selection
  const handleToggleSelect = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

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

    setSelectedCourses((prev) => prev.filter((id) => id !== courseId)); // remove from selected courses when unassigning
    unenrollCourse(courseId, {
      onSettled: () => setActiveCourseId(null),
    });
  };

  const handleBulkEnroll = () => {
    setIsBulkEnrolling(true);

    enrollCourse(
      {
        courseIds: selectedCourses,
      },
      {
        onSettled: () => setIsBulkEnrolling(null),
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
          onChange={handleSearch}
          disabled={disableButton}
        />
      </div>
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
                    onPrimaryAction ={handleSingleEnroll}
                    // onUnassign={handleUnassign}
                    isLoading={activeCourseId === course._id}
                    showCheckbox
                    isSelected={selectedCourses.includes(course._id)}
                    onToggleSelect={handleToggleSelect}
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
      <BulkActionBar
        // count={unassignedSelectedCourses.length}
        actionLabel='Enroll Selected'
        icon={Check}
        isPending={isBulkEnrolling}
        onAction={() => handleBulkEnroll()}
      />
    </div>
  );
}

export default StudentAllCourses;
