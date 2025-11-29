
import { Mail, CreditCard, User } from 'lucide-react';
import PropTypes from 'prop-types';
import Avatar from './Avatar';

function ProfileHeader({ studentData, isLecturer = false }) {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
      <div className='flex flex-col items-center text-center'>
        {/* Profile Photo */}
        <Avatar fullName={studentData.fullName} className='w-32 h-32 mb-4' />

        {/* Name */}
        <h2 className='text-2xl font-bold text-gray-900 mb-1'>
          {studentData.fullName}
        </h2>

        {/* Matric/Staff Number */}
        <div className='flex items-center gap-2 text-gray-600 mb-2'>
          {isLecturer ? (
            <User className='w-4 h-4' />
          ) : (
            <CreditCard className='w-4 h-4' />
          )}
          <span className='font-mono text-sm'>
            {isLecturer ? studentData.staffId : studentData.matricNo}
          </span>
        </div>
        {isLecturer && (
          <p className='text-xs text-gray-500 mb-2'>Staff ID</p>
        )}

        {/* Email */}
        <div className='flex items-center gap-2 text-gray-600 mb-4'>
          <Mail className='w-4 h-4' />
          <span className='text-sm'>{studentData.email}</span>
        </div>

        {/* Divider */}
        <div className='w-full border-t border-gray-100 my-4'></div>

        {/* Additional Info */}
        <div className='w-full space-y-3 text-left'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-500'>Status</span>
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
  studentData: PropTypes.object.isRequired,
  isLecturer: PropTypes.bool,
};

export default ProfileHeader;