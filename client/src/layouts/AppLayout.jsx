import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
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
} from 'lucide-react';

function AppLayout() {
  const user = { role: 'lecturer' };

  // Sidebar options based on user role
  const sidebarOptions =
    user?.role === 'admin'
      ? [
          { name: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
          { name: 'Lecturers', icon: Users2, to: '/lecturers' },
          { name: 'Students', icon: GraduationCap, to: '/students' },
          { name: 'Faculties', icon: Building2, to: '/faculties' },
          { name: 'Departments', icon: Layers, to: '/departments' },
          { name: 'Courses', icon: BookOpen, to: '/courses' },
        ]
      : user?.role === 'lecturer'
      ? [
          { name: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
          { name: 'Courses', icon: BookOpen, to: '/courses' },
          { name: 'Sessions', icon: CalendarClock, to: '/sessions' },
          { name: 'My Attendance', icon: ClipboardList, to: '/attendance' },
          { name: 'Profile', icon: UserCircle, to: '/profile' },
        ]
      : [
          { name: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
          { name: 'Courses', icon: BookOpen, to: '/courses' },
          { name: 'Sessions', icon: CalendarClock, to: '/sessions' },
          { name: 'My Attendance', icon: ClipboardList, to: '/attendance' },
          { name: 'Profile', icon: UserCircle, to: '/profile' },
        ];

  return (
    <div className='flex min-h-screen'>
      <Sidebar options={sidebarOptions} />
      <main className='flex-1 p-6 bg-gray-50 overflow-auto'>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
