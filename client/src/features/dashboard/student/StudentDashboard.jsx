import {
  BookOpen,
  CheckCircle,
  XCircle,
  CalendarClock,
  Calendar,
  Clock,
  ArrowRight,
  AlertCircle,
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
import StudentCourseCard from '../../../components/StudentCourseCard';

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

  const {
    // Default to 0 to prevent NaN error
    totalCourses = 0,
    totalSessions = 0,
    attendedSessions = 0,
  } = stats || {};

  const statsData = [
    {
      label: 'My Courses',
      value: totalCourses,
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total Sessions',
      value: totalSessions,
      icon: CalendarClock,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Attended Sessions',
      value: attendedSessions,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Missed Classes',
      value: totalSessions - attendedSessions,
      icon: XCircle,
      color: 'bg-red-100 text-red-600',
    },
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
          title='No Active Academic Period'
          message={`Your school administrator hasn't set up the current academic year and semester yet.  Please contact your admin to activate the academic period.`}
          iconBg='bg-orange-100'
        />
      ) : (
        <>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
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
                  <StudentCourseCard key={course.courseId} course={course} />
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
                <Link to='/courses/register'>
                  <Button variant='primary'>Browse Courses</Button>
                </Link>
              </EmptyCard>
            )}
          </div>

          {/* Recent Attendance Sessions */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 mb-6 lg:mb-8'>
            <div className='p-4 lg:p-6 border-b border-gray-100'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    Recent Attendance
                  </h3>
                  <p className='text-sm text-gray-600 mt-1'>
                    Your latest attendance records
                  </p>
                </div>
                {recentSessions.length > 0 && (
                  <Link
                    to='/attendance'
                    className='text-sm text-blue-600 hover:underline font-medium'
                  >
                    View all
                  </Link>
                )}
              </div>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Course
                    </th>
                    <th className='px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date & Time
                    </th>
                    <th className='px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {recentSessions.map((session, index) => (
                    <tr
                      key={session.sessionId}
                      className={`
                    hover:bg-gray-50 transition-colors cursor-pointer
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                  `}
                    >
                      <td className='px-4 lg:px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {session.courseTitle}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {session.courseCode}
                          </div>
                        </div>
                      </td>
                      <td className='px-4 lg:px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center gap-2 text-sm text-gray-900'>
                          <Calendar className='w-4 h-4 text-gray-400' />
                          <span>
                            {new Date(session.date).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StudentDashboard;
