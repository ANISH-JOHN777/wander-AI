import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const navItems = [
        { path: '/overview', label: 'Overview', icon: '🏠' },
        { path: '/trip-creator', label: 'Create Trip', icon: '✨' },
        { path: '/day-planner', label: 'Day Planner', icon: '📅' },
        { path: '/saved-trips', label: 'Saved Info', icon: '💾' },
        { path: '/notifications', label: 'Notifications', icon: '🔔' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span className="sidebar-logo">🌍</span>
                <h2 className="sidebar-title">AI Trip Planner</h2>
            </div>

            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <p>© 2024 AI Trip Planner</p>
            </div>
        </aside>
    );
};

export default Sidebar;
