import { useRegisteredCourses } from './useRegisteredCourses';
import { useButtonState } from '../../../hooks/useButtonState';
import { useSearchParams } from 'react-router-dom';

import SearchBar from '../../../components/SearchBar';
import { BookOpen } from 'lucide-react';
import EmptyCard from '../../../components/EmptyCard';

import LecturerCourseCardSkeleton from '../../../components/LecturerCourseCardSkeleton';
import CourseCard from '../../../components/CourseCard';
import Button from '../../../components/Button';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import { useFilteredCourses } from '../../../hooks/useFilteredCourses';

function StudentEnrolledCourses() {
  const { disableButton } = useButtonState();
  const { data: registeredcourses, isPending } = useRegisteredCourses();

  const [searchQuery, setSearchQuery] = useSearchQuery();
  const [_, setSearchParams] = useSearchParams();

  const isLoading = disableButton ? false : isPending;

  //filter courses based on search
  const filteredCourses = useFilteredCourses(
    registeredcourses?.courses,
    searchQuery
  );

  const handleViewCourses = (tab) => {
    setSearchParams({ tab });
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

      {!filteredCourses.length && !isLoading ? (
        <EmptyCard
          icon={BookOpen}
          title={searchQuery ? 'No courses found' : 'No courses available'}
          message={
            searchQuery
              ? 'Try adjusting your search query'
              : `You haven't assigned yourself to any course yet`
          }
          iconColor='text-gray-400'
          iconBg='bg-gray-100'
        >
          {!searchQuery && (
            <Button
              disabled={disableButton}
              variant='primary'
              onClick={() => handleViewCourses('all-courses')}
            >
              View Courses
            </Button>
          )}
        </EmptyCard>
      ) : (
        <>
          <div>
            {isLoading ? (
              <LecturerCourseCardSkeleton showSkeletonHead={false} />
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4 gap-5 w-full'>
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    actionType='link'
                    // actionText='Start Attendance'
                    // actionLink={`/courses/${course._id}/start-attendance`}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default StudentEnrolledCourses;
