import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';

const dispatch = useDispatch();

const handleLogin = (user: any) => {
  dispatch(loginStart());

  try {
    const fakeToken = btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      exp: Date.now() + 3600000
    }));

    dispatch(loginSuccess({ user, token: fakeToken }));
  } catch {
    dispatch(loginFailure("Erreur login"));
  }
};