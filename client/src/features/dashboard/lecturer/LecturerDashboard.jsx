import {
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button';
import RecentSessionsTable from '../../../components/RecentSessionsTable';
import { useCourseTotalLecturer } from './useCourseTotalLecturer';

import { useSessionTotal } from './useSessionTotal';
import { useStudentTotalLecturer } from './useStudentTotalLecturer';
import AcademicYear from '../../../components/AcademicYear';
import LecturerDashboardSkeleton from '../../../components/LecturerDashboardSkeleton';
import PageHeader from '../../../components/PageHeader';
import Card from '../../../components/Card';

function LecturerDashboard() {
  const { data: totalCourse, isCoursePending } = useCourseTotalLecturer();
  const { data: totalSessions, isPending: isSessionPending } =
    useSessionTotal();
  const { data: totalStudents, isPending: isStudentPending } =
    useStudentTotalLecturer();

  // TODO: Replace with actual API hooks

  const averageAttendance = 87;

  const stats = [
    {
      label: 'My Courses',
      value: totalCourse?.total,
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total Students',
      value: totalStudents?.total,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Sessions Conducted',
      value: totalSessions?.total,
      icon: Calendar,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Average Attendance',
      value: `${averageAttendance}%`,
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  // TODO: Replace with actual API data
  const courses = [
    {
      id: 1,
      name: 'Data Structures & Algorithms',
      code: 'CSC 301',
      students: 45,
      sessions: 8,
      level: 300,
      department: 'Computer Science',
    },
    {
      id: 2,
      name: 'Operating Systems',
      code: 'CSC 305',
      students: 52,
      sessions: 7,
      level: 300,
      department: 'Computer Science',
    },
    {
      id: 3,
      name: 'Database Management',
      code: 'CSC 307',
      students: 48,
      sessions: 9,
      level: 300,
      department: 'Computer Science',
    },
    {
      id: 4,
      name: 'Software Engineering',
      code: 'CSC 401',
      students: 35,
      sessions: 6,
      level: 400,
      department: 'Computer Science',
    },
  ];

  if (isCoursePending || isSessionPending || isStudentPending)
    return <LecturerDashboardSkeleton />;

  return (
    <div className='w-full '>
      {/* Welcome Header */}
      <PageHeader
        title='Welcome back'
        subtitle='Ready to track attendance for your classes'
      />

      {/* Stats Cards */}
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8'>
        {stats.map((stat, index) => (
          <Card key={index} {...stat} isLink={false} />
        ))}
      </div>

      {/* My Courses Section */}
      <div className='mb-6 lg:mb-8'>
        <div className='flex items-center justify-between mb-4 lg:mb-5'>
          <div>
            <h2 className='text-lg lg:text-xl font-bold text-gray-900'>
              My Courses
            </h2>
            <p className='text-xs lg:text-sm text-gray-600 mt-1'>
              Courses you're teaching this semester
            </p>
          </div>
          <Link
            to='/courses'
            className='text-xs lg:text-sm text-blue-600 hover:underline font-medium'
          >
            View all
          </Link>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 lg:gap-4'>
          {courses.map((course) => {
            // Determine badge color based on level
            const badgeColor =
              course.level === 400
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-blue-50 text-blue-700 border-blue-200';

            return (
              <div
                key={course.id}
                className='group bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 hover:border-gray-300 transition-all'
              >
                {/* Header */}
                <div className='mb-4'>
                  <div className='flex items-start justify-between gap-2 mb-2'>
                    <h3 className='font-semibold text-sm text-gray-900 leading-tight'>
                      {course.name}
                    </h3>
                    <span
                      className={`text-xs font-medium whitespace-nowrap px-2 py-0.5 rounded border ${badgeColor}`}
                    >
                      {course.code}
                    </span>
                  </div>
                  <p className='text-xs text-gray-500'>{course.department}</p>
                </div>

                {/* Stats - Inline */}
                <div className='flex items-center gap-4 text-xs mb-4 pb-4 border-b border-gray-100'>
                  <div>
                    <span className='text-gray-500'>Level </span>
                    <span className='font-semibold text-gray-900'>
                      {course.level}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-500'>{course.students} </span>
                    <span className='text-gray-500'>students</span>
                  </div>
                  <div>
                    <span className='text-gray-500'>{course.sessions} </span>
                    <span className='text-gray-500'>sessions</span>
                  </div>
                </div>

                {/* Action */}
                <Link
                  to={`/courses/${course.id}/start-attendance`}
                  className='flex items-center justify-between text-sm text-blue-700 font-medium group-hover:text-blue-600 transition-colors'
                >
                  <span>Start Attendance</span>
                  <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sessions Table */}
      <RecentSessionsTable />

      {/* Quick Actions */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6'>
        <h3 className='text-base lg:text-lg font-semibold text-gray-900 mb-4'>
          Quick Actions
        </h3>
        <div className='flex flex-wrap gap-3'>
          <Link to='/lecturer/courses'>
            <Button variant='primary' icon={Eye} size='sm'>
              View My Courses
            </Button>
          </Link>
          <Link to='/lecturer/courses/register'>
            <Button variant='primary' icon={Plus} size='sm'>
              Register Course
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LecturerDashboard;
