import { BookOpen, Plus, Eye, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button';

import LecturerDashboardSkeleton from '../../../components/LecturerDashboardSkeleton';
import PageHeader from '../../../components/PageHeader';
import Card from '../../../components/Card';

import { DASHBOARD_COURSE_LIMIT } from '../../../config/dashboard';
import { useSchoolInfo } from '../../../hooks/useSchoolInfo';

import EmptyCard from '../../../components/EmptyCard';
import { useLecturerDashboardStats } from './useLecturerDashboardStats';
import SectionIntro from '../../../components/SectionIntro';

import RecentSessions from '../../../components/RecentSessions';
import CourseCard from '../../../components/CourseCard';
import { getLecturerStats } from '../../../utils/dashboardStats';
import QuickActions from '../../../components/QuickActions';

import { useHandleCreateSession } from '../../session/lecturer/useHandleCreateSession';
import { useAssignedCourses } from '../../course/lecturer/useAssignedCourses';
import { useCourseSessionStatus } from '../../course/general/useCourseSessionStatus';
import { useActiveSessionLecturer } from '../../session/lecturer/useActiveSessionLecturer';
import { ClipLoader } from 'react-spinners';

function LecturerDashboard() {
  const { data: courses, isPending: isAssignedCoursesPending } =
    useAssignedCourses();

  const { academicYear, semester } = useSchoolInfo();
  const { data: stat, isStatPending } = useLecturerDashboardStats();
  const { data: activeSession, isPending: isActiveSessionPending } =
    useActiveSessionLecturer();
  const { totalCourses = 0 } = stat || {};
  const stats = getLecturerStats(stat);

  const displayedCourses =
    courses?.courses?.slice(0, DASHBOARD_COURSE_LIMIT) || [];

  // add session status to course
  const { coursesWithSessionStatus } = useCourseSessionStatus(
    displayedCourses,
    activeSession
  );

  // start session
  const { handleCreateSession, activeCourseId } = useHandleCreateSession();

  const actions = [
    { to: '/courses', label: 'View My Courses', icon: Eye },
    { to: '/courses?tab=all-courses', label: 'Register Course', icon: Plus },
  ];

  if (isAssignedCoursesPending || isStatPending || isActiveSessionPending) {
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
            {coursesWithSessionStatus.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4'>
                {coursesWithSessionStatus.map((course) => {
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
                        ) : course.isOngoing ? (
                          'Session active'   
                        ) : (
                          'Start Session'
                        )}
                      </Button>
                    </CourseCard>
                  );
                })}
              </div>
            ) : (
              <EmptyCard
                icon={BookOpen}
                iconColor='text-blue-600'
                title='No Courses Yet'
                message={`You haven't registered for any courses yet. Register for courses to start tracking attendance.`}
                iconBg='bg-blue-100'
              >
                <Link to='/courses?tab=all-courses'>
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
          <QuickActions actions={actions} />
        </>
      )}
    </div>
  );
}

export default LecturerDashboard;
