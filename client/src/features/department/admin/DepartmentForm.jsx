import { useForm } from 'react-hook-form';
import Modal from '../../../components/Modal';

function DepartmentForm({ isOpen, onClose, isSubmitting }) {
  const {  reset } = useForm();

  const isEditSession = true;

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
    >
      DepartmentForm
    </Modal>
  );
}

export default DepartmentForm;
