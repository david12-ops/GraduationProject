'use client';

import { getAuth } from 'firebase/auth';
import { FirebaseError } from 'firebase-admin';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';

import { authUtils } from '@/firebase/auth-utils';

import styles from '../../../styles/stylesForm/style.module.css';

export const PageFormChangeEm = () => {
  const [newEm, setNewEm] = useState('');
  const auth = getAuth();
  const router = useRouter();

  const handleForm = async (event: FormEvent) => {
    try {
      if (!auth.currentUser) {
        throw new Error('Not logged!');
      }

      event.preventDefault();

      await authUtils.channgeUsEmail(auth.currentUser, newEm);

      console.log(auth.currentUser);

      alert('User password update successfull');

      return await router.push('/'); // presmerovani na libovolnou stranku .push(url)
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
        <h1>Change email account</h1>
        <form onSubmit={handleForm} className={styles.form}>
          <label htmlFor="email">
            <p>New email</p>
            <input
              className={styles.email}
              onChange={(e) => setNewEm(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
            />
          </label>
          <button className={styles.registerbtn} type="submit">
            Change email account
          </button>
          <button>{auth.currentUser?.email}</button>
        </form>
      </div>
    </div>
  );
};
