/* eslint-disable unicorn/better-regex */
/* eslint-disable sonarjs/prefer-single-boolean-return */
// eslint-disable-next-line unicorn/filename-case

'use client';

import { getAuth } from 'firebase/auth';
import { FirebaseError } from 'firebase-admin';
import { useRouter } from 'next/router';
import React, { FormEvent } from 'react';

import { authUtils } from '@/firebase/auth-utils';

import styles from '../../../styles/stylesForm/style.module.css';

export const PageFormChangePass = () => {
  const [newPassword, setNewPassword] = React.useState('');
  const [ConfirmPass, setConfirmNewPassword] = React.useState('');
  // const { user, loading } = useAuthContext();
  // const ValidPass = (pass: string) => {
  //   // eslint-disable-next-line unicorn/better-regex
  //   // const option = /[A-Z -@*#a-z0-9-]{6,}/;
  //   // if (!option.test(pass)) {
  //   //   return false;
  //   // }
  //   // return true;
  //   const match = pass.match(/[A-Z-#|@|-a-z0-9-]{6,}/);

  //   if (match) {
  //     return true; // Output: 1#2-@9
  //   }
  //   return false;
  // };
  const auth = getAuth();
  const router = useRouter();
  // eslint-disable-next-line consistent-return
  const handleForm = async (event: FormEvent) => {
    try {
      if (!auth.currentUser) {
        throw new Error('Not logged!');
      }

      // const valid = ValidPass(newPassword);
      // alert(valid);
      // validace hesla, minimalni pozadavky
      if (ConfirmPass !== newPassword) {
        throw new Error('Passwords are not same!');
      }

      // if (valid) {
      //   event.preventDefault();
      //   await authUtils.changeUsPass(auth.currentUser, newPassword);
      //   // eslint-disable-next-line no-alert
      //   alert('User password update successfull');
      //   return await router.push('/');
      // }

      event.preventDefault();
      // nefunkcni
      await authUtils.changeUsPass(auth.currentUser, newPassword);
      // eslint-disable-next-line no-alert
      alert('User password update successfull');
      return await router.push('/');
    } catch (error) {
      const err = error as FirebaseError;
      if (err.code === 'auth/user-not-found') {
        alert('Bad password or user name or you do not have account');
      }
    }
  };
  return (
    <div>
      <div className={styles.container}>
        <h1>Change password acount</h1>
        <form onSubmit={handleForm} className={styles.form}>
          <label htmlFor="newPassword">
            <p>New password</p>
            <input
              className={styles.password}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              type="newPassword"
              name="newPassword"
              id="newPassword"
              placeholder="newPassword"
            />
          </label>
          <label htmlFor="confirmPassword">
            <p>Confirm new password</p>
            <input
              className={styles.password}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              type="confirmPassword"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm new password"
            />
          </label>
          <button className={styles.registerbtn} type="submit">
            Change password
          </button>
        </form>
      </div>
    </div>
  );
};
