import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useUser } from '../features/auth/hooks/useUser';
import { sidebarConfig } from '../config/sidebarConfig';
import SkeletonSidebar from '../components/SkeletonSidebar';
import Header from '../components/Header';

function AppLayout() {
  const { data, isPending } = useUser();
  
  if (isPending) return <SkeletonSidebar />;

  const { role } = data?.user || {};
  const sidebarOptions = sidebarConfig[role] || sidebarConfig.student;

  return (
    <div className='flex h-screen overflow-hidden bg-gray-50 '>
      {/* Sidebar - Fixed */}
      <Sidebar options={sidebarOptions} />
      
      {/* Main Content Area - Scrollable */}
      <main className='flex-1 flex flex-col overflow-hidden '>
        {/* Header - Fixed at top */}
        <Header />
        
        {/* Content - Scrollable */}
        <div className='flex-1 overflow-y-auto py-5 px-8'>
          <div >
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AppLayout;