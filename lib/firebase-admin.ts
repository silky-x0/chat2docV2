import * as admin from 'firebase-admin';

// Check if Firebase Admin has already been initialized
let firebaseAdmin: admin.app.App;

if (!admin.apps.length) {
  // Initialize Firebase Admin with service account credentials
  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    } as admin.ServiceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
} else {
  firebaseAdmin = admin.app();
}

export default firebaseAdmin; 