// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFwtuc2E1rwQ7ocsSR-dxpOCF5NYYcbPc",
  authDomain: "bloomit-4aa5a.firebaseapp.com",
  projectId: "bloomit-4aa5a",
  storageBucket: "bloomit-4aa5a.firebasestorage.app",
  messagingSenderId: "592970040645",
  appId: "1:592970040645:web:af6679be1064c57e602a2c",
  measurementId: "G-TKFB7JCKSJ"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get the auth instance
const auth = firebase.auth();

// Auth functions
export const registerUser = async (email, password) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Registration error:", error);
    return { user: null, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Login error:", error);
    return { user: null, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await auth.signOut();
    return { error: null };
  } catch (error) {
    console.error("Logout error:", error);
    return { error: error.message };
  }
};

export const resetPassword = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email);
    return { error: null };
  } catch (error) {
    console.error("Password reset error:", error);
    return { error: error.message };
  }
};

// Export auth for auth state listener
export { auth }; 