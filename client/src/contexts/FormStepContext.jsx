import PropTypes from 'prop-types';
import { createContext, useCallback, useReducer } from 'react';

const FormStepContext = createContext();
const initialState = {
  step: 1,
  totalSteps: 3,
 
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TOTAL_STEPS':
      return { ...state, totalSteps: action.payload };
    case 'NEXT':
      if (state.step >= state.totalSteps) return state;
      return { ...state, step: state.step + 1 };

    case 'PREV':
      if (state.step <= 1) return state;
      return { ...state, step: state.step - 1 };
    default:
      return state;
  }
}

function FormStepProvider({ children }) {
  const [{ step, totalSteps }, dispatch] = useReducer(reducer, initialState);

 const handleNextStep = useCallback(() => {
  dispatch({ type: 'NEXT' });
}, []);

const handlePrevStep = useCallback(() => {
  dispatch({ type: 'PREV' });
}, []);

const setTotalSteps = useCallback((num) => {
  dispatch({ type: 'SET_TOTAL_STEPS', payload: num });
}, []);

 

  const isFirstStep = step === 1;
  const isLastStep = step === totalSteps;

  return (
    <FormStepContext.Provider
      value={{
        step,
        totalSteps,
        handleNextStep,
        handlePrevStep,
        setTotalSteps,
        isFirstStep,
        isLastStep,

      }}
    >
      {children}
    </FormStepContext.Provider>
  );
}

export { FormStepProvider, FormStepContext };

FormStepProvider.propTypes = {
  children: PropTypes.node,
};
