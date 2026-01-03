import './Header.css';

const Header = ({ currentPage, onNavigate }) => {
    const navItems = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'planner', label: 'Plan Trip', icon: '✈️' },
        { id: 'trips', label: 'My Trips', icon: '📋' },
    ];

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="header-logo" onClick={() => onNavigate('home')}>
                    <span className="logo-icon">🌍</span>
                    <span className="logo-text">AI Trip Planner</span>
                </div>

                <nav className="header-nav">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                            onClick={() => onNavigate(item.id)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Header;
