import { Outlet } from 'react-router-dom';

import AcademicSetupAlert from '../components/AcademicSetupAlert';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useUser } from '../features/auth/hooks/useUser';

function AppLayout() {
  const { data } = useUser();

  const { role, schoolId: { currentAcademicYear, currentSemester } = {} } =
    data?.user || {};


  const showWarning = !currentAcademicYear || !currentSemester;

  return (
    <div className='flex h-screen overflow-hidden bg-gray-50'>
      {/* Sidebar */}
      <Sidebar  />

      {/* Main Content - Scrollable */}
      <main className='flex-1 flex flex-col overflow-hidden'>
        <Header />

        {/* Academic Year Warning Banner */}

        {showWarning && <AcademicSetupAlert role={role} />}

        {/* Content - Scrollable */}
        <div className='flex-1 overflow-y-auto py-5 px-8'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
