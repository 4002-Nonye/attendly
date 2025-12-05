import { useState } from 'react';
import { UserX } from 'lucide-react';

import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import ProfileAcademicInfo from '../../../components/ProfileAcademicInfo';
import ProfileHeader from '../../../components/ProfileHeader';
import SecuritySettings from '../../../components/SecuritySettings';
import ProfileSkeleton from '../../../components/skeletons/ProfileSkeleton';
import PasswordChangeModal from '../general/PasswordChangeForm';
import { useProfile } from '../general/useProfile';



export default function StudentProfile() {
  const [showModal, setShowModal] = useState(false);
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

  const studentData = {
    ...user,
    department: user.department?.name,
    faculty: user.faculty?.name,
    academicYear: user.schoolId?.currentAcademicYear?.year,
    currentSemester: user.schoolId?.currentSemester,
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
          <ProfileHeader data={studentData} />
        </div>

        <div className='lg:col-span-2 space-y-6'>
          <ProfileAcademicInfo studentData={studentData} />
          <SecuritySettings
            data={studentData}
            onPasswordChange={() => setShowModal(true)}
          />
        </div>
      </div>

      <PasswordChangeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        hasPassword={studentData.hasPassword}
      />
    </div>
  );
}
