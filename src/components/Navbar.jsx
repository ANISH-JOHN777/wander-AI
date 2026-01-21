import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    Home, LayoutDashboard, Plus, Calendar,
    Ticket, Bot, Save, Settings, Globe,
    LogIn, User, Share2, MoreVertical, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTripContext } from '../context/TripContext';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated } = useAuth();
    const { setIsShareModalOpen } = useTripContext();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const isOverview = location.pathname === '/overview';

    const navItems = [
        { path: '/home', label: 'Home', icon: Home },
        { path: '/explore', label: 'Explore', icon: Globe },
        { path: '/overview', label: 'Overview', icon: LayoutDashboard },
        { path: '/trip-creator', label: 'Create Trip', icon: Plus },
        { path: '/day-planner', label: 'Day Planner', icon: Calendar },
        { path: '/bookings', label: 'Bookings', icon: Ticket },
        { path: '/smart-tools', label: 'Smart Tools', icon: Bot },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setShowDropdown(false);
    }, [location.pathname]);

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

                    {/* More Dropdown */}
                    <div className="nav-dropdown-container" ref={dropdownRef}>
                        <button
                            className={`nav-link dropdown-trigger ${showDropdown ? 'active' : ''}`}
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <MoreVertical className="nav-icon" size={18} strokeWidth={2} />
                            <span className="nav-label">More</span>
                            <ChevronDown size={14} className={`chevron ${showDropdown ? 'rotate' : ''}`} />
                        </button>

                        {showDropdown && (
                            <div className="nav-dropdown-menu">
                                {isOverview && (
                                    <button
                                        className="dropdown-item share-item"
                                        onClick={() => {
                                            setIsShareModalOpen(true);
                                            setShowDropdown(false);
                                        }}
                                    >
                                        <Share2 size={16} />
                                        <span>Share Trip</span>
                                    </button>
                                )}
                                <NavLink to="/travel-buddy" className="dropdown-item">
                                    <User size={16} />
                                    <span>Find Travel Buddy</span>
                                </NavLink>
                                <NavLink to="/saved-trips" className="dropdown-item">
                                    <Save size={16} />
                                    <span>Saved Info</span>
                                </NavLink>
                                <NavLink to="/settings" className="dropdown-item">
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </NavLink>
                            </div>
                        )}
                    </div>

                    {/* Authentication/Profile Button */}
                    <NavLink
                        to={isAuthenticated ? "/profile" : "/auth"}
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
