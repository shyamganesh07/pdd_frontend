import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { signInWithCredential, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase';

export const isCapacitor = () => {
  return (window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() !== 'web') || 
         window.location.origin.startsWith('capacitor://') || 
         window.location.pathname.includes('android_asset');
};

// Initialize Capacitor Google Auth if running inside native app
if (isCapacitor()) {
  try {
    GoogleAuth.initialize({
      clientId: '290508657488-fecc6pimf0tsv4vqdphn6pfd7372j2a5.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true
    });
  } catch (e) {
    console.warn('[Capacitor] GoogleAuth initialize warning:', e);
  }
}

export const authService = {
  async login() {
    try {
      let idToken;
      
      if (isCapacitor()) {
        // Native Google Sign-In
        const googleUser = await GoogleAuth.signIn();
        const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
        const userCredential = await signInWithCredential(auth, credential);
        idToken = await userCredential.user.getIdToken(true);
      } else {
        // Web PWA popup sign-in
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const userCredential = await signInWithPopup(auth, provider);
        idToken = await userCredential.user.getIdToken(true);
      }
      
      // Verify token with backend
      return await this.syncWithBackend(idToken);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await firebaseSignOut(auth);
      if (isCapacitor()) {
        try {
          await GoogleAuth.signOut();
        } catch (e) {
          console.warn('[Capacitor] GoogleAuth.signOut warning:', e);
        }
      }
      // Clear all auth-related local storage items
      localStorage.removeItem('user_profile');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('is_authenticated');
      localStorage.removeItem('demo_balance');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async syncWithBackend(idToken) {
    try {
      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const detailMsg = typeof errData.detail === 'object' 
          ? JSON.stringify(errData.detail) 
          : errData.detail;
        throw new Error(detailMsg || 'Token sync with backend failed');
      }
      
      const data = await response.json();
      if (data && data.user) {
        // Store profile details locally for instant access on next load
        localStorage.setItem('user_profile', JSON.stringify(data.user));
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('is_authenticated', 'true');
        if (data.user.balance !== undefined) {
          localStorage.setItem('demo_balance', data.user.balance.toString());
        }
        return data.user;
      }
      throw new Error('Invalid user profile response from server');
    } catch (err) {
      console.error('Sync failure:', err);
      throw err;
    }
  }
};
