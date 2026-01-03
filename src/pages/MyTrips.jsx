import { useState } from 'react';
import { useTripContext } from '../context/TripContext';
import TripCard from '../components/TripCard';
import './MyTrips.css';

const MyTrips = ({ onNavigate }) => {
    const { trips, deleteTrip } = useTripContext();
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTrips = trips.filter(trip => {
        const matchesFilter = filter === 'all' || trip.status === filter;
        const matchesSearch = trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleViewTrip = (tripId) => {
        onNavigate('trip-details', tripId);
    };

    const handleDeleteTrip = (tripId) => {
        if (window.confirm('Are you sure you want to delete this trip?')) {
            deleteTrip(tripId);
        }
    };

    return (
        <div className="my-trips-page">
            <div className="trips-header">
                <h1>My Trips</h1>
                <p className="trips-subtitle">
                    {trips.length === 0
                        ? 'Start planning your first adventure!'
                        : `You have ${trips.length} trip${trips.length !== 1 ? 's' : ''} planned`}
                </p>
            </div>

            {trips.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">✈️</div>
                    <h2>No trips yet</h2>
                    <p>Start planning your dream vacation with AI assistance</p>
                    <button className="btn btn-primary btn-large" onClick={() => onNavigate('planner')}>
                        Plan Your First Trip
                    </button>
                </div>
            ) : (
                <>
                    <div className="trips-controls">
                        <div className="search-bar">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search destinations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="filter-tabs">
                            <button
                                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All Trips
                            </button>
                            <button
                                className={`filter-tab ${filter === 'planned' ? 'active' : ''}`}
                                onClick={() => setFilter('planned')}
                            >
                                Planned
                            </button>
                            <button
                                className={`filter-tab ${filter === 'ongoing' ? 'active' : ''}`}
                                onClick={() => setFilter('ongoing')}
                            >
                                Ongoing
                            </button>
                            <button
                                className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                                onClick={() => setFilter('completed')}
                            >
                                Completed
                            </button>
                        </div>
                    </div>

                    {filteredTrips.length === 0 ? (
                        <div className="no-results">
                            <p>No trips found matching your criteria</p>
                        </div>
                    ) : (
                        <div className="trips-grid">
                            {filteredTrips.map(trip => (
                                <TripCard
                                    key={trip.id}
                                    trip={trip}
                                    onView={() => handleViewTrip(trip.id)}
                                    onDelete={() => handleDeleteTrip(trip.id)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyTrips;
