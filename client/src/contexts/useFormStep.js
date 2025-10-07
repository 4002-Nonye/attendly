import { useContext } from 'react';
import { FormStepContext } from './FormStepContext';

 const useFormStep = () => {
  const context = useContext(FormStepContext);
  if (context === undefined)
    throw new Error('useFormStep must be used within a FormStepProvider');
  return context;
};

export  {useFormStep}