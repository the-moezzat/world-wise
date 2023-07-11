import { createContext, useContext, useReducer } from 'react';

const FAKE_USER = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

type User = typeof FAKE_USER;

interface InitialState {
  user: null | User;
  isAuthenticate: boolean;
}

interface IFakeAuth extends InitialState {
  login: (email: string, password: string) => void;
  logout: () => void;
}

const FakeAuth = createContext<IFakeAuth>({
  login: () => null,
  logout: () => null,
  user: null,
  isAuthenticate: false,
});

enum AuthActions {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

interface IAction {
  type: AuthActions;
  payload?: null | User;
}

const initialState: InitialState = {
  user: null,
  isAuthenticate: false,
};

function reducer(state: InitialState, action: IAction): InitialState {
  switch (action.type) {
    case AuthActions.LOGIN:
      return { ...state, user: action.payload as User, isAuthenticate: true };
    case AuthActions.LOGOUT:
      return { ...state, user: null, isAuthenticate: false };
    default:
      throw new Error('Type correct action type');
  }
}

function FakeAuthProvider({ children }: { children: React.ReactNode }) {
  const [{ user, isAuthenticate }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email: string, password: string) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: AuthActions.LOGIN, payload: FAKE_USER });
  }

  function logout() {
    dispatch({ type: AuthActions.LOGOUT });
  }
  return (
    <FakeAuth.Provider value={{ user, isAuthenticate, login, logout }}>
      {children}
    </FakeAuth.Provider>
  );
}

function useFakeAuth() {
  const context = useContext(FakeAuth);
  if (context === undefined)
    throw new Error('FakeAuth was used outside the FakeAuthProvider');
  return context;
}

export { FakeAuthProvider, useFakeAuth, FakeAuth };
