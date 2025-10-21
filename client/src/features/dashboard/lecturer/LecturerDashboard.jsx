import {
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button';
import RecentSessionsTable from '../../../components/RecentSessionsTable';
import { useSessionTotal } from './useSessionTotal';
import { useStudentTotalLecturer } from './useStudentTotalLecturer';
import LecturerDashboardSkeleton from '../../../components/LecturerDashboardSkeleton';
import PageHeader from '../../../components/PageHeader';
import Card from '../../../components/Card';
import { useAssignedCourses } from './useAssignedCourses';
import CourseCard from '../../../components/CourseCard';
import { DASHBOARD_COURSE_LIMIT } from '../../../config/dashboard';
import { useSchoolInfo } from '../../../hooks/useSchoolInfo';
import EmptyAcademicYear from '../../../components/EmptyAcademicYear';

function LecturerDashboard() {
 
  const { data: totalSessions, isPending: isSessionPending } =
    useSessionTotal();
  const { data: totalStudents, isPending: isStudentPending } =
    useStudentTotalLecturer();
  const { data: courses, isPending: isAssignedCoursesPending } =
    useAssignedCourses();
  const { academicYear, semester } = useSchoolInfo();

  const displayedCourses =
    courses?.data?.slice(0, DASHBOARD_COURSE_LIMIT) || [];
  const totalCoursesCount = courses?.data?.length || 0;
  const hasMoreCourses = totalCoursesCount > DASHBOARD_COURSE_LIMIT;

  const averageAttendance = 87;

  const stats = [
    {
      label: 'My Courses',
      value: totalCoursesCount,
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total Students',
      value: totalStudents?.total || 0,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Sessions Conducted',
      value: totalSessions?.total || 0,
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

  if (
   
    isSessionPending ||
    isStudentPending ||
    isAssignedCoursesPending
  ) {
    return <LecturerDashboardSkeleton />;
  }

  return (
    <div className='w-full'>
      {/* Welcome Header */}
      <PageHeader
        title='Welcome back'
        subtitle='Ready to track attendance for your classes'
      />

      {!academicYear || !semester ? (
        <EmptyAcademicYear
          icon={AlertCircle}
          iconColor='text-orange-600'
          title='No Active Academic Period'
          message={`Your school administrator hasn't set up the current academic year and semester yet.  Please contact your admin to activate the academic period.`}
          iconBg='bg-orange-100'
        />
      ) : (
        <>
          {/* Stats Cards */}
          <div className='grid grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8'>
            {stats.map((stat, index) => (
              <Card key={index} {...stat} isLink={false} />
            ))}
          </div>

          {/* My Courses */}
          <div className='mb-6 lg:mb-8'>
            <div className='flex items-center justify-between mb-4 lg:mb-5'>
              <div>
                <h2 className='text-lg lg:text-xl font-bold text-gray-900'>
                  My Courses
                </h2>
                <p className='text-xs lg:text-sm text-gray-600 mt-1'>
                  {hasMoreCourses
                    ? `Showing ${DASHBOARD_COURSE_LIMIT} of ${totalCoursesCount} courses`
                    : `Courses you're teaching this semester`}
                </p>
              </div>
              {totalCoursesCount > 0 && (
                <Link
                  to='/courses'
                  className='text-xs lg:text-sm text-blue-600 hover:underline font-medium'
                >
                  View all {hasMoreCourses && `(${totalCoursesCount})`}
                </Link>
              )}
            </div>

            {displayedCourses.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4'>
                {displayedCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    actionText='Start Attendance'
                    actionLink={`/courses/${course._id}/start-attendance`}
                  />
                ))}
              </div>
            ) : (
              <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-12'>
                <div className='max-w-md mx-auto text-center'>
                  <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <BookOpen className='w-8 h-8 text-blue-600' />
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    No Courses Yet
                  </h3>
                  <p className='text-gray-600 mb-6'>
                    You haven't registered for any courses yet. Register for
                    courses to start tracking attendance.
                  </p>
                  <Link to='/courses/register'>
                    <Button icon={Plus}>Register Course</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Recent Sessions Table */}
          <RecentSessionsTable />

          {/* Quick Actions */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6'>
            <h3 className='text-base lg:text-lg font-semibold text-gray-900 mb-4'>
              Quick Actions
            </h3>
            <div className='flex flex-wrap gap-3'>
              <Link to='/courses'>
                <Button variant='primary' icon={Eye} size='sm'>
                  View My Courses
                </Button>
              </Link>
              <Link to='/courses/register'>
                <Button variant='primary' icon={Plus} size='sm'>
                  Register Course
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LecturerDashboard;
