import { Outlet } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useUser } from '../features/auth/hooks/useUser';
import { sidebarConfig } from '../config/sidebarConfig';
import Header from '../components/Header';

function AppLayout() {
  const { data } = useUser();

  const {
    role,
    schoolId: { currentAcademicYear, currentSemester } = {},
  } = data?.user || {};

  const sidebarOptions = sidebarConfig[role] || sidebarConfig.student;
  
  const showWarning = !currentAcademicYear || !currentSemester;

  return (
    <div className='flex h-screen overflow-hidden bg-gray-50'>
      {/* Sidebar */}
      <Sidebar options={sidebarOptions} />

      {/* Main Content - Scrollable */}
      <main className='flex-1 flex flex-col overflow-hidden'>
        <Header />
        
        {/* Academic Year Warning Banner */}
        {showWarning && (
          <div className='bg-yellow-50 border-b border-yellow-200 px-8 py-3'>
            <div className='flex items-center gap-3'>
              <AlertCircle className='text-yellow-600 flex-shrink-0' size={20} />
              <div className='flex-1'>
                <p className='text-sm text-yellow-800 font-medium'>
                 School Academic Setup Required
                </p>
                <p className='text-xs text-yellow-700 mt-0.5'>
                  You haven't set the academic year and semester for your school yet. 
                  Some features have been temporarily disabled.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content - Scrollable */}
        <div className='flex-1 overflow-y-auto py-5 px-8'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;