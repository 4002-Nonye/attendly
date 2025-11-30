import { useState } from 'react';

import PageHeader from '../../components/PageHeader';
import ProfileHeader from '../../components/ProfileHeader';
import AttendanceThresholdSettings from '../profile/general/AttendanceThresholdSettings';
import SecuritySettings from '../../components/SecuritySettings';
import PasswordChangeForm from '../profile/general/PasswordChangeForm';
import AcademicYearManager from './AcademicYearManager';
import AcademicYearForm from './AcademicYearForm';
import { useProfile } from '../profile/general/useProfile';
import ProfileSkeleton from '../../components/ProfileSkeleton';
import { UserX } from 'lucide-react';

function AdminSettings() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCreateYearModal, setShowCreateYearModal] = useState(false);
  const { data, isPending, error } = useProfile();
  

  
  if (isPending) {
    return <ProfileSkeleton />;
  }

  if (error || !data?.user) {
    return (
      <div className='w-full'>
        <PageHeader
          showGreeting={false}
          title='Settings'
          subtitle='Manage your profile and school settings'
        />
        <EmptyCard
          title='Settings Not Found'
          message='Unable to load Settings. Please try refreshing the page.'
          icon={UserX}
          iconColor='text-red-600'
          iconBg='bg-red-50'
        />
      </div>
    );
  }

  const user = data.user;
  const schoolAttendanceThreshold = user.schoolId?.attendanceThreshold;

  const adminData = {
    ...user,
    staffId: user._id.slice(-6),
    department: user.department?.name,
    faculty: user.faculty?.name,
    academicYear: user.schoolId?.currentAcademicYear?.year,
    currentSemester: user.schoolId?.currentSemester,
    schoolAttendanceThreshold,
    attendanceThreshold: user?.attendanceThreshold ?? schoolAttendanceThreshold,
  };

  return (
    <div className='w-full'>
      {/* Header */}
      <PageHeader
        showGreeting={false}
        title='Settings'
        subtitle='Manage your profile and school settings'
      />

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        {/* Left Column - Profile Card */}
        <div className='lg:col-span-1'>
          <ProfileHeader data={adminData} isAdmin={true} />
        </div>

        {/* Right Column - Settings Cards */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Academic Year Management */}
          <AcademicYearManager
            currentYear={adminData.academicYear}
            currentSemester={adminData.currentSemester}
            onCreateNewYear={() => setShowCreateYearModal(true)}
          />

          {/* Attendance Threshold Settings */}

          <AttendanceThresholdSettings
            isAdmin
            data={adminData}
            schoolThreshold={schoolAttendanceThreshold}
          />
          {/* Security Settings */}
          <SecuritySettings
            data={adminData}
            onPasswordChange={() => setShowPasswordModal(true)}
          />
        </div>
      </div>

      <PasswordChangeForm
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        hasPassword={adminData.hasPassword}
      />
      <AcademicYearForm
        isOpen={showCreateYearModal}
        onClose={() => setShowCreateYearModal(false)}
      />
    </div>
  );
}

export default AdminSettings;
