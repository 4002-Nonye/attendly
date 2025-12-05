import PropTypes from 'prop-types';

import logo from '../assets/logo.svg';

function AuthOverview({ title, content, subText }) {
  return (
    <div className='hidden w-2/4 min-h-screen  bg-blue-950 text-white lg:flex flex-col p-5 sm:p-8 xl:p-14 justify-between'>
      <div className='text-xl font-bold flex items-center'>
        <img src={logo} alt='logo' /> <span>Attendly</span>
      </div>

      <div className='flex-1 flex items-start mt-72'>
        <div>
          <h1 className='font-medium mb-10 text-3xl lg:text-4xl'>{title}</h1>
          <p className='w-full xl:w-[80%] leading-7'>{content}</p>
          <p className='mt-4'>{subText}</p>
        </div>
      </div>
    </div>
  );
}

AuthOverview.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  subText: PropTypes.string,
};

export default AuthOverview;
