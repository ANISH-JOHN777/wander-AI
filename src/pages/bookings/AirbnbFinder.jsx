import { useTripContext } from '../../context/TripContext';
import { Navigate, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Home, Star, MapPin, Wifi, Coffee, Users, Search } from 'lucide-react';
import { getMockTripData } from '../../utils/tripMockData';
import './HotelFinder.css'; // Reusing hotel finder styles

const AirbnbFinder = () => {
    const { activeTrip } = useTripContext();
    const [airbnbListings, setAirbnbListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState('best');

    useEffect(() => {
        if (activeTrip?.destination) {
            const mockData = getMockTripData(activeTrip.destination);
            if (mockData?.airbnb) {
                setAirbnbListings(mockData.airbnb);
            }
            setLoading(false);
        }
    }, [activeTrip]);

    // Filter and sort listings
    const filteredListings = useMemo(() => {
        let filtered = airbnbListings;

        // Search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(listing =>
                listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                listing.type.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Extract price number from string like "₹5,000/night"
        const getPrice = (priceStr) => {
            return parseInt(priceStr.replace(/[₹,/night]/g, ''));
        };

        // Price sorting
        const sorted = [...filtered].sort((a, b) => {
            const priceA = getPrice(a.price);
            const priceB = getPrice(b.price);

            if (priceFilter === 'lower') {
                return priceA - priceB;
            } else if (priceFilter === 'higher') {
                return priceB - priceA;
            } else {
                // 'best' - sort by rating, then by price
                if (b.rating !== a.rating) {
                    return b.rating - a.rating;
                }
                return priceA - priceB;
            }
        });

        return sorted;
    }, [airbnbListings, searchQuery, priceFilter]);

    if (!activeTrip) {
        return <Navigate to="/trip-creator" replace />;
    }

    return (
        <div className="hotel-finder-page">
            <div className="module-header">
                <div>
                    <h1><Home size={32} /> Airbnb Stays</h1>
                    <p className="module-subtitle">Unique stays and experiences in {activeTrip.destination}</p>
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

            {/* Search and Filter Section */}
            <div className="search-filter-section">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, location, or type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-buttons">
                    <span className="filter-label">Sort by:</span>
                    <button
                        className={`filter-btn ${priceFilter === 'lower' ? 'active' : ''}`}
                        onClick={() => setPriceFilter('lower')}
                    >
                        Lower Price
                    </button>
                    <button
                        className={`filter-btn ${priceFilter === 'best' ? 'active' : ''}`}
                        onClick={() => setPriceFilter('best')}
                    >
                        Best Price
                    </button>
                    <button
                        className={`filter-btn ${priceFilter === 'higher' ? 'active' : ''}`}
                        onClick={() => setPriceFilter('higher')}
                    >
                        Higher Price
                    </button>
                </div>
            </div>

            <div className="hotels-container">
                <div className="section-header">
                    <h2>Available Airbnb Listings</h2>
                    <p className="results-count">{filteredListings.length} properties found</p>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Finding unique stays...</p>
                    </div>
                ) : filteredListings.length === 0 ? (
                    <div className="no-results">
                        <Home size={48} />
                        <h3>No listings available</h3>
                        <p>Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="hotels-grid">
                        {filteredListings.map((listing, index) => (
                            <div key={index} className="hotel-card">
                                <div className="hotel-image">
                                    <div className="image-placeholder">
                                        <Home size={48} />
                                    </div>
                                    <div className="hotel-badge">{listing.type}</div>
                                </div>
                                <div className="hotel-content">
                                    <div className="hotel-header">
                                        <h3>{listing.name}</h3>
                                        <div className="hotel-rating">
                                            <Star size={16} fill="currentColor" />
                                            <span>{listing.rating}</span>
                                        </div>
                                    </div>
                                    <div className="hotel-location">
                                        <MapPin size={14} />
                                        <span>{listing.location}</span>
                                    </div>
                                    <div className="hotel-amenities">
                                        {listing.amenities.slice(0, 3).map((amenity, idx) => (
                                            <span key={idx} className="amenity-tag">
                                                {amenity === 'WiFi' && <Wifi size={12} />}
                                                {amenity === 'Breakfast' && <Coffee size={12} />}
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="hotel-footer">
                                        <div className="hotel-price">
                                            <span className="price-label">From</span>
                                            <span className="price-amount">{listing.price}</span>
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
                        <Home size={24} />
                    </div>
                    <div className="info-content">
                        <h4>Why Choose Airbnb?</h4>
                        <p>Experience local living with unique homes, apartments, and villas. Perfect for travelers seeking authentic experiences and home-like comfort.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AirbnbFinder;
