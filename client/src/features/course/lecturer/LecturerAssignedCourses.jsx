import { useState } from 'react';
import SearchBar from '../../../components/SearchBar';
import { useButtonState } from '../../../hooks/useButtonState';
import { useSearchParams } from 'react-router-dom';
import { useAssignedCourses } from './useAssignedCourses';
import { BookOpen, Check } from 'lucide-react';
import EmptyCard from '../../../components/EmptyCard';
import DataTable from '../../../components/DataTable';
import Button from '../../../components/Button';
import LecturerCourseCardSkeleton from '../../../components/LecturerCourseCardSkeleton';
import CourseCard from '../../../components/CourseCard';

function LecturerAssignedCourses() {
  const { disableButton } = useButtonState();
  const { data: courseData, isPending } = useAssignedCourses({
    enabled: !disableButton,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );

  const isLoading = disableButton ? false : isPending;
  // course
  const courses = courseData?.data || [];

  //filter courses based on search
  const filteredCourses = courses?.filter(
    (course) =>
      course?.courseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course?.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams);
    if (value.trim()) params.set('search', value);
    else params.delete('search');
    setSearchParams(params);
  };

  const handleViewCourses = (tab) => {
    setSearchParams({ tab });
  };

  const renderRow = (course) => {
    return (
      <tr key={course._id} className={`hover:bg-gray-50 transition-colors `}>
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

        <td className='px-6 py-4 text-sm text-gray-700'>
          {course.totalSessions}
        </td>

        <td className='px-6 py-4'>
          <Button variant='primary' className='capitalize text-sm ' size='md'>
            start attendance
          </Button>
        </td>
      </tr>
    );
  };

  const columns = ['Course', 'Level', 'Unit', 'Sessions', 'Actions'];

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
          <div className='hidden lg:block'>
            <DataTable
              columns={columns}
              renderRow={renderRow}
              data={filteredCourses}
              isPending={isLoading}
              showSkeletonHead={false}
            />
          </div>

          <div className=' lg:hidden '>
            {isLoading ? (
              <LecturerCourseCardSkeleton showSkeletonHead={false} />
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 w-full'>
                {filteredCourses.map((course) => (
                  <CourseCard
                    course={course}
                    actionType='link'
                    actionText='Start Attendance'
                    actionLink={`/courses/${course._id}/start-attendance`}
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
