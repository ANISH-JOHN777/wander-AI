import { supabase, isBackendAvailable } from '../config/supabase';

/**
 * Authentication Service
 * Handles user authentication with Supabase
 * Falls back to mock auth in local mode
 */

class AuthService {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
    }

    /**
     * Sign up a new user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {Object} metadata - Additional user data
     * @returns {Promise<{user, session, error}>}
     */
    async signUp(email, password, metadata = {}) {
        if (!isBackendAvailable()) {
            // Mock signup for local mode
            console.log('📍 LOCAL MODE: Mock signup', { email, metadata });
            const mockUser = {
                id: `user_${Date.now()}`,
                email,
                ...metadata,
                created_at: new Date().toISOString(),
            };
            this.currentUser = mockUser;
            this.isAuthenticated = true;
            localStorage.setItem('mockUser', JSON.stringify(mockUser));
            return { user: mockUser, session: null, error: null };
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata,
                },
            });

            if (error) throw error;

            this.currentUser = data.user;
            this.isAuthenticated = true;
            console.log('✅ User signed up successfully');
            return { user: data.user, session: data.session, error: null };
        } catch (error) {
            console.error('❌ Signup error:', error);
            return { user: null, session: null, error };
        }
    }

    /**
     * Sign in an existing user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<{user, session, error}>}
     */
    async signIn(email, password) {
        if (!isBackendAvailable()) {
            // Mock signin for local mode
            console.log('📍 LOCAL MODE: Mock signin', { email });
            const mockUser = JSON.parse(localStorage.getItem('mockUser') || 'null') || {
                id: `user_${Date.now()}`,
                email,
                created_at: new Date().toISOString(),
            };
            this.currentUser = mockUser;
            this.isAuthenticated = true;
            localStorage.setItem('mockUser', JSON.stringify(mockUser));
            return { user: mockUser, session: null, error: null };
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            this.currentUser = data.user;
            this.isAuthenticated = true;
            console.log('✅ User signed in successfully');
            return { user: data.user, session: data.session, error: null };
        } catch (error) {
            console.error('❌ Signin error:', error);
            return { user: null, session: null, error };
        }
    }

    /**
     * Sign out the current user
     * @returns {Promise<{error}>}
     */
    async signOut() {
        if (!isBackendAvailable()) {
            // Mock signout for local mode
            console.log('📍 LOCAL MODE: Mock signout');
            this.currentUser = null;
            this.isAuthenticated = false;
            localStorage.removeItem('mockUser');
            return { error: null };
        }

        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            this.currentUser = null;
            this.isAuthenticated = false;
            console.log('✅ User signed out successfully');
            return { error: null };
        } catch (error) {
            console.error('❌ Signout error:', error);
            return { error };
        }
    }

    /**
     * Get the current user
     * @returns {Promise<{user, error}>}
     */
    async getCurrentUser() {
        if (!isBackendAvailable()) {
            // Mock get current user for local mode
            const mockUser = JSON.parse(localStorage.getItem('mockUser') || 'null');
            this.currentUser = mockUser;
            this.isAuthenticated = !!mockUser;
            return { user: mockUser, error: null };
        }

        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;

            this.currentUser = user;
            this.isAuthenticated = !!user;
            return { user, error: null };
        } catch (error) {
            console.error('❌ Get user error:', error);
            return { user: null, error };
        }
    }

    /**
     * Get the current session
     * @returns {Promise<{session, error}>}
     */
    async getSession() {
        if (!isBackendAvailable()) {
            // Mock session for local mode
            const mockUser = JSON.parse(localStorage.getItem('mockUser') || 'null');
            return { session: mockUser ? { user: mockUser } : null, error: null };
        }

        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            return { session, error: null };
        } catch (error) {
            console.error('❌ Get session error:', error);
            return { session: null, error };
        }
    }

    /**
     * Reset password for a user
     * @param {string} email - User email
     * @returns {Promise<{error}>}
     */
    async resetPassword(email) {
        if (!isBackendAvailable()) {
            // Mock password reset for local mode
            console.log('📍 LOCAL MODE: Mock password reset', { email });
            return { error: null };
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
            console.log('✅ Password reset email sent');
            return { error: null };
        } catch (error) {
            console.error('❌ Password reset error:', error);
            return { error };
        }
    }

    /**
     * Update user metadata
     * @param {Object} updates - User metadata to update
     * @returns {Promise<{user, error}>}
     */
    async updateUser(updates) {
        if (!isBackendAvailable()) {
            // Mock update user for local mode
            console.log('📍 LOCAL MODE: Mock update user', updates);
            const mockUser = JSON.parse(localStorage.getItem('mockUser') || 'null');
            if (mockUser) {
                const updatedUser = { ...mockUser, ...updates };
                localStorage.setItem('mockUser', JSON.stringify(updatedUser));
                this.currentUser = updatedUser;
                return { user: updatedUser, error: null };
            }
            return { user: null, error: new Error('No user logged in') };
        }

        try {
            const { data: { user }, error } = await supabase.auth.updateUser({
                data: updates,
            });
            if (error) throw error;

            this.currentUser = user;
            console.log('✅ User updated successfully');
            return { user, error: null };
        } catch (error) {
            console.error('❌ Update user error:', error);
            return { user: null, error };
        }
    }

    /**
     * Listen to auth state changes
     * @param {Function} callback - Callback function to handle auth changes
     * @returns {Object} Subscription object
     */
    onAuthStateChange(callback) {
        if (!isBackendAvailable()) {
            // Mock auth state listener for local mode
            console.log('📍 LOCAL MODE: Mock auth state listener');
            return { data: { subscription: { unsubscribe: () => { } } } };
        }

        return supabase.auth.onAuthStateChange((event, session) => {
            this.currentUser = session?.user || null;
            this.isAuthenticated = !!session?.user;
            callback(event, session);
        });
    }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
