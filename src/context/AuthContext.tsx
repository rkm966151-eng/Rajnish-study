import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Language, SubscriptionPlan } from '../types/index.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, medium: Language, targetExam?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginAsDemoStudent: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'forgot';
  openAuthModal: (tab?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  // Subscription & Paid batch states
  plan: SubscriptionPlan | null;
  fetchPlan: () => Promise<void>;
  isUpgradeModalOpen: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
  unlockSubscription: (txDetails?: { amount?: number; paymentMethod?: string; utrNumber?: string }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('rajnish_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const fetchPlan = async () => {
    try {
      const res = await fetch('/api/subscription/plan');
      if (res.ok) {
        const data = await res.json();
        setPlan(data.plan);
      }
    } catch (e) {
      console.error('Failed to fetch subscription plan:', e);
    }
  };

  // Verify stored token or auto-login default student so user immediately has full interactive experience
  useEffect(() => {
    fetchPlan();

    async function initAuth() {
      const storedToken = localStorage.getItem('rajnish_token');
      if (storedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.error('Auth verification failed:', err);
        }
      }

      // If no valid stored session, auto-login student demo account for seamless first-time review
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'student@rajnishstudy.com', password: 'Student@123' }),
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(data.token);
          localStorage.setItem('rajnish_token', data.token);
        }
      } catch (e) {
        console.error('Demo auto-sign in failed:', e);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('rajnish_token', data.token);
      setAuthModalOpen(false);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error during login' };
    }
  };

  const register = async (name: string, email: string, password: string, medium: Language, targetExam?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, medium, targetExam }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('rajnish_token', data.token);
      setAuthModalOpen(false);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error during registration' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rajnish_token');
  };

  const loginAsDemoStudent = async () => {
    await login('student@rajnishstudy.com', 'Student@123');
  };

  const loginAsDemoAdmin = async () => {
    await login('admin@rajnishstudy.com', 'Admin@123');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const resp = await res.json();
        setUser(resp.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const unlockSubscription = async (txDetails?: { amount?: number; paymentMethod?: string; utrNumber?: string }) => {
    if (!token) {
      openAuthModal('login');
      return { success: false, error: 'Please sign in first to unlock subscription.' };
    }

    try {
      const res = await fetch('/api/subscription/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(txDetails || {}),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setIsUpgradeModalOpen(false);
        return { success: true };
      }
      return { success: false, error: data.error || 'Payment confirmation failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Payment network error' };
    }
  };

  const openAuthModal = (tab: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const openUpgradeModal = () => {
    setIsUpgradeModalOpen(true);
  };

  const closeUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        loginAsDemoStudent,
        loginAsDemoAdmin,
        updateProfile,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        plan,
        fetchPlan,
        isUpgradeModalOpen,
        openUpgradeModal,
        closeUpgradeModal,
        unlockSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
