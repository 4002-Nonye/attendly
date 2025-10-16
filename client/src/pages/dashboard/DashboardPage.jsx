import { Outlet } from 'react-router-dom';
import AdminDashboard from '../../features/dashboard/AdminDashboard';
function DashboardPage() {
  return (
    <div className='flex'>
      <AdminDashboard />

    </div>
  );
}

export default DashboardPage;
