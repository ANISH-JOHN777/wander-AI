import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { getBackendMode } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load user session on mount
    useEffect(() => {
        loadUserSession();
    }, []);

    // Load user session from storage or Supabase
    const loadUserSession = async () => {
        try {
            console.log('🔐 AuthContext: Loading user session...');
            const { user: currentUser, error } = await authService.getCurrentUser();

            if (error) {
                console.error('❌ AuthContext: Error loading session:', error);
                setUser(null);
                setIsAuthenticated(false);
            } else if (currentUser) {
                console.log('✅ AuthContext: User session loaded', currentUser);
                setUser(currentUser);
                setIsAuthenticated(true);
            } else {
                console.log('📍 AuthContext: No active session');
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('❌ AuthContext: Session load error:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // Sign up a new user
    const signUp = async (email, password, metadata = {}) => {
        try {
            setLoading(true);
            console.log('🔐 AuthContext: Signing up user...', email);

            const { user: newUser, error } = await authService.signUp(email, password, metadata);

            if (error) {
                console.error('❌ AuthContext: Signup error:', error);
                return { user: null, error };
            }

            console.log('✅ AuthContext: User signed up successfully', newUser);
            setUser(newUser);
            setIsAuthenticated(true);
            return { user: newUser, error: null };
        } catch (error) {
            console.error('❌ AuthContext: Signup exception:', error);
            return { user: null, error };
        } finally {
            setLoading(false);
        }
    };

    // Sign in an existing user
    const signIn = async (email, password) => {
        try {
            setLoading(true);
            console.log('🔐 AuthContext: Signing in user...', email);

            const { user: signedInUser, error } = await authService.signIn(email, password);

            if (error) {
                console.error('❌ AuthContext: Signin error:', error);
                return { user: null, error };
            }

            console.log('✅ AuthContext: User signed in successfully', signedInUser);
            setUser(signedInUser);
            setIsAuthenticated(true);
            return { user: signedInUser, error: null };
        } catch (error) {
            console.error('❌ AuthContext: Signin exception:', error);
            return { user: null, error };
        } finally {
            setLoading(false);
        }
    };

    // Sign out the current user
    const signOut = async () => {
        try {
            setLoading(true);
            console.log('🔐 AuthContext: Signing out user...');

            const { error } = await authService.signOut();

            if (error) {
                console.error('❌ AuthContext: Signout error:', error);
                return { error };
            }

            console.log('✅ AuthContext: User signed out successfully');
            setUser(null);
            setIsAuthenticated(false);
            return { error: null };
        } catch (error) {
            console.error('❌ AuthContext: Signout exception:', error);
            return { error };
        } finally {
            setLoading(false);
        }
    };

    // Update user profile
    const updateProfile = async (updates) => {
        try {
            setLoading(true);
            console.log('🔐 AuthContext: Updating user profile...', updates);

            const { user: updatedUser, error } = await authService.updateUser(updates);

            if (error) {
                console.error('❌ AuthContext: Update error:', error);
                return { user: null, error };
            }

            console.log('✅ AuthContext: User profile updated', updatedUser);
            setUser(updatedUser);
            return { user: updatedUser, error: null };
        } catch (error) {
            console.error('❌ AuthContext: Update exception:', error);
            return { user: null, error };
        } finally {
            setLoading(false);
        }
    };

    // Reset password
    const resetPassword = async (email) => {
        try {
            setLoading(true);
            console.log('🔐 AuthContext: Requesting password reset...', email);

            const { error } = await authService.resetPassword(email);

            if (error) {
                console.error('❌ AuthContext: Reset error:', error);
                return { error };
            }

            console.log('✅ AuthContext: Password reset email sent');
            return { error: null };
        } catch (error) {
            console.error('❌ AuthContext: Reset exception:', error);
            return { error };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        signUp,
        signIn,
        signOut,
        updateProfile,
        resetPassword,
        reloadSession: loadUserSession,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
