import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useUser } from '../features/auth/hooks/useUser';

import Avatar from './Avatar';
import MobileSidebar from './MobileSidebar';
import Sidebar from './Sidebar';

function Header() {
  const { data } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fullName = data?.user?.fullName;

  return (
    <>
      {' '}
      <header className='border-b border-gray-200 py-4 md:py-5 px-4 md:px-8 w-full bg-white'>
        <div className='flex justify-between items-center'>
          {/* Left: School name */}
          <div className='flex items-center gap-3 flex-1 min-w-0'>
            {/* Mobile menu button */}
            <button
              className='lg:hidden p-2 hover:bg-gray-100 rounded-lg'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className='w-5 h-5 text-gray-700' />
            </button>

            <p className='text-lg md:text-2xl uppercase font-bold text-blue-900 tracking-wide truncate'>
              <span className='hidden lg:block'>
                {data?.user?.schoolId?.schoolName}
              </span>
              <Link to='/dashboard' className='lg:hidden'>attendly</Link>
            </p>
          </div>

          {/* Right: User info */}
          <div className='flex items-center gap-3'>
            {/* Avatar */}
            <Avatar fullName={fullName} />

            {/* Name and role - Hidden on mobile */}
            <div className='hidden sm:block'>
              <p className='font-medium capitalize text-sm md:text-base'>
                {data?.user?.fullName}
              </p>
              <p className='text-xs md:text-sm text-gray-500 capitalize'>
                {data?.user?.role}
              </p>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile Sidebar Modal */}
      <div className='lg:hidden'>
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      </div>

    </>
  );
}

export default Header;
