import { BookOpen } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Button from '../../../components/Button';
import CourseCard from '../../../components/CourseCard';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import SearchBar from '../../../components/SearchBar';
import LecturerCourseCardSkeleton from '../../../components/skeletons/LecturerCourseCardSkeleton';
import { useFilteredCourses } from '../../../hooks/filters/useFilteredCourses';
import { useButtonState } from '../../../hooks/useButtonState';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import { getStatusStyle } from '../../../utils/courseHelpers';
import { useActiveSessionStudent } from '../../session/student/useActiveSessionStudent';
import { useCourseSessionStatus } from '../general/useCourseSessionStatus';

import { useRegisteredCourses } from './useRegisteredCourses';

function StudentEnrolledCourses() {
  const { disableButton } = useButtonState();
  const navigate = useNavigate();
  const { data: registeredcourses, isPending } = useRegisteredCourses();

  const [searchQuery, setSearchQuery] = useSearchQuery();
  const [_, setSearchParams] = useSearchParams();
  const { data: activeSession, isPending: isActiveSessionPending } =
    useActiveSessionStudent();

  //filter courses based on search
  const filteredCourses = useFilteredCourses(
    registeredcourses?.courses,
    searchQuery
  );

  // add session status to course
  const { coursesWithSessionStatus } = useCourseSessionStatus(
    filteredCourses,
    activeSession
  );

  const handleViewCourses = (tab) => {
    setSearchParams({ tab });
  };

  const handleViewSessions = () => {
    navigate('/sessions');
  };

  const isLoading = disableButton ? false : isPending || isActiveSessionPending;

  const renderRow = (course) => {
    const statusStyle = getStatusStyle(course.sessionStatus);
  
    return (
      <tr
        key={course._id}
        className='hover:bg-gray-50 transition-colors capitalize'
      >
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

        <td className='px-6 py-4 text-sm'>
          <span
            className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${statusStyle}`}
          >
            {course.sessionStatus}
          </span>
        </td>

      </tr>
    );
  };

  const columns = ['Course', 'Level', 'Units', 'Status'];

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

      {!coursesWithSessionStatus.length && !isLoading ? (
        <EmptyCard
          icon={BookOpen}
          title={searchQuery ? 'No courses found' : 'No courses available'}
          message={
            searchQuery
              ? 'Try adjusting your search query'
              : `You haven't enrolled in any courses yet`
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
          {/* Desktop Table */}
          <div className='hidden lg:block'>
            <DataTable
              columns={columns}
              renderRow={renderRow}
              data={coursesWithSessionStatus}
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
                {coursesWithSessionStatus.map((course) => {
                  const isActive = course.isOngoing;
                  return (
                    <CourseCard key={course._id} course={course}>
                      <Button
                        variant={isActive ? 'primary' : 'secondary'}
                        size='sm'
                        className='capitalize w-35'
                        disabled={!isActive}
                        onClick={handleViewSessions}
                      >
                        {isActive ? 'View Sessions' : 'Session Inactive'}
                      </Button>
                    </CourseCard>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default StudentEnrolledCourses;
