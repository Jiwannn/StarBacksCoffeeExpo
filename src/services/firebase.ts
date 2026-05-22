import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDTjQP2x6qD4ucRAHMC6MwsXgBRPI5t-Gk",
  authDomain: "starbackscoffee.firebaseapp.com",
  projectId: "starbackscoffee",
  storageBucket: "starbackscoffee.firebasestorage.app",
  messagingSenderId: "455887716881",
  appId: "1:455887716881:web:f16aea87372c4d084827b0"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);

export default app;