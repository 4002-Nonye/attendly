import { useUser } from '../features/auth/hooks/useUser';
import { Menu } from 'lucide-react';
import { useState } from 'react';

function Header() {
  const { data } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const firstCharacter = data?.user?.fullName?.split(' ')[0]?.[0] || '';
  const secondCharacter = data?.user?.fullName?.split(' ')[1]?.[0] || '';

  return (
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
            {data?.user?.schoolId?.schoolName || 'School Name'}
          </p>
        </div>

        {/* Right: User info */}
        <div className='flex items-center gap-3 md:gap-5 flex-shrink-0'>
          {/* Avatar initials */}
          <div className='bg-amber-400 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center uppercase text-white font-bold tracking-wide rounded-full text-sm md:text-base'>
            {firstCharacter}
            {secondCharacter}
          </div>

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
  );
}

export default Header;