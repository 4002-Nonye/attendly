import {
  Building2,
  Users,
  BookOpen,
  GraduationCap,
  Layers,
  Plus,
  Calendar,
} from 'lucide-react';

import Button from '../../../components/Button';

import Card from '../../../components/Card';
import Chart from '../../../components/Chart';

import RecentSessionsTable from '../../../components/RecentSessionsTable';

import SkeletonDashboard from '../../../components/SkeletonDashboard';

import { useSchoolInfo } from '../../../hooks/useSchoolInfo';
import PageHeader from '../../../components/PageHeader';
import { Link } from 'react-router-dom';
import EmptyCard from '../../../components/EmptyCard';
import { useAdminDashboardStats } from './useAdminDashboardStats';

function AdminDashboard() {
  const { data: stat, isStatPending } = useAdminDashboardStats();
  const { semester, academicYear } = useSchoolInfo();

  const {
    totalFaculties,
    totalDepartments,
    totalCourses,
    totalLecturers,
    totalStudents,
  } = stat || {};

  const stats = [
    {
      label: 'Total Faculties',
      value: totalFaculties,
      icon: Building2,
      color: 'bg-blue-100 text-blue-600',
      link: '/faculties',
    },
    {
      label: 'Total Departments',
      value: totalDepartments,
      icon: Layers,
      color: 'bg-purple-100 text-purple-600',
      link: '/departments',
    },
    {
      label: 'Total Courses',
      value: totalCourses,
      icon: BookOpen,
      color: 'bg-green-100 text-green-600',
      link: '/courses',
    },
    {
      label: 'Total Lecturers',
      value: totalLecturers,
      icon: Users,
      color: 'bg-orange-100 text-orange-600',
      link: '/lecturers',
    },
    {
      label: 'Total Students',
      value: totalStudents,
      icon: GraduationCap,
      color: 'bg-pink-100 text-pink-600',
      link: '/students',
    },
  ];
  if (isStatPending) return <SkeletonDashboard />;

  return (
    <div className='w-full'>
      {/* Welcome bar */}

      <PageHeader
        title='Welcome aboard'
        subtitle={`Here's an overview of your school`}
      />

      {!academicYear || !semester ? (
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
          <RecentSessionsTable />

          {/* Quick Actions */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Quick Actions
            </h3>
            <div className='flex flex-wrap gap-3'>
              <Button variant='primary' icon={Plus} size='sm'>
                Add Faculty
              </Button>
              <Button variant='primary' icon={Plus} size='sm'>
                Add Department
              </Button>
              <Button variant='primary' icon={Plus} size='sm'>
                Add Course
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
