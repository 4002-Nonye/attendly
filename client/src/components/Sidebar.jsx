import { NavLink } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import PropTypes from 'prop-types';
import logo from '../assets/logo-black.svg';
import Button from '../components/Button';
function Sidebar({ options }) {
  return (
    <aside className='w-72 min-h-screen py-5 lg:flex flex-col  border-r border-gray-200 hidden'>
      {/* Logo */}
      <div className='h-16 flex items-center px-4  '>
        <img src={logo} alt='logo' className='h-10 w-auto' />
        <h1 className='text-xl font-semibold tracking-tight '>Attendly</h1>
      </div>

      {/* Nav links */}
      <nav className='flex-1 mt-5'>
        <ul className='space-y-3.5 px-4'>
          {options.map(({ name, icon: Icon, to }) => (
            <li key={name}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
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
      <div className='mt-auto px-2 space-y-1 '>
        {/* Settings */}
        <NavLink
          to='/settings'
          className={({ isActive }) =>
            `flex text-sm items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
             isActive
                      ? 'bg-blue-950 text-white'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`
          }
        >
          <Settings size={18} />
          <span className='text-sm font-medium'>Settings</span>
        </NavLink>

        {/* Logout */}
        <Button
          variant='outline'
          icon={LogOut}
          fullWidth
          className='transition-colors justify-start duration-200 text-slate-500 hover:text-red-400 hover:bg-white/5 border-none text-sm '
        >
          Logout
        </Button>
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
