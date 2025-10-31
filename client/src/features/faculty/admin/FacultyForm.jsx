import { useForm } from 'react-hook-form';
import Modal from '../../../components/Modal';
import InputField from '../../../components/InputField';
import Err from '../../../components/Err';
import Button from '../../../components/Button';
import { useCreateFaculty } from './useCreateFaculty';
import PropTypes from 'prop-types';
import { useEditFaculty } from './useEditFaculty';

import { ClipLoader } from 'react-spinners';

function FacultyForm({ isOpen, onClose, initialData }) {
  const { _id: editId, name } = initialData || {};
  const { createFaculty, isPending: isCreating } = useCreateFaculty();
  const { editFaculty, isPending: isEditing } = useEditFaculty();

  const isEditSession = Boolean(editId);
  const isSubmitting = isCreating || isEditing;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: isEditSession ? { facultyName: name } : {},
  });

  const onSubmit = (data) => {


    if (!isEditSession) {
      createFaculty(data, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
      return;
    }

    editFaculty(
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
      title={isEditSession ? 'Edit Faculty' : 'Add New Faculty'}
      closeOnOutsideClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label='Faculty'
          type='text'
          htmlFor='faculty'
          placeholder='e.g. Science'
          {...register('facultyName', {
            required: 'Faculty name is required',
            minLength: {
              value: 2,
              message: 'Faculty name must be at least 2 characters',
            },
          })}
        />
        <Err className='mt-2 mb-4' msg={errors.facultyName?.message || ' '} />

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
    </Modal>
  );
}

FacultyForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default FacultyForm;
