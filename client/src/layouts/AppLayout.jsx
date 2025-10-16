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
import { useUser } from '../features/auth/hooks/useUser';
import { sidebarConfig } from '../config/sidebarConfig';
import SkeletonSidebar from '../components/SkeletonSidebar';

function AppLayout() {
  const { data, isPending } = useUser();
  if (isPending) return <SkeletonSidebar/>
  const { role } = data.user;
  const sidebarOptions = sidebarConfig[role] || sidebarConfig.student;

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
