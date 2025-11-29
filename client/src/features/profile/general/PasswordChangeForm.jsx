import { Lock, Eye, EyeOff } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import Modal from '../../../components/Modal';
import Box from '../../../components/Box';
import InputField from '../../../components/InputField';
import Err from '../../../components/Err';
import Button from '../../../components/Button';
import { useChangePassword } from './useChangePassword';
import { useSetPassword } from './useSetPassword';
import PropTypes from 'prop-types';

export default function PasswordChangeForm({ isOpen, onClose, hasPassword = true }) {
  const { changePassword, isPending: isChangingPassword } = useChangePassword();
  const { setPassword, isPending: isSettingPassword } = useSetPassword();
  const isSubmitting = isChangingPassword || isSettingPassword;

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [isOpen, reset]);

  const onSubmit = (data) => {
    const { newPassword, currentPassword } = data;

    if (hasPassword) {
      changePassword(
        { newPassword, currentPassword },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        }
      );
    } else {
      setPassword(
        { newPassword },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        }
      );
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={hasPassword ? 'Change Password' : 'Set Password'}
      closeOnOutsideClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Current Password (only if user has password) */}
        {hasPassword && (
          <Box className="mb-4">
            <InputField
              htmlFor="currentPassword"
              label="Current Password"
              icon={Lock}
              type="password"
              placeholder="Enter current password"
              eyesOn={Eye}
              eyesOff={EyeOff}
              disabled={isSubmitting}
              {...register('currentPassword', {
                required: 'Current password is required',
              })}
            />
            <Err msg={errors.currentPassword?.message || ' '} />
          </Box>
        )}

        {/* New Password */}
        <Box className="mb-4">
          <InputField
            htmlFor="newPassword"
            label="New Password"
            icon={Lock}
            type="password"
            placeholder="Enter new password"
            eyesOn={Eye}
            eyesOff={EyeOff}
            disabled={isSubmitting}
            {...register('newPassword', {
              required: "New password can't be empty",
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
          />
          <Err msg={errors.newPassword?.message || ' '} />
        </Box>

        {/* Confirm Password */}
        <Box className="mb-4">
          <InputField
            htmlFor="confirmPassword"
            label="Confirm Password"
            icon={Lock}
            type="password"
            placeholder="Confirm your password"
            eyesOn={Eye}
            eyesOff={EyeOff}
            disabled={isSubmitting}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === getValues().newPassword || 'Passwords do not match',
            })}
          />
          <Err msg={errors.confirmPassword?.message || ' '} />
        </Box>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-2">
          <Button
            type="button"
            className="w-26"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-26"
          >
            {isSubmitting ? <ClipLoader size={16} color="white" /> : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

PasswordChangeForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  hasPassword: PropTypes.bool,
};
