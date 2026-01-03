import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Globe, Search, MapPin, Calendar, Users,
    ChevronRight, Eye, Copy, Filter, Sparkles
} from 'lucide-react';
import { tripService } from '../services';
import './Explore.css';

const Explore = () => {
    const [publicTrips, setPublicTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadPublicTrips();
    }, []);

    const loadPublicTrips = async () => {
        setLoading(true);
        const { trips, error } = await tripService.getPublicTrips();
        if (!error) {
            setPublicTrips(trips);
        }
        setLoading(false);
    };

    const filteredTrips = publicTrips.filter(trip => {
        const matchesSearch = trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || trip.travel_type === filter;
        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="explore-page">
            <div className="explore-hero">
                <div className="container">
                    <h1>
                        <Globe size={40} className="hero-icon" />
                        Explore the Community
                    </h1>
                    <p>Discover amazing itineraries planned by fellow travelers around the world.</p>

                    <div className="search-bar-container">
                        <div className="search-box">
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by destination (e.g. Mumbai, Goa...)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="explore-container">
                <div className="filter-wrapper">
                    <div className="filter-group">
                        <Filter size={18} />
                        <button
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >All Trips</button>
                        <button
                            className={`filter-btn ${filter === 'solo' ? 'active' : ''}`}
                            onClick={() => setFilter('solo')}
                        >Solo</button>
                        <button
                            className={`filter-btn ${filter === 'couple' ? 'active' : ''}`}
                            onClick={() => setFilter('couple')}
                        >Couple</button>
                        <button
                            className={`filter-btn ${filter === 'group' ? 'active' : ''}`}
                            onClick={() => setFilter('group')}
                        >Group</button>
                    </div>
                    <div className="results-count">
                        Showing {filteredTrips.length} amazing plans
                    </div>
                </div>

                {loading ? (
                    <div className="explore-loading">
                        <div className="loader"></div>
                        <p>Discovering trips...</p>
                    </div>
                ) : filteredTrips.length > 0 ? (
                    <div className="trips-masonry">
                        {filteredTrips.map(trip => (
                            <div key={trip.id} className="explore-card">
                                <Link to={`/shared/${trip.share_token}`} className="card-image-link">
                                    <div
                                        className="card-image"
                                        style={{
                                            backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80)`
                                        }}
                                    >
                                        <div className="card-badge">
                                            <Sparkles size={12} />
                                            {trip.travel_type}
                                        </div>
                                    </div>
                                </Link>
                                <div className="card-body">
                                    <div className="card-header">
                                        <h3>{trip.destination}</h3>
                                        <div className="view-stat">
                                            <Eye size={14} />
                                            {trip.view_count || 0}
                                        </div>
                                    </div>

                                    <div className="card-details">
                                        <div className="detail-item">
                                            <Calendar size={14} />
                                            <span>{formatDate(trip.start_date)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <Users size={14} />
                                            <span>{trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <Link to={`/shared/${trip.share_token}`} className="view-btn">
                                            View Itinerary <ChevronRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <div className="empty-icon">🗺️</div>
                        <h3>No trips found</h3>
                        <p>Be the first to share a trip to "{searchTerm}"!</p>
                        <Link to="/trip-creator" className="btn btn-primary">Start Planning</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explore;
