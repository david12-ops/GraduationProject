import { adminAuth } from '../../firebase/firebase-admin-config';
// './firebase-admin-config'

export const verifyToken = async (token: string) => {
  try {
    const parts = token.split(' ');
    if (parts.length < 2) {
      console.error('invalid token format');
      return undefined;
    }
    const decoded = await adminAuth().verifyIdToken(parts[1]);
    const { email } = decoded;
    console.info('verified token for user', { email });
    return decoded;
  } catch (error) {
    console.warn('verified token failed', error);
    return undefined;
  }
};
