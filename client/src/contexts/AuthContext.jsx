import { createContext, useReducer } from 'react';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isLoading: false,
};

const reducer = (state, action) => {


};

function AuthProvider({ children }) {
  const [dispatch, state] = useReducer(reducer, initialState);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
