// Authentication context for managing auth state across the app
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform, Alert } from 'react-native';
import { auth } from './firebase';

// Create the AuthContext
export const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component that wraps the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Set up the auth state listener
    const unsubscribe = auth.onAuthStateChanged(
      (currentUser) => {
        // Check if this is a login event (user was null, now it's not)
        const isLogin = !user && currentUser;
        
        setUser(currentUser);
        
        if (initializing) {
          setInitializing(false);
        }
        
        setLoading(false);
        
        // Can add post-login logic here if needed
        if (isLogin) {
          console.log('User logged in:', currentUser.email);
        }
      },
      (error) => {
        console.error("Auth state error:", error);
        setAuthError(error.message);
        setLoading(false);
        setInitializing(false);
      }
    );

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [initializing, user]);

  // Helper function to show alerts
  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Value provided by the context
  const value = {
    user,
    loading,
    initializing,
    authError,
    showAlert
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 