import { useTripContext } from '../../context/TripContext';
import { Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Package, Star, Clock, CheckCircle, MapPin, Users } from 'lucide-react';
import { getMockTripData } from '../../utils/tripMockData';
import './TourPackages.css';

const TourPackages = () => {
    const { activeTrip } = useTripContext();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTrip?.destination) {
            const mockData = getMockTripData(activeTrip.destination);
            if (mockData?.tourPackages) {
                setPackages(mockData.tourPackages);
            }
            setLoading(false);
        }
    }, [activeTrip]);

    if (!activeTrip) {
        return <Navigate to="/trip-creator" replace />;
    }

    return (
        <div className="tour-packages-page">
            <div className="module-header">
                <div>
                    <h1><Package size={32} /> Tour Packages</h1>
                    <p className="module-subtitle">All-inclusive tour packages for {activeTrip.destination}</p>
                </div>
                <Link to="/bookings" className="btn btn-secondary">
                    Back to Bookings
                </Link>
            </div>

            <div className="search-criteria">
                <h3>Trip Information</h3>
                <div className="criteria-grid">
                    <div className="criteria-item">
                        <span className="criteria-label">Destination:</span>
                        <span className="criteria-value">{activeTrip.destination}</span>
                    </div>
                    <div className="criteria-item">
                        <span className="criteria-label">Travel Dates:</span>
                        <span className="criteria-value">
                            {activeTrip.startDate} to {activeTrip.endDate}
                        </span>
                    </div>
                    <div className="criteria-item">
                        <span className="criteria-label">Travelers:</span>
                        <span className="criteria-value">{activeTrip.travelers || 1}</span>
                    </div>
                </div>
            </div>

            <div className="packages-container">
                <div className="section-header">
                    <h2>Available Tour Packages</h2>
                    <p className="results-count">{packages.length} packages available</p>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading tour packages...</p>
                    </div>
                ) : packages.length === 0 ? (
                    <div className="no-results">
                        <Package size={48} />
                        <h3>No packages available</h3>
                        <p>Try selecting a different destination</p>
                    </div>
                ) : (
                    <div className="packages-grid">
                        {packages.map((pkg, index) => (
                            <div key={index} className="package-card">
                                <div className="package-header">
                                    <div className="package-icon">
                                        <Package size={32} />
                                    </div>
                                    <div className="package-title-section">
                                        <h3>{pkg.name}</h3>
                                        <div className="package-rating">
                                            <Star size={14} fill="currentColor" />
                                            <span>{pkg.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="package-details">
                                    <div className="package-info-row">
                                        <Clock size={16} />
                                        <span className="info-label">Duration:</span>
                                        <span className="info-value">{pkg.duration}</span>
                                    </div>

                                    <div className="package-highlights">
                                        <MapPin size={16} />
                                        <div>
                                            <span className="info-label">Highlights:</span>
                                            <p className="highlights-text">{pkg.highlights}</p>
                                        </div>
                                    </div>

                                    <div className="package-includes">
                                        <h4>Package Includes:</h4>
                                        <div className="includes-list">
                                            {pkg.includes.map((item, idx) => (
                                                <div key={idx} className="include-item">
                                                    <CheckCircle size={14} />
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="package-footer">
                                    <div className="package-price">
                                        <span className="price-label">Price</span>
                                        <span className="price-amount">{pkg.price}</span>
                                    </div>
                                    <button className="btn btn-primary">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="info-banner">
                    <div className="info-icon">
                        <Package size={24} />
                    </div>
                    <div className="info-content">
                        <h4>Why Choose Tour Packages?</h4>
                        <p>Hassle-free travel with pre-planned itineraries, expert guides, and all-inclusive pricing. Perfect for first-time visitors and those who want a stress-free experience.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourPackages;
