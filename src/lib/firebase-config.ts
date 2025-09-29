/**
 * @fileOverview Firebase configuration and initialization.
 *
 * This file exports the Firebase app object after initializing it with the
 * configuration specific to this project. This allows other parts of the
d * application to use Firebase services.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: 'studio-7903347784-5ac78',
  appId: '1:26947766157:web:c0a6b41530be3be2b5dfc4',
  apiKey: 'AIzaSyAMMUQiHI2_EASddD9P2V5TAVwoIci94fc',
  authDomain: 'studio-7903347784-5ac78.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '26947766157',
};

// Initialize Firebase
// We check if the app is already initialized to avoid errors.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export { app };
