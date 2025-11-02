import { useForm } from 'react-hook-form';

import Modal from '../../../components/Modal';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';
import Button from '../../../components/Button';
import Err from '../../../components/Err';
import InputField from '../../../components/InputField';
import Select from '../../../components/Select';
import Box from '../../../components/Box';
import { useSchoolInfo } from '../../../hooks/useSchoolInfo';
import { useAllFaculties } from '../../faculty/admin/useAllFaculties';
import { useCreateDepartment } from './useCreateDepartment';
import { useEditDepartment } from './useEditDepartment';

function DepartmentForm({ isOpen, onClose, initialData }) {
  const { _id: editId, name, maxLevel, faculty } = initialData || {};

  const { schoolId: id } = useSchoolInfo();
  const { data, isPending: isLoadingFaculties } = useAllFaculties({ id });
  const { createDepartment, isPending: isCreating } = useCreateDepartment();
  const { editDepartment, isPending: isEditing } = useEditDepartment();

  const isSubmitting = isCreating || isEditing;
  const isEditSession = Boolean(editId);

  const {
    reset,
    register,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm({
    defaultValues: isEditSession
      ? { name, faculty: faculty._id, maxLevel }
      : {},
  });

  const onSubmit = (data) => {
  
    if (!isEditSession) {
      createDepartment(data, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
      return;
    }

    editDepartment(
      { id: editId, ...data },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={isEditSession ? 'Edit Department' : 'Add New Department'}
      closeOnOutsideClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
      size='lg'
    >
      {isEditSession && isLoadingFaculties ? (
        <div className='flex justify-center items-center py-8 h-96'>
          <ClipLoader size={32} color='#1e1b4b' />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <InputField
              label='Department'
              type='text'
              htmlFor='department'
              placeholder='e.g. Political science'
              {...register('name', {
                required: 'Department name is required',
                minLength: {
                  value: 2,
                  message: 'Department name must be at least 2 characters',
                },
              })}
            />
            <Err
              className={errors.name?.message && 'mb-3'}
              msg={errors.name?.message || ' '}
            />
          </Box>

          <Box>
            <Select
              htmlFor='faculty'
              label='Faculty'
              labelKey='name'
             
              placeHolder='-- Select Faculty --'
              data={data?.faculties || []}
              disabled={isLoadingFaculties ||isEditSession}
              {...register('faculty', {
                required: 'Please select your faculty',
              })}
            />
            <Err
              className={errors.faculty?.message && 'mb-3'}
              msg={errors.faculty?.message || ' '}
            />
          </Box>

          <Box>
           
            <InputField
              label='Max Level'
              type='text'
              htmlFor='maxLevel'
              placeholder='e.g. 500'
              {...register('maxLevel', {
                required: 'Max level is required',
                validate: {
                  isNumber: (value) =>
                    /^[1-9][0-9]*$/.test(value) ||
                    'Max level must be a valid number',
                  maxValue: (value) =>
                    parseInt(value) <= 700 || 'Max level cannot exceed 700',
                  minValue: (value) =>
                    parseInt(value) >= 100 || 'Max level must be at least 100',
                },
              })}
            />
            <Err
              className={errors.maxLevel?.message && 'mb-3'}
              msg={errors.maxLevel?.message || ' '}
            />
          </Box>

          <div className='flex gap-3 justify-end pt-2'>
            <Button
              type='button'
              className='w-26'
              variant='secondary'
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='primary'
              disabled={isSubmitting || (isEditSession && !isDirty)}
              className='w-26'
            >
              {isSubmitting ? <ClipLoader size={16} color='white' /> : 'Save'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

DepartmentForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default DepartmentForm;
