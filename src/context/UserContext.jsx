import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [preferences, setPreferences] = useState({
        theme: 'light',
        currency: 'USD',
        language: 'en',
        notifications: true,
    });

    // Load user data from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('aiTripPlanner_user');
        const savedPreferences = localStorage.getItem('aiTripPlanner_preferences');

        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
                setIsAuthenticated(true);
            } catch (err) {
                console.error('Error loading user:', err);
            }
        }

        if (savedPreferences) {
            try {
                setPreferences(JSON.parse(savedPreferences));
            } catch (err) {
                console.error('Error loading preferences:', err);
            }
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('aiTripPlanner_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('aiTripPlanner_user');
    };

    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('aiTripPlanner_user', JSON.stringify(updatedUser));
    };

    const updatePreferences = (newPreferences) => {
        const updated = { ...preferences, ...newPreferences };
        setPreferences(updated);
        localStorage.setItem('aiTripPlanner_preferences', JSON.stringify(updated));
    };

    const value = {
        user,
        isAuthenticated,
        preferences,
        login,
        logout,
        updateUser,
        updatePreferences,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
