import {
  Building2,
  Layers,
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  CalendarClock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// ADMIN STATS
export const getAdminStats = (stat = {}) => [
  {
    label: 'Total Faculties',
    value: stat.totalFaculties ?? 0,
    icon: Building2,
    color: 'bg-blue-100 text-blue-600',
    link: '/faculties',
  },
  {
    label: 'Total Departments',
    value: stat.totalDepartments ?? 0,
    icon: Layers,
    color: 'bg-purple-100 text-purple-600',
    link: '/departments',
  },
  {
    label: 'Total Courses',
    value: stat.totalCourses ?? 0,
    icon: BookOpen,
    color: 'bg-green-100 text-green-600',
    link: '/courses',
  },
  {
    label: 'Total Lecturers',
    value: stat.totalLecturers ?? 0,
    icon: Users,
    color: 'bg-orange-100 text-orange-600',
    link: '/lecturers',
  },
  {
    label: 'Total Students',
    value: stat.totalStudents ?? 0,
    icon: GraduationCap,
    color: 'bg-pink-100 text-pink-600',
    link: '/students',
  },
];

// LECTURER STATS
export const getLecturerStats = (stat = {}) => [
  {
    label: 'My Courses',
    value: stat.totalCourses ?? 0,
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    label: 'Total Students',
    value: stat.totalStudents ?? 0,
    icon: Users,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    label: 'Sessions Conducted',
    value: stat.totalSessions ?? 0,
    icon: Calendar,
    color: 'bg-green-100 text-green-600',
  },
  {
    label: 'Active Sessions',
    value: stat.activeSessions ?? 0,
    icon: CalendarClock,
    color: 'bg-orange-100 text-orange-600',
  },
];

// STUDENT STATS

export const getStudentStats = (stat = {}) => [
  {
    label: 'My Courses',
    value: stat.totalCourses ?? 0,
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    label: 'Total Sessions',
    value: stat.totalSessions ?? 0,
    icon: CalendarClock,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    label: 'Attended Sessions',
    value: stat.attendedSessions ?? 0,
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600',
  },
  {
    label: 'Missed Classes',
   alue: Math.max(stat.totalSessions - stat.attendedSessions, 0),
    icon: XCircle,
    color: 'bg-red-100 text-red-600',
  },
];
