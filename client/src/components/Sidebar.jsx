import { NavLink } from 'react-router-dom';
import { Settings } from 'lucide-react';
import PropTypes from 'prop-types';
import logoBlack from '../assets/logo.svg';

function Sidebar({ options }) {
  return (
    <aside className='w-72 min-h-screen bg-blue-950 text-white flex flex-col py-6'>
      {/* Logo */}
      <div className='px-6 mb-10 flex items-center'>
        <img src={logoBlack} alt='logo' />{' '}
        <h1 className='text-xl font-semibold tracking-tight'> Attendly</h1>
      </div>

      {/* Nav links */}
      <nav className='flex-1'>
        <ul className='space-y-5 px-4'>
          {options.map(({ name, icon: Icon, to }) => (
            <li key={name}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
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

      {/* Footer / Settings */}
      <div className='mt-auto px-2'>
        <NavLink
          to='/settings'
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`
          }
        >
          <Settings size={18} />
          <span className='text-sm font-medium'>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      to: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Sidebar;
