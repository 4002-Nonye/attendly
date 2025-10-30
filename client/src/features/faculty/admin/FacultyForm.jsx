import { useForm } from 'react-hook-form';
import Modal from '../../../components/Modal';
import InputField from '../../../components/InputField';
import Err from '../../../components/Err';
import Button from '../../../components/Button';
import { useCreateFaculty } from './useCreateFaculty';
import PropTypes from 'prop-types';
import { useEditFaculty } from './useEditFaculty';

function FacultyForm({ onClose, initialData, isSubmitting }) {
  const { _id: editId, name } = initialData || {};
  const { createNewFaculty } = useCreateFaculty();
  const { editFaculty } = useEditFaculty();

  const isEditSession = Boolean(editId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: isEditSession ? { facultyName: name } : {},
  });

  const onSubmit = (data) => {
    if (isEditSession) return;
    createNewFaculty(data, {
      onSuccess: () => onClose(),
    });
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
            variant='secondary'
            onClick={() => {
              onClose();
              reset();
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type='submit' variant='primary' disabled={isSubmitting}>
            {isSubmitting
              ? isEditSession
                ? 'Saving...'
                : 'Adding...'
              : isEditSession
              ? 'Save Changes'
              : 'Add Faculty'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

FacultyForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  isSubmitting: PropTypes.bool,
};

export default FacultyForm;
