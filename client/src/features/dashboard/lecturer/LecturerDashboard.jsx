import {
  BookOpen,
  Users,
  Calendar,
  Plus,
  Eye,
  AlertCircle,
  CalendarClock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button';

import LecturerDashboardSkeleton from '../../../components/LecturerDashboardSkeleton';
import PageHeader from '../../../components/PageHeader';
import Card from '../../../components/Card';
import { useAssignedCourses } from './useAssignedCourses';

import { DASHBOARD_COURSE_LIMIT } from '../../../config/dashboard';
import { useSchoolInfo } from '../../../hooks/useSchoolInfo';

import EmptyCard from '../../../components/EmptyCard';
import { useLecturerDashboardStats } from './useLecturerDashboardStats';
import SectionIntro from '../../../components/SectionIntro';
import LecturerCourseCard from '../../../components/LecturerCourseCard';
import RecentSessions from '../../../components/RecentSessions';

function LecturerDashboard() {
  const { data: courses, isPending: isAssignedCoursesPending } =
    useAssignedCourses();
  const { academicYear, semester } = useSchoolInfo();
  const { data: stat, isStatPending } = useLecturerDashboardStats();

  const { totalStudents=0, totalSessions=0, activeSessions=0, totalCourses=0 } =
    stat || {};

  const displayedCourses =
    courses?.data?.slice(0, DASHBOARD_COURSE_LIMIT) || [];





  const stats = [
    {
      label: 'My Courses',
      value: totalCourses,
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Sessions Conducted',
      value: totalSessions,
      icon: Calendar,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Active Sessions',
      value: activeSessions,
      icon: CalendarClock,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  if (isAssignedCoursesPending || isStatPending) {
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
        <EmptyCard
          icon={AlertCircle}
          iconColor='text-orange-600'
          title='No Active Academic Period'
          message={`Your school administrator hasn't set up the current academic year and semester yet.  Please contact your admin to activate the academic period.`}
          iconBg='bg-orange-100'
        />
      ) : (
        <>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
            {stats.map((stat, index) => (
              <Card key={index} {...stat} isLink={false} />
            ))}
          </div>

          {/* My Courses */}
          <div className='mb-6 lg:mb-8'>
            <SectionIntro
              title='My Courses'
              subTitle={` you're teaching this semester`}
              linkTo='/courses'
              length={totalCourses}
              className='mb-4 lg:mb-5'
            />
            {displayedCourses.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4'>
                {displayedCourses.map((course) => (
                  <LecturerCourseCard
                    key={course._id}
                    course={course}
                    actionText='Start Attendance'
                    actionLink={`/courses/${course._id}/start-attendance`}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard
                icon={BookOpen}
                iconColor='text-blue-600'
                title='No Courses Yet'
                message={`You haven't registered for any courses yet. Register for courses to start tracking attendance.`}
                iconBg='bg-blue-100'
              >
                <Link to='/courses/register'>
                  <Button icon={Plus} variant='primary'>
                    Register Course
                  </Button>
                </Link>
              </EmptyCard>
            )}
          </div>

          {/* Recent Sessions Table */}
          <RecentSessions />

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
