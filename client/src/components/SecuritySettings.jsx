import { Key,Lock } from 'lucide-react';
import PropTypes from 'prop-types';

import Button from './Button';

function SecuritySettings({ data, onPasswordChange }) {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
          <Lock className='w-5 h-5 text-purple-600' />
        </div>
        <div>
          <h3 className='text-lg font-bold text-gray-900'>Security Settings</h3>
          <p className='text-sm text-gray-500'>Manage your account security</p>
        </div>
      </div>

      <div className='space-y-4'>
        {/* Password Info */}
        <div className='flex items-start gap-4 p-4 bg-gray-50 rounded-lg'>
          <div className='w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0'>
            <Key className='w-5 h-5 text-gray-600' />
          </div>
          <div className='flex-1'>
            <h4 className='font-semibold text-gray-900 mb-1'>Password</h4>
            <p className='text-sm text-gray-600 mb-3'>
              {data.hasPassword
                ? 'Keep your password secure and change it regularly.'
                : 'No password set. Set a password to secure your account.'}
            </p>
            <Button
              onClick={onPasswordChange}
              size='sm'
              className='gap-2'
              variant='primary'
            >
              <Lock className='w-4 h-4' />
              {data.hasPassword ? 'Change Password' : 'Set Password'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
SecuritySettings.propTypes = {
  data: PropTypes.object,
  onPasswordChange: PropTypes.func,
};

export default SecuritySettings;
