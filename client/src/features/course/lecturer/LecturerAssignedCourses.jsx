import { BookOpen } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';

import Button from '../../../components/Button';
import CourseCard from '../../../components/CourseCard';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import LecturerCourseCardSkeleton from '../../../components/skeletons/LecturerCourseCardSkeleton';
import LecturerAssignedCoursesRow from '../../../components/tableRows/LecturerAssignedCoursesRow';
import { useFilteredCourses } from '../../../hooks/filters/useFilteredCourses';
import { useButtonState } from '../../../hooks/useButtonState';
import { usePagination } from '../../../hooks/usePagination';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import { useActiveSessionLecturer } from '../../session/lecturer/useActiveSessionLecturer';
import { useHandleCreateSession } from '../../session/lecturer/useHandleCreateSession';
import { useCourseSessionStatus } from '../general/useCourseSessionStatus';

import { useAssignedCourses } from './useAssignedCourses';

function LecturerAssignedCourses() {
  const { disableButton } = useButtonState();
  const [_, setSearchParams] = useSearchParams();
  const { data: courseData, isPending } = useAssignedCourses({
    enabled: !disableButton,
  });

  const [searchQuery, setSearchQuery] = useSearchQuery();

  const { data: activeSession, isPending: isActiveSessionPending } =
    useActiveSessionLecturer();

  // filter courses
  const filteredCourses = useFilteredCourses(courseData?.courses, searchQuery);

  // add session status to course
  const { coursesWithSessionStatus } = useCourseSessionStatus(
    filteredCourses,
    activeSession
  );

  // pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    currentData: paginatedCourses,
    setCurrentPage,
  } = usePagination(coursesWithSessionStatus, 10);

  const isLoading = disableButton ? false : isPending || isActiveSessionPending;




  const handleViewCourses = (tab) => {
    setSearchParams({ tab });
  };

  const { handleCreateSession, activeCourseId } = useHandleCreateSession();

const renderRow = (course) => (
  <LecturerAssignedCoursesRow
    key={course._id}
    course={course}
    onCreateSession={handleCreateSession}
    isCreatingSession={activeCourseId === course._id}
  />
);


  const columns = ['Course', 'Level', 'Unit', 'Status', 'Actions'];

  return (
    <div className='w-full'>
      {/* Search */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <SearchBar
          placeholder='Search courses...'
          value={searchQuery}
          onChange={setSearchQuery}
          disabled={disableButton}
        />
      </div>

      {!coursesWithSessionStatus.length && !isLoading ? (
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
          {/* Desktop */}
          <div className='hidden lg:block'>
            <DataTable
              columns={columns}
              renderRow={renderRow}
              data={paginatedCourses}
              isPending={isLoading}
              showSkeletonHead={false}
            />
          </div>

          {/* Mobile */}
          <div className='lg:hidden'>
            {isLoading ? (
              <LecturerCourseCardSkeleton showSkeletonHead={false} />
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 w-full'>
                {paginatedCourses.map((course) => {
                  const isCreatingSession = activeCourseId === course._id;
                  const isActive = course.isOngoing;
                  return (
                    <CourseCard key={course._id} course={course}>
                      <Button
                        variant={!isActive ? 'primary' : 'secondary'}
                        size='sm'
                        className='capitalize text-sm mt-auto'
                        disabled={isCreatingSession || isActive}
                        onClick={() => handleCreateSession(course._id)}
                      >
                        {isCreatingSession ? (
                          <ClipLoader size={22} color='white' />
                        ) : isActive ? (
                          'Session active'
                        ) : (
                          'Start Session'
                        )}
                      </Button>
                    </CourseCard>
                  );
                })}
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
    </div>
  );
}

export default LecturerAssignedCourses;
