import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import Image from 'next/image';
import React, {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import firebase_app from '../firebase/config';

const auth = getAuth(firebase_app);
type AuthContextType = { user?: User | null; loading?: boolean };
export const AuthContext = React.createContext<AuthContextType>({});

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (app_user) => {
      if (app_user) {
        setUser(app_user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <div
          style={{
            margin: '0',
            position: 'absolute',
            top: '50%',
            left: '50%',
            msTransform: 'translate(-50%, -50%)',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Image src={'/loading.gif'} alt="loading"></Image>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
export const useAuthContext = () => useContext(AuthContext);
