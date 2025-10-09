import logoBlack from '../assets/logo-black.svg';

function Logo() {
 

  return (
    <div className='text-4xl font-bold flex items-center pt-7 lg:pt-0 lg:hidden md:px-12 justify-center px-3'>
      <img src={logoBlack} alt='logo' className='w-14' />{' '}
      <span>Attendly</span>
    </div>
  );
}

export default Logo;
