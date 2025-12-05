import { Calendar,Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Chart from '../../../components/Chart';
import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import QuickActions from '../../../components/QuickActions';
import RecentSessions from '../../../components/RecentSessions';
import AdminDashboardSkeleton from '../../../components/skeletons/AdminDashboardSkeleton';
import { useSchoolInfo } from '../../../hooks/useSchoolInfo';
import { getAdminStats } from '../../../utils/dashboardStats';

import { useAdminDashboardStats } from './useAdminDashboardStats';

function AdminDashboard() {
  const { data: stat, isPending: isStatPending } = useAdminDashboardStats();

  const stats = getAdminStats(stat);

  const { semester, academicYear } = useSchoolInfo();

  const isAcademicYearIncomplete = !academicYear || !semester;

  const actions = [
    {
      label: 'Add Faculty',
      icon: Plus,
      to: '/faculties?mode=add',
    },
    {
      label: 'Add Department',
      icon: Plus,
      to: '/departments?mode=add',
    },
    {
      label: 'Add Course',
      icon: Plus,
      to: '/courses?mode=add',
    },
  ];

  if (isStatPending) return <AdminDashboardSkeleton />;

  return (
    <div className='w-full'>
      {/* Welcome bar */}

      <PageHeader
        title='Welcome aboard'
        subtitle={`Here's an overview of your school`}
      />

      {isAcademicYearIncomplete ? (
        <EmptyCard
          icon={Calendar}
          iconColor='text-blue-600'
          title='Set Up Academic Year'
          message='Create your first academic year and semester to start
          managing your school efficiently'
          iconBg='bg-blue-100'
        >
          <Link to='/academic-year' className='mt-4'>
            <Button icon={Plus} variant='primary' size='lg'>
              Create Academic Year
            </Button>
          </Link>
        </EmptyCard>
      ) : (
        <>
          {/* Stats Card */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
            {stats.map((stat, index) => (
              <Card key={index} {...stat} isLink={true} />
            ))}
          </div>

          {/* Charts Section */}
          <Chart />

          {/* Recent Sessions Table */}
          <RecentSessions />

          {/* Quick Actions */}
          <QuickActions actions={actions} />
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
