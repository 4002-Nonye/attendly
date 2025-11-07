import SearchBar from '../../../components/SearchBar';
import { useButtonState } from '../../../hooks/useButtonState';
import { useAssignedCourses } from './useAssignedCourses';
import { BookOpen } from 'lucide-react';
import EmptyCard from '../../../components/EmptyCard';
import DataTable from '../../../components/DataTable';
import Button from '../../../components/Button';
import LecturerCourseCardSkeleton from '../../../components/LecturerCourseCardSkeleton';
import CourseCard from '../../../components/CourseCard';
import { useFilteredCourses } from '../../../hooks/useFilteredCourses';
import { useCourseSessionStatus } from './useCourseSessionStatus';
import ClipLoader from 'react-spinners/ClipLoader';
import { useHandleCreateSession } from '../../session/lecturer/useHandleCreateSession';
import { useSearchQuery } from '../../../hooks/useSearchQuery';

function LecturerAssignedCourses() {
  const { disableButton } = useButtonState();
  const { data: courseData, isPending } = useAssignedCourses({
    enabled: !disableButton,
  });


 const [searchQuery, setSearchQuery] = useSearchQuery();

  // filter courses
  const filteredCourses = useFilteredCourses(courseData?.courses, searchQuery);

  // add session status to course
  const { coursesWithSessionStatus, isActiveSessionPending } =
    useCourseSessionStatus(filteredCourses);


  const isLoading = disableButton ? false : isPending || isActiveSessionPending;

  const handleViewCourses = (tab) => setSearchQuery({ tab });

  const { handleCreateSession, activeCourseId } = useHandleCreateSession();

  const renderRow = (course) => (
    <tr key={course._id} className='hover:bg-gray-50 transition-colors'>
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
          className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
            course.isOngoing
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {course.sessionStatus}
        </span>
      </td>
      <td className='px-6 py-4'>
        <Button
          variant={course.isOngoing ? 'secondary' : 'primary'}
          size='sm'
          className='capitalize w-35'
          disabled={activeCourseId === course._id || course.isOngoing}
          onClick={() => handleCreateSession(course._id)}
        >
          {activeCourseId === course._id ? (
            <ClipLoader size={16} color='white' />
          ) : course.isOngoing ? (
            'Session Active'
          ) : (
            'Start Session'
          )}
        </Button>
      </td>
    </tr>
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
              data={coursesWithSessionStatus}
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
                {coursesWithSessionStatus.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    isCreatingSession={activeCourseId === course._id}
                    onAction={() => handleCreateSession(course._id)}
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

export default LecturerAssignedCourses;
