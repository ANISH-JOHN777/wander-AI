import { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';
import { useTripContext } from '../context/TripContext';
import { storageService } from '../services/storageService';
import './Settings.css';

const Settings = () => {
    const { user, preferences, updatePreferences } = useUserContext();
    const { trips, clearAllTrips } = useTripContext();
    const [showConfirm, setShowConfirm] = useState(false);

    // Apply theme changes
    useEffect(() => {
        const theme = preferences.theme || 'light';
        document.documentElement.setAttribute('data-theme', theme);

        // Store theme preference
        localStorage.setItem('theme', theme);
    }, [preferences.theme]);

    const handleExportData = () => {
        const success = storageService.exportTrips(trips);
        if (success) {
            alert('Trips exported successfully!');
        } else {
            alert('Failed to export trips');
        }
    };

    const handleClearAllData = () => {
        if (showConfirm) {
            clearAllTrips();
            setShowConfirm(false);
            alert('All data cleared successfully');
        } else {
            setShowConfirm(true);
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <h1>Settings</h1>
                <p className="settings-subtitle">Manage your preferences and data</p>
            </div>

            <div className="settings-sections">
                {/* Appearance Settings */}
                <div className="settings-section">
                    <h2>Appearance</h2>
                    <div className="settings-list">
                        <div className="setting-item">
                            <div className="setting-info">
                                <h3>Theme</h3>
                                <p>Choose your preferred color scheme</p>
                            </div>
                            <select
                                value={preferences.theme || 'light'}
                                onChange={(e) => updatePreferences({ theme: e.target.value })}
                                className="setting-select"
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="auto">Auto</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Regional Settings */}
                <div className="settings-section">
                    <h2>Regional</h2>
                    <div className="settings-list">
                        <div className="setting-item">
                            <div className="setting-info">
                                <h3>Currency</h3>
                                <p>Default currency for budget calculations</p>
                            </div>
                            <select
                                value={preferences.currency || 'USD'}
                                onChange={(e) => updatePreferences({ currency: e.target.value })}
                                className="setting-select"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="JPY">JPY (¥)</option>
                                <option value="INR">INR (₹)</option>
                            </select>
                        </div>
                        <div className="setting-item">
                            <div className="setting-info">
                                <h3>Language</h3>
                                <p>Choose your preferred language</p>
                            </div>
                            <select
                                value={preferences.language || 'en'}
                                onChange={(e) => updatePreferences({ language: e.target.value })}
                                className="setting-select"
                            >
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="de">Deutsch</option>
                                <option value="ja">日本語</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="settings-section">
                    <h2>Notifications</h2>
                    <div className="settings-list">
                        <div className="setting-item">
                            <div className="setting-info">
                                <h3>Enable Notifications</h3>
                                <p>Receive updates and reminders</p>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={preferences.notifications !== false}
                                    onChange={(e) => updatePreferences({ notifications: e.target.checked })}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Data Management */}
                <div className="settings-section">
                    <h2>Data Management</h2>
                    <div className="settings-list">
                        <div className="setting-item">
                            <div className="setting-info">
                                <h3>Export Data</h3>
                                <p>Download all your trips as JSON</p>
                            </div>
                            <button className="btn btn-secondary btn-small" onClick={handleExportData}>
                                Export
                            </button>
                        </div>
                        <div className="setting-item">
                            <div className="setting-info">
                                <h3>Storage Used</h3>
                                <p>{trips.length} trip{trips.length !== 1 ? 's' : ''} saved locally</p>
                            </div>
                            <span className="storage-badge">{trips.length} trips</span>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="settings-section danger-zone">
                    <h2>Danger Zone</h2>
                    <div className="settings-list">
                        <div className="setting-item">
                            <div className="setting-info">
                                <h3>Clear All Data</h3>
                                <p>Permanently delete all trips and settings</p>
                            </div>
                            <button
                                className={`btn btn-small ${showConfirm ? 'btn-danger' : 'btn-secondary'}`}
                                onClick={handleClearAllData}
                            >
                                {showConfirm ? 'Confirm Delete' : 'Clear All'}
                            </button>
                        </div>
                        {showConfirm && (
                            <div className="confirm-message">
                                <p>⚠️ This action cannot be undone. Click again to confirm.</p>
                                <button className="btn btn-secondary btn-small" onClick={() => setShowConfirm(false)}>
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* About */}
                <div className="settings-section">
                    <h2>About</h2>
                    <div className="about-content">
                        <p><strong>AI Trip Planner</strong></p>
                        <p>Version 1.0.0</p>
                        <p>Powered by AI to create your perfect journey</p>
                        <div className="about-links">
                            <a href="#privacy">Privacy Policy</a>
                            <a href="#terms">Terms of Service</a>
                            <a href="#support">Support</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
