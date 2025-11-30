import PageHeader from '../../../components/PageHeader';
import ProfileHeader from '../../../components/ProfileHeader';
import SecuritySettings from '../../../components/SecuritySettings';
import ProfileAcademicInfo from '../../../components/ProfileAcademicInfo';

import { useState } from 'react';
import PasswordChangeForm from '../general/PasswordChangeForm';
import { useProfile } from '../general/useProfile';
import EmptyCard from '../../../components/EmptyCard';
import { UserX } from 'lucide-react';
import ProfileSkeleton from '../../../components/ProfileSkeleton';
import AttendanceThresholdSettings from '../general/AttendanceThresholdSettings';

export default function LecturerProfile() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { data, isPending, error } = useProfile();

  if (isPending) {
    return <ProfileSkeleton />;
  }

  if (error || !data?.user) {
    return (
      <div className='w-full'>
        <PageHeader
          showGreeting={false}
          title='My Profile'
          subtitle='View and manage your profile information'
        />
        <EmptyCard
          title='Profile Not Found'
          message='Unable to load your profile information. Please try refreshing the page.'
          icon={UserX}
          iconColor='text-red-600'
          iconBg='bg-red-50'
        />
      </div>
    );
  }

  const user = data.user;
  const schoolAttendanceThreshold = user.schoolId?.attendanceThreshold;

  const lecturerData = {
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
      <PageHeader
        showGreeting={false}
        title='My Profile'
        subtitle='View and manage your profile information'
      />

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        <div className='lg:col-span-1'>
          <ProfileHeader data={lecturerData} isLecturer={true} />
        </div>

        <div className='lg:col-span-2 space-y-6'>
          <ProfileAcademicInfo studentData={lecturerData} isLecturer={true} />
          <AttendanceThresholdSettings
            data={lecturerData}
            schoolThreshold={schoolAttendanceThreshold}
          />
          <SecuritySettings
            data={lecturerData}
            onPasswordChange={() => setShowPasswordModal(true)}
          />
        </div>
      </div>

      <PasswordChangeForm
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        hasPassword={lecturerData.hasPassword}
      />
    </div>
  );
}
