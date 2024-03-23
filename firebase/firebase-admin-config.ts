import * as admin from 'firebase-admin';

const firebaseAdminConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

if (admin.apps.length === 0) {
  // Initialize Firebase

  admin.initializeApp({
    credential: admin.credential.cert(
      firebaseAdminConfig as admin.ServiceAccount,
    ),
  });
}
// export const adminAuth = admin.auth;
export const { firestore, auth: adminAuth } = admin;
