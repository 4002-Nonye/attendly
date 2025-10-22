import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useUser } from '../features/auth/hooks/useUser';
import { sidebarConfig } from '../config/sidebarConfig';

import Header from '../components/Header';


function AppLayout() {
  const { data } = useUser();



  const { role } = data?.user || {};
  const sidebarOptions = sidebarConfig[role] || sidebarConfig.student;

  return (
    <div className='flex h-screen overflow-hidden bg-gray-50 '>
      {/* Sidebar  */}
      <Sidebar options={sidebarOptions} />

      {/* Main Content  - Scrollable */}
      <main className='flex-1 flex flex-col overflow-hidden '>
        <Header />
        {/* Content - Scrollable */}
        <div className='flex-1 overflow-y-auto py-5 px-8'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
