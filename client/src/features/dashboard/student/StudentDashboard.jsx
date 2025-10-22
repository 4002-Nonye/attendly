import {
  BookOpen,
  CheckCircle,
  XCircle,
  CalendarClock,
  Calendar,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../../../components/PageHeader';

import { useStudentDashboardStats } from './useStudentDashboardStats';

function StudentDashboard() {
  const { data: stat, isStatPending } = useStudentDashboardStats();

  const { totalCourses, totalSessions, attendedSessions, missedSessions } =
    stat || {};

  const stats = [
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

  // TODO: Replace with actual API data
  const courseAttendance = [
    {
      id: 1,
      courseCode: 'CS201',
      courseName: 'Data Structures & Algorithms',
      attended: 17,
      total: 20,
      percentage: 9,
      level: 300,
    },
    {
      id: 2,
      courseCode: 'CS205',
      courseName: 'Operating Systems',
      attended: 15,
      total: 15,
      percentage: 100,
      level: 300,
    },
    {
      id: 3,
      courseCode: 'CS207',
      courseName: 'Database Management',
      attended: 14,
      total: 20,
      percentage: 70,
      level: 300,
    },
    {
      id: 4,
      courseCode: 'CS201',
      courseName: 'Software Engineering',
      attended: 18,
      total: 20,
      percentage: 40,
      level: 400,
    },
  ];

  // TODO: Replace with actual API data
  const recentSessions = [
    {
      id: 1,
      courseCode: 'CS201',
      courseName: 'Data Structures',
      date: '2024-10-18',
      time: '10:00 AM',
      status: 'present',
    },
    {
      id: 2,
      courseCode: 'CS205',
      courseName: 'Operating Systems',
      date: '2024-10-17',
      time: '2:00 PM',
      status: 'present',
    },
    {
      id: 3,
      courseCode: 'CS207',
      courseName: 'Database Management',
      date: '2024-10-16',
      time: '11:00 AM',
      status: 'absent',
    },
    {
      id: 4,
      courseCode: 'CS201',
      courseName: 'Software Engineering',
      date: '2024-10-15',
      time: '9:00 AM',
      status: 'present',
    },
  ];

  // Check for low attendance courses
  const lowAttendanceCourses = courseAttendance.filter(
    (course) => course.percentage < 75
  );

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className='w-full'>
      {/* Page Header */}
      <PageHeader
        title={`Welcome back`}
        subtitle='Track your attendance and stay on top of your classes'
      />

      {/* Stats Cards */}
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 hover:shadow-md transition-shadow'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs lg:text-sm font-medium text-gray-600'>
                    {stat.label}
                  </p>
                  <p className='text-xl lg:text-2xl font-bold text-gray-900 mt-1 lg:mt-2'>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-2 lg:p-3 rounded-lg`}>
                  <Icon className='w-5 h-5 lg:w-6 lg:h-6' />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Attendance Warning */}
      {/* {lowAttendanceCourses.length > 0 && (
        <div className='bg-red-50 border border-red-200 rounded-xl p-4 lg:p-6 mb-6 lg:mb-8'>
          <div className='flex items-start gap-3'>
            <div className='bg-red-100 p-2 rounded-lg flex-shrink-0'>
              <XCircle className='w-5 h-5 text-red-600' />
            </div>
            <div>
              <h3 className='font-semibold text-red-900 mb-1'>
                Low Attendance Alert
              </h3>
              <p className='text-sm text-red-800 mb-2'>
                You have low attendance in {lowAttendanceCourses.length}{' '}
                course(s). Minimum required: 75%
              </p>
              <ul className='space-y-1'>
                {lowAttendanceCourses.map((course) => (
                  <li key={course.id} className='text-sm text-red-700'>
                    • {course.courseCode} - {course.courseName} (
                    {course.percentage}%)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}  */}

      {/* My Attendance by Course */}
      <div className='mb-6 lg:mb-8'>
        <div className='flex items-center justify-between mb-4 lg:mb-5'>
          <div>
            <h2 className='text-lg lg:text-xl font-bold text-gray-900'>
              My Attendance by Course
            </h2>
            <p className='text-xs lg:text-sm text-gray-600 mt-1'>
              Track your attendance for each course
            </p>
          </div>
          <Link
            to='/student/courses'
            className='text-xs lg:text-sm text-blue-600 hover:underline font-medium'
          >
            View all
          </Link>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 lg:gap-4'>
          {courseAttendance.map((course) => (
            <div
              key={course.id}
              className='group bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 hover:border-gray-300 transition-all'
            >
              {/* Header */}
              <div className='mb-4'>
                <div className='flex items-start justify-between gap-2 mb-2'>
                  <h3 className='font-semibold text-sm text-gray-900 leading-tight'>
                    {course.courseName}
                  </h3>
                  <span
                    className={`text-xs font-medium whitespace-nowrap px-2 py-0.5 rounded border ${getAttendanceColor(
                      course.percentage
                    )}`}
                  >
                    {course.courseCode}
                  </span>
                </div>
                {/* Percentage Badge */}
                <span
                  className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${getAttendanceColor(
                    course.percentage
                  )}`}
                >
                  {course.percentage}%
                </span>
              </div>

              {/* Stats - Inline */}
              <div className='flex items-center gap-4 text-xs mb-4 pb-4 border-b border-gray-100'>
                <div>
                  <span className='text-gray-500'>
                    {course.attended}/{course.total}{' '}
                  </span>
                  <span className='text-gray-500'>sessions</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className='mb-4'>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full ${getProgressBarColor(
                      course.percentage
                    )} transition-all duration-300`}
                    style={{ width: `${course.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
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
            <Link
              to='/student/attendance'
              className='text-sm text-blue-600 hover:underline font-medium'
            >
              View all
            </Link>
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
            <tbody className='bg-white divide-y divide-gray-200 '>
              {recentSessions.map((session) => (
                <tr
                  key={session.id}
                  className='hover:bg-gray-50 transition-colors'
                >
                  <td className='px-4 lg:px-6 py-4 whitespace-nowrap'>
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        {session.courseName}
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
                    {session.status === 'present' ? (
                      <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        <CheckCircle className='w-3 h-3' />
                        Present
                      </span>
                    ) : (
                      <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                        <XCircle className='w-3 h-3' />
                        Absent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
