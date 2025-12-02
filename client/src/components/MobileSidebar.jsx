import { NavLink } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import PropTypes from 'prop-types';
import Button from '../components/Button';
import { useSchoolInfo } from '../hooks/useSchoolInfo';
import { useLogout } from '../features/auth/hooks/useLogout';
import { sidebarConfig } from '../config/sidebarConfig';
import Modal from './Modal';

export default function MobileSidebar({ isOpen, onClose }) {
  const { user } = useSchoolInfo();
  const { logout } = useLogout();

  const sidebarOptions = sidebarConfig[user?.role] || sidebarConfig.student;

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user?.schoolId?.schoolName || 'Attendly'}
      size='md'
      closeOnOutsideClick={true}
      closeOnEscape={true}
      showCloseButton={true}
    >
      <div className=' py-4 flex flex-col'>

        {/* Nav links */}
        <nav className='flex-1 mb-6'>
          <ul className='space-y-2 px-2'>
            {sidebarOptions.map(({ name, icon: Icon, to }) => (
              <li key={name}>
                <NavLink
                  to={to}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-950 text-white'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`
                  }
                >
                  {Icon && <Icon size={18} />}
                  <span className='text-sm font-medium'>{name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className='mt-auto pt-6 px-2 space-y-2 border-t border-gray-200'>
          {/* Settings */}
          {user?.role === 'admin' && (
            <NavLink
              to='/settings'
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex text-sm items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-950 text-white'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`
              }
            >
              <Settings size={18} />
              <span className='text-sm font-medium'>Settings</span>
            </NavLink>
          )}

          {/* Logout */}
          <Button
            variant='outline'
            icon={LogOut}
            onClick={handleLogout}
            fullWidth
            className='transition-colors justify-start duration-200 text-slate-500 hover:text-red-400 hover:bg-white/5 border-none gap-2 text-sm'
          >
            Logout
          </Button>
        </div>
      </div>
    </Modal>
  );
}

MobileSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
