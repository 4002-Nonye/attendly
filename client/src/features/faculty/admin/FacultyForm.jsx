import { useForm } from 'react-hook-form';
import Modal from '../../../components/Modal';
import InputField from '../../../components/InputField';
import Err from '../../../components/Err';
import Button from '../../../components/Button';
import { useCreateFaculty } from './useCreateFaculty';
import PropTypes from 'prop-types';
import { useEditFaculty } from './useEditFaculty';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

function FacultyForm({ onClose, initialData }) {
  const { _id: editId, name } = initialData || {};
  const { createNewFaculty, isPending: isCreating } = useCreateFaculty();
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
    if (isEditSession && !isDirty) {
      toast.error('No changes were made');
      return;
    }

    if (!isEditSession) {
      createNewFaculty(data, {
        onSuccess: () => onClose(),
      });
      return;
    }

    editFaculty(
      { id: editId, ...data },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <Modal
      onClose={onClose}
      title={isEditSession ? 'Edit Faculty' : 'Add New Faculty'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label='Faculty Name'
          type='text'
          htmlFor='faculty'
          placeholder='e.g. Science'
          {...register('facultyName', {
            required: 'Faculty name is required',
          })}
        />
        <Err msg={errors.facultyName?.message || ' '} />

        <div className='flex gap-3 justify-end pt-2'>
          <Button
            type='button'
            className='w-36'
            variant='secondary'
            onClick={() => {
              onClose();
              reset();
            }}
            disabled={isSubmitting}
            
          >
            Cancel
          </Button>
          <Button type='submit' variant='primary' disabled={isSubmitting} className='w-36' >
            {isSubmitting ? (
              <ClipLoader size={16} color='white'  />
            ) : isEditSession ? (
              'Save Changes'
            ) : (
              'Add Faculty'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

FacultyForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default FacultyForm;
