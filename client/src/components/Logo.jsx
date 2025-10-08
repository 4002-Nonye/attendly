import logoBlack from '../assets/logo-black.svg';

function Logo() {
 

  return (
    <div className='md:text-4xl text-xl font-bold flex items-center pt-7 lg:pt-0 lg:hidden md:px-12 md:justify-center'>
      <img src={logoBlack} alt='logo' className='md:w-16' />{' '}
      <span>Attendly</span>
    </div>
  );
}

export default Logo;
