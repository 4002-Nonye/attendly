import { useState } from 'react';
import PageHeader from '../../../components/PageHeader';
import Button from '../../../components/Button';
import { useRegisteredCourses } from './useRegisteredCourses';

function StudentCourse() {
  const [activeTab, setActiveTab] = useState('my-courses');
  const { data: registeredCourses } = useRegisteredCourses();

  const courses = registeredCourses?.courses;

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
          onClick={() => setActiveTab('my-courses')}
          variant='pill'
          size='sm'
          active={activeTab === 'my-courses'}
          className='rounded-md'
        >
          My Courses
        </Button>
        <Button
          onClick={() => setActiveTab('all-courses')}
          variant='pill'
          size='sm'
          active={activeTab === 'all-courses'}
          className='rounded-md'
        >
          All Courses
        </Button>
      </div>

      {/* Content */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
        {/* Table */}
        {courses?.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='text-left py-3 px-4 text-sm font-semibold text-gray-700'>
                    Course Title
                  </th>
                  <th className='text-left py-3 px-4 text-sm font-semibold text-gray-700'>
                    Code
                  </th>

                  <th className='text-left py-3 px-4 text-sm font-semibold text-gray-700'>
                    Credits
                  </th>

                  <th className='text-left py-3 px-4 text-sm font-semibold text-gray-700'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses?.map((course) => (
                  <tr
                    key={course._id}
                    className='border-b border-gray-100 hover:bg-gray-50 transition-colors'
                  >
                    <td className='py-4 px-4 text-sm text-gray-900'>
                      {course.courseTitle}
                    </td>
                    <td className='py-4 px-4 text-sm text-gray-600'>
                      {course.courseCode}
                    </td>

                    <td className='py-4 px-4 text-sm text-gray-600'>
                      {course.unit}
                    </td>

                    <td className='py-4 px-4'>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => console.log(course.id)}
                          className='px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded transition-colors'
                        >
                          Unregister
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='text-center py-12'>
            <p className='text-gray-500'>
              opps! seems like you haven't registered courses. click the button
              below to start
            </p>
            <button onClick={() => setActiveTab('all-courses')}>
              register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentCourse;
