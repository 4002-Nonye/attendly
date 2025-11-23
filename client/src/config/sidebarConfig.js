import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  BookOpen,
  CalendarClock,
  Users2,
  ClipboardList,
  Layers,
  UserCircle,
  CalendarDays,
} from 'lucide-react';

export const sidebarConfig = {
  admin: [
    { name: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
    { name: 'Faculties', icon: Building2, to: '/faculties' },
    { name: 'Departments', icon: Layers, to: '/departments' },
    { name: 'Courses', icon: BookOpen, to: '/courses' },
    { name: 'Lecturers', icon: Users2, to: '/lecturers' },
    { name: 'Students', icon: GraduationCap, to: '/students' },
    { name: 'Attendance', icon: ClipboardList, to: '/attendance' },
   // { name: 'Academic year', icon: CalendarDays, to: '/academic-year' }, // TODO : PUT IN SETTINGS
  ],
  lecturer: [
    { name: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
    { name: 'Courses', icon: BookOpen, to: '/courses' },
    { name: 'Sessions', icon: CalendarClock, to: '/sessions' },
    { name: 'Attendance', icon: ClipboardList, to: '/attendance' },
    { name: 'Profile', icon: UserCircle, to: '/profile' },
  ],
  student: [
    { name: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
    { name: 'Courses', icon: BookOpen, to: '/courses' },
    { name: 'Sessions', icon: CalendarClock, to: '/sessions' },
    { name: 'My Attendance', icon: ClipboardList, to: '/attendance' },
    { name: 'Profile', icon: UserCircle, to: '/profile' },
  ],
};
