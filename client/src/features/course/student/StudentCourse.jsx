import PageHeader from '../../../components/PageHeader';
import Button from '../../../components/Button';
import { useSearchParams } from 'react-router-dom';
import StudentEnrolledCourses from './StudentEnrolledCourses';
import StudentAllCourses from './StudentAllCourses';

function StudentCourse() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get active tab from URL, default to 'my-courses' if none
  const activeTab = searchParams.get('tab') || 'my-courses';

  // update URL when tab 
  const handleTabChange = (tab) => {
    setSearchParams({ tab }); 
  };

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Courses'
        subtitle='Browse and manage your courses'
      />

      {/* Tabs */}
      <div className='flex gap-2 mb-6 bg-gray-100 p-2 rounded-lg w-fit'>
        <Button
          onClick={() => handleTabChange('my-courses')}
          variant='pill'
          size='sm'
          active={activeTab === 'my-courses'}
          className='rounded-md'
        >
          My Courses
        </Button>
        <Button
          onClick={() => handleTabChange('all-courses')}
          variant='pill'
          size='sm'
          active={activeTab === 'all-courses'}
          className='rounded-md'
        >
          All Courses
        </Button>
      </div>

      {/* Content */}
      {/* Render based on activeTab */}
      {activeTab === 'my-courses' ? (
        <StudentEnrolledCourses />
      ) : (
        <StudentAllCourses />
      )}
    </div>
  );
}

export default StudentCourse;