import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updatePassword,
  User,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';

import firebase_app from './config';

const auth = getAuth(firebase_app);
export const authUtils = {
  login: async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  },
  logout: async () => {
    await auth.signOut();
  },
  changeUsPass: async (ActUs: User, newPass: string) => {
    await updatePassword(ActUs, newPass);
  },
  channgeUsEmail: async (newEmail: string) => {
    if (auth.currentUser) {
      await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
    }
  },
  register: async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  },
  fotgotenPass: async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  },
  confrimPassReset: async (email: string, newPass: string) => {
    await confirmPasswordReset(auth, email, newPass);
  },
  getCurrentUser: () => auth.currentUser,
};
