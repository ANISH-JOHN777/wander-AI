import { useState } from 'react';
import { useTripContext } from '../context/TripContext';
import './Notifications.css';

const Notifications = () => {
    const { activeTrip, trips } = useTripContext();
    const [notifications] = useState([
        {
            id: 1,
            type: 'reminder',
            title: 'Trip Starting Soon',
            message: activeTrip ? `Your trip to ${activeTrip.destination} starts in 5 days!` : 'No active trip',
            time: '2 hours ago',
            read: false,
        },
        {
            id: 2,
            type: 'update',
            title: 'Itinerary Updated',
            message: 'Your day 3 activities have been optimized',
            time: '1 day ago',
            read: false,
        },
        {
            id: 3,
            type: 'tip',
            title: 'Travel Tip',
            message: 'Don\'t forget to check visa requirements for your destination',
            time: '2 days ago',
            read: true,
        },
    ]);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'reminder':
                return '⏰';
            case 'update':
                return '🔄';
            case 'tip':
                return '💡';
            default:
                return '📬';
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="notifications-page">
            <div className="notifications-header">
                <div>
                    <h1>Notifications</h1>
                    <p className="notifications-subtitle">
                        {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                </div>
            </div>

            {notifications.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🔔</div>
                    <h2>No Notifications</h2>
                    <p>You're all caught up! Check back later for updates.</p>
                </div>
            ) : (
                <div className="notifications-list">
                    {notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`notification-card ${notification.read ? 'read' : 'unread'}`}
                        >
                            <div className="notification-icon">
                                {getNotificationIcon(notification.type)}
                            </div>
                            <div className="notification-content">
                                <h3>{notification.title}</h3>
                                <p>{notification.message}</p>
                                <span className="notification-time">{notification.time}</span>
                            </div>
                            {!notification.read && <div className="unread-indicator"></div>}
                        </div>
                    ))}
                </div>
            )}

            <div className="notification-settings">
                <h2>Notification Preferences</h2>
                <div className="settings-list">
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Trip Reminders</h3>
                            <p>Get notified before your trip starts</p>
                        </div>
                        <label className="toggle">
                            <input type="checkbox" defaultChecked />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Itinerary Updates</h3>
                            <p>Receive updates when your itinerary changes</p>
                        </div>
                        <label className="toggle">
                            <input type="checkbox" defaultChecked />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Travel Tips</h3>
                            <p>Get helpful tips and recommendations</p>
                        </div>
                        <label className="toggle">
                            <input type="checkbox" defaultChecked />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
