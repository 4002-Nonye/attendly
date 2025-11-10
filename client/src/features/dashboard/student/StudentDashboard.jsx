import {
  BookOpen,

  Calendar,
  Clock,
  AlertCircle,
  Eye,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../../../components/PageHeader';
import { useStudentDashboardStats } from './useStudentDashboardStats';
import { useStudentAttReport } from '../../attendance/student/useStudentAttReport';

import StudentDashboardSkeleton from '../../../components/StudentDashboardSkeleton';
import Card from '../../../components/Card';
import { useStudentRecentSession } from './useRecentSession';
import StatusBadge from '../../../components/StatusBadge';
import { DASHBOARD_COURSE_LIMIT } from '../../../config/dashboard';
import EmptyCard from '../../../components/EmptyCard';
import { useSchoolInfo } from '../../../hooks/useSchoolInfo';
import Button from '../../../components/Button';
import SectionIntro from '../../../components/SectionIntro';

import DataTable from '../../../components/DataTable';
import EmptyChart from '../../../components/EmptyChart';
import { getStudentStats } from '../../../utils/dashboardStats';
import QuickActions from '../../../components/QuickActions';
import StudentAttendanceCard from '../../../components/StudentAttendanceCard';

function StudentDashboard() {
  const { data: stats, isPending: isStatPending } = useStudentDashboardStats();
  const { data: attReport, isPending: isAttReportPending } =
    useStudentAttReport();
  const { data: sessions, isPending: isSessionPending } =
    useStudentRecentSession();
  const { academicYear, semester } = useSchoolInfo();

  const recentSessions = sessions?.recentSessions;

  const courseAttendance =
    attReport?.report?.slice(0, DASHBOARD_COURSE_LIMIT) || [];

  const statsData = getStudentStats(stats);


  const columns = ['Course', 'Date & Time', 'Status'];

  // table row
  const renderRow = (session) => (
    <tr
      key={session.sessionId}
      className={` hover:bg-gray-50 transition-colors cursor-pointer`}
    >
      <td className='px-4 lg:px-6 py-4 whitespace-nowrap'>
        <div>
          <div className='text-sm font-medium text-gray-900'>
            {session.courseTitle}
          </div>
          <div className='text-sm text-gray-500'>{session.courseCode}</div>
        </div>
      </td>
      <td className='px-4 lg:px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center gap-2 text-sm text-gray-900'>
          <Calendar className='w-4 h-4 text-gray-400' />
          <span>
            {new Date(session.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        <div className='flex items-center gap-2 text-sm text-gray-500 mt-1'>
          <Clock className='w-4 h-4 text-gray-400' />
          <span>{session.time}</span>
        </div>
      </td>
      <td className='px-4 lg:px-6 py-4 whitespace-nowrap'>
        <StatusBadge status={session.studentStatus} />
      </td>
    </tr>
  );

  const actions = [
    { to: '/courses', label: 'View My Courses', icon: Eye },
    { to: '/courses?tab=all-courses', label: 'Register Course', icon: Plus },
  ];

  if (isStatPending || isAttReportPending || isSessionPending) {
    return <StudentDashboardSkeleton />;
  }

  return (
    <div className='w-full'>
      {/* Page Header */}
      <PageHeader
        title='Welcome back'
        subtitle='Track your attendance and stay on top of your classes'
      />

      {!academicYear || !semester ? (
        <EmptyCard
          icon={AlertCircle}
          iconColor='text-orange-600'
          title='Academic Year Not Set'
          message="Your school administrator hasn't configured the current academic year and semester yet. Please contact your admin or check back later."
          iconBg='bg-orange-100'
        />
      ) : (
        <>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
            {statsData.map((stat, index) => (
              <Card key={index} {...stat} isLink={false} />
            ))}
          </div>

          {/* My Attendance by Course */}
          <div className='mb-6 lg:mb-8'>
            <SectionIntro
              title='My Attendance by Course'
              subTitle='Track your attendance for each course'
              linkTo='/attendance'
              length={courseAttendance.length}
              className='mb-4 lg:mb-5'
            />

            {courseAttendance.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 lg:gap-4'>
                {courseAttendance.map((course) => (
                  <StudentAttendanceCard key={course.courseId} course={course} />
                ))}
              </div>
            ) : (
              <EmptyCard
                icon={BookOpen}
                iconColor='text-blue-600'
                title='No Courses Yet'
                message={`You haven't enrolled in any courses yet. Register for courses to start tracking your attendance.`}
                iconBg='bg-blue-100'
              >
                <Link to='/courses?tab=all-courses'>
                  <Button variant='primary'>Browse Courses</Button>
                </Link>
              </EmptyCard>
            )}
          </div>

          {/* Recent Attendance Sessions */}
          {!recentSessions.length ? (
            <EmptyChart
              icon={Calendar}
              message='No recent sessions found'
              subMessage='Sessions will appear here once created'
              iconColor='w-8 h-8 mb-4 text-gray-300'
              className='bg-white rounded-xl shadow-sm border border-gray-100 p-12 mb-8 h-96'
            />
          ) : (
            <DataTable
              columns={columns}
              renderRow={renderRow}
              data={recentSessions}
            >
              <div className='p-6 border-b border-gray-100'>
                <SectionIntro
                  title='Recent Class Sessions'
                  subTitle='Latest attendance sessions across all courses'
                />
              </div>
            </DataTable>
          )}

          {/* Quick Actions */}
          <QuickActions actions={actions} />
        </>
      )}
    </div>
  );
}

export default StudentDashboard;
