import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import { useStore, User } from './store/useStore';

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const { setCurrentUser, currentUser, isDarkMode } = useStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        // Fetch user profile from Firestore
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data() as User;
          setCurrentUser(userData);
          
          // Check if handle is set
          if (!userData.handle) {
            setNeedsOnboarding(true);
          } else {
            setNeedsOnboarding(false);
          }
        } else {
          // User document doesn't exist yet (handled in Auth.tsx, but just in case)
          setNeedsOnboarding(true);
        }
      } else {
        setCurrentUser(null);
        setNeedsOnboarding(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setCurrentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-x-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-x-blue"></div>
      </div>
    );
  }

  if (!firebaseUser) {
    return <Auth />;
  }

  if (needsOnboarding) {
    return <Onboarding onComplete={() => setNeedsOnboarding(false)} />;
  }

  return <Layout />;
}
