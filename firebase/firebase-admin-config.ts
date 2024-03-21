import * as admin from 'firebase-admin';

const firebaseAdminConfig = {
  // todo: can use env variables
  // ....TODO

  type: 'service_account',
  project_id: 'projektcp-d8b20',
  private_key_id: 'f6cbb6da77f3bde030f206f17c24efa8f73afe65',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDMydfo9G1qoJ9k\n9+nh0I79X8gIReQUtS6hgBUj/cBfJ3WJuVcSGeT6U7Q8QqMgY0XpTqd0OglzbbaG\nb+mJOMSkox1UFHVwcEpp4okkE0MkpBz5FOqwzoIEdlvELAv+drtZjXCLMuYszyMu\nMrSpgRUm9A91Mm+yvcO5XgLnGlwHu4cVuU5Ebq+/xVy1611RR/zR+R+W+IecvkyB\n0Rqbeso8wKtSY9lgNYZsS6huLXv8rBRVSTRfEMcThlUXNaq6pqYVoxwliFnGBAxi\nTp4nVxu8KKg5JrAwniwKZLDP/jw6FRkkiL0TzVPVQbnDuAspfDiv4/ni7l6vFBhb\n5jlwVIwDAgMBAAECggEACN/WU2oEM9KyFZYItJhtGd3EtVcSAzO2yZjbUav1Yio7\nlbRKaaZlndNyxAm/N/AVX37hEtBRCIeAmWLQI/opy1imNLaOQEkdcGk4uC99gWD7\nQG//m5nXWIoof9/IxUYv6DmQ3vddsiNnyuC3o4DMgduhr9p3rK88hBPm3EzwIAWU\neR1VVvnCnTTeuWIggOEW1rob7yWoaX45tKHw8EdOfP8QYv8Cc3upeYa2+zQLgqFj\nKb89v9dJROxjW19Pl6XmvgI3EE3JVk/ocKaUYq/RJDdpUovfMugDqPpTvkhbnUEJ\nrrgaBZjXhsLYjjfFQ0nKwYftmASmMqfPI+M9D+m9wQKBgQD1Cu8l4jIyWaMgkCjK\n+Lj0gKjzh1+qmBVRgQw6ithj8V8Ep/puX+Qi6FIpCCgeWV2cEiN2prGOoStbOcTL\noZ1oNdMmuV78YCCChZzidxZJTN5FbyaN1wqqaguBfxLJNmwptrEed7hq/B1RAkHR\n7E4Ru0UJRQpUTyGIIqCpfvpj7wKBgQDV8hvIznyG3eMkgfzQF4OFFtEDkIkJzfot\n8gSNqAyEMaQ7CDZytX2m1XHhTII8leJ/6YLP1MNbZwdM0PD2/SNY7LTR3DhcTrNV\n4/5wk8AdyhpK0L5atTrv3ov1kiwuAFsmQbFVQx/8WrsvsNi0RqPfQ7PudU40++P6\nngPap+e1LQKBgB6As/BFTfZSjinZiBpsB6n38hAOg+wablzs8XbAHdujCi7sMhJX\nQXDO9ptA9q2AdlSdNWjpqySUD2+Vq1el0JBOUvB5FsfXt3RH6ZWPOWj6dpiyE1yI\nrj00YiZGiTIe4iv3H+kpAf3fUE7rNwJIphcy9o8G1xhTmVr25IT013plAoGAe09g\n/jstANqwyWD2YsW6syG0dHaA1ZrXgFXGlBLwq9ykyLVyFGlQs7DAQ1fClMLa2liv\nYbRCqNLYHUksKV87WUyM54wjG+jsaivPgflWuJS81LQ9krBz+L7vMin+tsDTyFgC\nqp7Wt69fxhwKutUgLFWsRltsKROpkdAzbnpqDT0CgYEAs8oiKUYj7Nb7sz+iYAAi\nQ59Nwf9m8v8icPgbVvnCns1s7sQutQqbt0LhwBOVXjbg5zDePgarpDdlZQXMjL2h\nYoblKZa1RX89DI+TTtvMum5LN4JRmaBf9PTPTq9BPIExnHA5eHCTpNDKWVZAeSJG\nKmvMXQhkhmCd66yg1kZmZb4=\n-----END PRIVATE KEY-----\n',
  client_email:
    'firebase-adminsdk-dhrub@projektcp-d8b20.iam.gserviceaccount.com',
  client_id: '106420495618777389142',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dhrub%40projektcp-d8b20.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};
if (admin.apps.length === 0) {
  // Initialize Firebase
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
  });
}
// export const adminAuth = admin.auth;
export const { firestore, auth: adminAuth } = admin;
