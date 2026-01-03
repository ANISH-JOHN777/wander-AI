import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Plus, Calendar, Ticket, Bot, Save, Settings, Globe, LogIn, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated } = useAuth();

    const navItems = [
        { path: '/home', label: 'Home', icon: Home },
        { path: '/overview', label: 'Overview', icon: LayoutDashboard },
        { path: '/trip-creator', label: 'Create Trip', icon: Plus },
        { path: '/day-planner', label: 'Day Planner', icon: Calendar },
        { path: '/bookings', label: 'Bookings', icon: Ticket },
        { path: '/smart-tools', label: 'Smart Tools', icon: Bot },
        { path: '/saved-trips', label: 'Saved Info', icon: Save },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Globe className="brand-icon" size={28} strokeWidth={2.5} />
                    <span className="brand-name">WanderAI</span>
                </div>

                <div className="navbar-links">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                <Icon className="nav-icon" size={18} strokeWidth={2} />
                                <span className="nav-label">{item.label}</span>
                            </NavLink>
                        );
                    })}

                    {/* Authentication Button */}
                    <NavLink
                        to="/auth"
                        className={({ isActive }) => `nav-link auth-link ${isActive ? 'active' : ''}`}
                    >
                        {isAuthenticated ? (
                            <>
                                <User className="nav-icon" size={18} strokeWidth={2} />
                                <span className="nav-label">{user?.email?.split('@')[0] || 'Profile'}</span>
                            </>
                        ) : (
                            <>
                                <LogIn className="nav-icon" size={18} strokeWidth={2} />
                                <span className="nav-label">Sign In</span>
                            </>
                        )}
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
