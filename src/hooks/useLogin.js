import { useState, useEffect } from 'react';
import { useAuthContext } from './useAuthContext';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, 'users', res.user.uid);

      await updateDoc(userRef, {
        online: true,
      });

      dispatch({ type: 'LOGIN', payload: res.user });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  const guestLogin = async () => {
    setError(null);
    setIsPending(true);

    try {
      const res = await signInWithEmailAndPassword(
        auth,
        process.env.REACT_APP_TEST_USER_NAME,
        process.env.REACT_APP_TEST_USER_PASSWORD
      );
      const userRef = doc(db, 'users', res.user.uid);

      await updateDoc(userRef, {
        online: true,
      });

      dispatch({ type: 'LOGIN', payload: res.user });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { guestLogin, login, isPending, error };
};
