import { useTripContext } from '../../context/TripContext';
import { Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Palmtree, Star, MapPin, Waves, Sparkles } from 'lucide-react';
import { getMockTripData } from '../../utils/tripMockData';
import './HotelFinder.css';

const ResortFinder = () => {
    const { activeTrip } = useTripContext();
    const [resorts, setResorts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTrip?.destination) {
            const mockData = getMockTripData(activeTrip.destination);
            if (mockData?.resorts) {
                setResorts(mockData.resorts);
            }
            setLoading(false);
        }
    }, [activeTrip]);

    if (!activeTrip) {
        return <Navigate to="/trip-creator" replace />;
    }

    return (
        <div className="hotel-finder-page">
            <div className="module-header">
                <div>
                    <h1><Palmtree size={32} /> Luxury Resorts</h1>
                    <p className="module-subtitle">Premium resorts and beach properties in {activeTrip.destination}</p>
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
                        <span className="criteria-label">Check-in:</span>
                        <span className="criteria-value">{activeTrip.startDate}</span>
                    </div>
                    <div className="criteria-item">
                        <span className="criteria-label">Check-out:</span>
                        <span className="criteria-value">{activeTrip.endDate}</span>
                    </div>
                    <div className="criteria-item">
                        <span className="criteria-label">Guests:</span>
                        <span className="criteria-value">{activeTrip.travelers || 1}</span>
                    </div>
                </div>
            </div>

            <div className="hotels-container">
                <div className="section-header">
                    <h2>Premium Resort Options</h2>
                    <p className="results-count">{resorts.length} resorts found</p>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Finding luxury resorts...</p>
                    </div>
                ) : resorts.length === 0 ? (
                    <div className="no-results">
                        <Palmtree size={48} />
                        <h3>No resorts available</h3>
                        <p>Try selecting a different destination</p>
                    </div>
                ) : (
                    <div className="hotels-grid">
                        {resorts.map((resort, index) => (
                            <div key={index} className="hotel-card">
                                <div className="hotel-image">
                                    <div className="image-placeholder">
                                        <Palmtree size={48} />
                                    </div>
                                    <div className="hotel-badge luxury">{resort.type}</div>
                                </div>
                                <div className="hotel-content">
                                    <div className="hotel-header">
                                        <h3>{resort.name}</h3>
                                        <div className="hotel-rating">
                                            <Star size={16} fill="currentColor" />
                                            <span>{resort.rating}</span>
                                        </div>
                                    </div>
                                    <div className="hotel-location">
                                        <MapPin size={14} />
                                        <span>{resort.location}</span>
                                    </div>
                                    <div className="hotel-amenities">
                                        {resort.facilities.slice(0, 4).map((facility, idx) => (
                                            <span key={idx} className="amenity-tag">
                                                {facility === 'Beach' && <Waves size={12} />}
                                                {facility === 'Spa' && <Sparkles size={12} />}
                                                {facility}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="hotel-footer">
                                        <div className="hotel-price">
                                            <span className="price-label">From</span>
                                            <span className="price-amount">{resort.price}</span>
                                        </div>
                                        <button className="btn btn-primary btn-sm">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="info-banner">
                    <div className="info-icon">
                        <Palmtree size={24} />
                    </div>
                    <div className="info-content">
                        <h4>Luxury Resort Experience</h4>
                        <p>Indulge in world-class amenities, spa treatments, fine dining, and breathtaking views. Perfect for a relaxing and memorable vacation.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResortFinder;
