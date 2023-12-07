'use client';

import { FirebaseError } from 'firebase-admin';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FormEvent } from 'react';

import { useActualUsToFirestoreMutation } from '@/generated/graphql';

import { authUtils } from '../../../firebase/auth-utils';
import styles from '../../../styles/stylesForm/style.module.css';

export const PageRegisterForm = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();
  const [newUser] = useActualUsToFirestoreMutation();

  // eslint-disable-next-line consistent-return
  const handleForm = async (event: FormEvent) => {
    try {
      event.preventDefault();
      // const actual = email;
      await authUtils.register(email, password);
      // eslint-disable-next-line react-hooks/rules-of-hooks, no-alert
      alert('User register successfully');
      // eslint-disable-next-line react-hooks/rules-of-hooks
      await newUser({
        variables: {
          email: email.toString(),
        },
      });
      return router.push('/');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, react-hooks/rules-of-hooks, sonarjs/no-all-duplicated-branches
    } catch (error) {
      const err = error as FirebaseError;
      if (err.code === 'auth/email-already-in-use') {
        alert('User is already in use');
      }
    }
  };
  return (
    <div>
      <div className={styles.container}>
        <h1>Register</h1>
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
          <button
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            className={styles.registerbtn}
            type="submit"
          >
            Register
          </button>
        </form>
        <div className={styles.signin}>
          <p>
            Already have an account?{' '}
            <Link
              className={styles.reference}
              key="login-page"
              href="../../Forms/login-page"
            >
              Sign in
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
