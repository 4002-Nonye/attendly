import { Download, Printer } from 'lucide-react';
import PropTypes from 'prop-types';

import { handleDownloadQR, handlePrintQR } from '../utils/SessionHelpers';

import Button from './Button';

export default function SessionQRCodeCard({ session }) {
  
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6'>
      <h2 className='text-xl font-bold text-gray-900 mb-4'>Attendance QR Code</h2>

      <div className='bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-100 mb-4'>
        <div className='bg-white p-4 rounded-lg inline-block w-full'>
          <img
            src={session.qrCode}
            alt={`QR code for ${session.course.courseCode}`}
            className='w-full h-auto'
          />
        </div>
      </div>

      <p className='text-sm text-gray-600 text-center mb-6'>
        Students can scan this QR code to mark their attendance
      </p>

      <div className='space-y-3'>
        <Button
          onClick={() => handleDownloadQR(session)}
          variant='primary'
          fullWidth
          size='lg'
          className='gap-2'
        >
          <Download size={20} />
          Download QR Code
        </Button>

        <Button
          onClick={() => handlePrintQR(session)}
          variant='outline'
          fullWidth
          size='lg'
          className='gap-2'
        >
          <Printer size={20} />
          Print QR Code
        </Button>
      </div>

      <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
        <p className='text-xs text-gray-600'>
          <strong className='text-gray-900'>Session ID:</strong>
          <br />
          {session._id}
        </p>
      </div>
    </div>
  );
}

SessionQRCodeCard.propTypes = {
  session: PropTypes.object.isRequired,
};
