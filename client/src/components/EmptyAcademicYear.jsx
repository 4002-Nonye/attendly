import { Calendar, Plus } from "lucide-react";
import Button from "./Button";
import { Link } from "react-router-dom";

function EmptyAcademicYear() {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-12'>
      <div className='max-w-md mx-auto text-center flex flex-col justify-center items-center '>
        <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <Calendar className='w-8 h-8 text-blue-600' />
        </div>
        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
          Set Up Academic Year
        </h3>
        <p className='text-gray-600 mb-6'>
          Create your first academic year and semester to start managing your
          school efficiently
        </p>
        <Link to='/academic-year' className='mt-4'>
          <Button icon={Plus} variant='primary' size='lg'>
            Create Academic Year
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default EmptyAcademicYear;


