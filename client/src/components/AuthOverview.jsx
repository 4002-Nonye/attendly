import logo from '../assets/logo.svg';

function AuthOverview() {
  return (
    <div className='hidden w-2/4 bg-blue-950 text-white lg:flex flex-col p-5 lg:p-14'>
      <div className='text-xl font-bold flex items-center'>
        {' '}
        <img src={logo} alt='logo' /> <span>Attendly</span>
      </div>

      <div className='m-auto'>
        <h1 className='font-medium mb-10 text-3xl lg:text-4xl'>
          Join Attendly Today!
        </h1>
        <p className='w-[100%] lg:w-[80%] leading-7'>
          The smart and simple way to track attendance. Start sessions, let
          participants mark their presence with a quick QR scan, and easily
          generate reports at the end. <br />
          Attendance has never been this effortless and convenient.
        </p>
      </div>
    </div>
  );
}

export default AuthOverview;