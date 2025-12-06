import { Building2, CreditCard, GraduationCap,Mail, Shield, User } from 'lucide-react';
import PropTypes from 'prop-types';

import Avatar from './Avatar';

function ProfileHeader({ data, isLecturer = false, isAdmin = false }) {
  // Determine role display
  const getRoleInfo = () => {
    if (isAdmin) {
      return { label: 'Administrator', color: 'purple', icon: Shield };
    }
    if (isLecturer) {
      return { label: 'Lecturer', color: 'blue', icon: GraduationCap };
    }
    return { label: 'Student', color: 'green', icon: User };
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
      <div className='flex flex-col items-center text-center'>
        {/* Profile Photo */}
        <Avatar fullName={data.fullName} className='w-32 h-32 mb-4' />

        {/* Name */}
        <h2 className='text-2xl font-bold text-gray-900 mb-1 capitalize'>
          {data.fullName}
        </h2>

        {/* Role Badge */}
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${roleInfo.color}-100 text-${roleInfo.color}-800 mb-3`}>
          <RoleIcon className='w-3 h-3 mr-1' />
          {roleInfo.label}
        </span>

        {/* Matric/Staff Number */}
        {!isAdmin && (
          <>
            <div className='flex items-center gap-2 text-gray-600 mb-1'>
              {isLecturer ? (
                <User className='w-4 h-4' />
              ) : (
                <CreditCard className='w-4 h-4' />
              )}
              <span className='font-mono text-sm'>
                {isLecturer ? data.staffId : data.matricNo}
              </span>
            </div>
            <p className='text-xs text-gray-500 mb-3'>
              {isLecturer ? 'Staff ID' : 'Matric Number'}
            </p>
          </>
        )}

        {/* Email */}
        <div className='flex items-center gap-2 text-gray-600 mb-4'>
          <Mail className='w-4 h-4' />
          <span className='text-sm'>{data.email}</span>
        </div>

        {/* Divider */}
        <div className='w-full border-t border-gray-100 my-4'></div>

        {/* School Info - Admin Only */}
        {isAdmin && data.schoolId?.schoolName && (
          <div className='w-full mb-4'>
            <div className='flex items-start gap-3 bg-gray-50 rounded-lg p-3'>
              <Building2 className='w-4 h-4 text-gray-500 mt-0.5' />
              <div className='flex-1 text-left'>
                <p className='text-xs text-gray-500 uppercase tracking-wide'>
                  School
                </p>
                <p className='text-sm font-semibold text-gray-900 capitalize mt-1'>
                  {data.schoolId.schoolName}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className='w-full'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-500'>Account Status</span>
            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

ProfileHeader.propTypes = {
  data: PropTypes.object.isRequired,
  isLecturer: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

export default ProfileHeader;