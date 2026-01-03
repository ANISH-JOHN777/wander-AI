import { useTripContext } from '../../context/TripContext';
import { Navigate, Link } from 'react-router-dom';
import { UtensilsCrossed, Star, MapPin, DollarSign } from 'lucide-react';
import { getMockRestaurants } from '../../utils/mockData';
import './Restaurants.css';

const Restaurants = () => {
    const { activeTrip } = useTripContext();

    if (!activeTrip) {
        return <Navigate to="/trip-creator" replace />;
    }

    const restaurants = getMockRestaurants(activeTrip.destination);

    return (
        <div className="restaurants-page">
            <div className="module-header">
                <div>
                    <h1><UtensilsCrossed size={32} /> Restaurants</h1>
                    <p className="module-subtitle">Discover dining in {activeTrip.destination}</p>
                </div>
                <Link to="/bookings" className="btn btn-secondary">
                    Back to Bookings
                </Link>
            </div>

            <div className="search-criteria">
                <h3>Search Criteria</h3>
                <div className="criteria-grid">
                    <div className="criteria-item">
                        <span className="criteria-label">Location:</span>
                        <span className="criteria-value">{activeTrip.destination}</span>
                    </div>
                    <div className="criteria-item">
                        <span className="criteria-label">Party Size:</span>
                        <span className="criteria-value">{activeTrip.travelers || 1} people</span>
                    </div>
                    <div className="criteria-item">
                        <span className="criteria-label">Trip Duration:</span>
                        <span className="criteria-value">
                            {activeTrip.startDate} to {activeTrip.endDate}
                        </span>
                    </div>
                </div>
            </div>

            <div className="results-section">
                <div className="results-header">
                    <h3>{restaurants.length} Restaurants Found in {activeTrip.destination}</h3>
                    <p className="results-note">Discover the best dining experiences for your trip</p>
                </div>

                <div className="restaurant-grid">
                    {restaurants.map(restaurant => (
                        <div key={restaurant.id} className="restaurant-card">
                            <div className="restaurant-header">
                                <div className="restaurant-info">
                                    <UtensilsCrossed size={24} className="restaurant-icon" />
                                    <div>
                                        <h4>{restaurant.name}</h4>
                                        <span className="cuisine-type">{restaurant.cuisine}</span>
                                    </div>
                                </div>
                                <div className="rating-info">
                                    <Star size={16} fill="gold" color="gold" />
                                    <span className="rating-value">{restaurant.rating}</span>
                                </div>
                            </div>

                            <div className="restaurant-details">
                                <div className="detail-item">
                                    <MapPin size={16} />
                                    <span>{restaurant.location}</span>
                                </div>
                                <div className="detail-item">
                                    <DollarSign size={16} />
                                    <span>{restaurant.priceRange}</span>
                                </div>
                            </div>

                            <div className="restaurant-specialty">
                                <div className="specialty-label">Specialty:</div>
                                <div className="specialty-value">{restaurant.specialty}</div>
                            </div>

                            <div className="restaurant-popular">
                                <div className="popular-label">Must Try:</div>
                                <div className="popular-value">{restaurant.popular}</div>
                            </div>

                            <div className="restaurant-footer">
                                <button className="btn btn-primary btn-sm">View Menu</button>
                                <button className="btn btn-secondary btn-sm">Reserve Table</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Restaurants;
