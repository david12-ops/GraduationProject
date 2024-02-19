'use client';

import { FirebaseError } from 'firebase-admin';
import { useRouter } from 'next/router';
import React, { FormEvent } from 'react';

import { authUtils } from '@/firebase/auth-utils';

import styles from '../../../styles/stylesForm/style.module.css';

export const PageFormLogin = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();
  const handleForm = async (event: FormEvent) => {
    try {
      event.preventDefault();
      await authUtils.login(email, password);
      alert('User login successfully');
      return await router.push('/');
    } catch (error) {
      // nechyta error
      const err = error as FirebaseError;
      if (err.code === 'auth/user-not-found') {
        alert('Bad password or user name or you do not have account');
      }
    }
  };
  return (
    <div>
      <div className={styles.container}>
        <h1>Login</h1>
        <form onSubmit={handleForm} className={styles.form}>
          {/* <hr> */}
          <label htmlFor="email">
            <p>Email</p>
            <input
              className={styles.email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
            />
          </label>
          <label htmlFor="password">
            <p>Password</p>
            <input
              className={styles.password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="password"
            />
          </label>
          {/* </hr> */}
          <button className={styles.registerbtn} type="submit">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};
