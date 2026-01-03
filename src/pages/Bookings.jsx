import { useTripContext } from '../context/TripContext';
import { Navigate, Link } from 'react-router-dom';
import { Hotel, Plane, UtensilsCrossed, ArrowRight, Home, Palmtree, Package } from 'lucide-react';
import './Bookings.css';

const Bookings = () => {
    const { activeTrip } = useTripContext();

    // Redirect if no active trip
    if (!activeTrip) {
        return <Navigate to="/trip-creator" replace />;
    }

    const modules = [
        {
            id: 'hotels',
            title: 'Hotel Finder',
            icon: Hotel,
            description: 'Find and book hotels for your trip',
            path: '/bookings/hotels',
            color: '#667eea',
        },
        {
            id: 'airbnb',
            title: 'Airbnb',
            icon: Home,
            description: 'Discover unique stays and experiences',
            path: '/bookings/airbnb',
            color: '#ff5a5f',
        },
        {
            id: 'resorts',
            title: 'Resorts',
            icon: Palmtree,
            description: 'Luxury resorts and beach properties',
            path: '/bookings/resorts',
            color: '#10b981',
        },
        {
            id: 'transport',
            title: 'Transport',
            icon: Plane,
            description: 'Book flights, trains, and buses',
            path: '/bookings/transport',
            color: '#48bb78',
        },
        {
            id: 'restaurants',
            title: 'Restaurants',
            icon: UtensilsCrossed,
            description: 'Discover dining options',
            path: '/bookings/restaurants',
            color: '#ed8936',
        },
        {
            id: 'packages',
            title: 'Tour Packages',
            icon: Package,
            description: 'All-inclusive tour packages',
            path: '/bookings/packages',
            color: '#8b5cf6',
        },
    ];

    return (
        <div className="bookings-page">
            <div className="bookings-header">
                <div>
                    <h1>Bookings & Essentials</h1>
                    <p className="bookings-subtitle">
                        Manage bookings and essentials for {activeTrip.destination}
                    </p>
                </div>
                <Link to="/overview" className="btn btn-secondary">
                    Back to Overview
                </Link>
            </div>

            <div className="modules-grid">
                {modules.map(module => {
                    const IconComponent = module.icon;
                    return (
                        <Link
                            key={module.id}
                            to={module.path}
                            className="module-card"
                            style={{ '--module-color': module.color }}
                        >
                            <div className="module-icon">
                                <IconComponent size={32} />
                            </div>
                            <div className="module-content">
                                <h3>{module.title}</h3>
                                <p>{module.description}</p>
                            </div>
                            <div className="module-arrow">
                                <ArrowRight size={20} />
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="trip-info-banner">
                <div className="info-item">
                    <span className="info-label">Destination:</span>
                    <span className="info-value">{activeTrip.destination}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Dates:</span>
                    <span className="info-value">
                        {activeTrip.startDate} to {activeTrip.endDate}
                    </span>
                </div>
                <div className="info-item">
                    <span className="info-label">Travelers:</span>
                    <span className="info-value">{activeTrip.travelers || 1}</span>
                </div>
            </div>
        </div>
    );
};

export default Bookings;
