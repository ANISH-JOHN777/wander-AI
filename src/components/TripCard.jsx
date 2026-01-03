import './TripCard.css';

const TripCard = ({ trip, onView, onDelete }) => {
    const getDuration = () => {
        if (!trip.startDate || !trip.endDate) return 'N/A';
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return `${days} day${days !== 1 ? 's' : ''}`;
    };

    const getStatusColor = () => {
        switch (trip.status) {
            case 'planned':
                return '#667eea';
            case 'ongoing':
                return '#48bb78';
            case 'completed':
                return '#718096';
            default:
                return '#667eea';
        }
    };

    return (
        <div className="trip-card">
            <div className="trip-card-header">
                <div className="trip-destination">
                    <span className="destination-icon">📍</span>
                    <h3>{trip.destination}</h3>
                </div>
                <span className="trip-status" style={{ backgroundColor: getStatusColor() }}>
                    {trip.status || 'planned'}
                </span>
            </div>

            <div className="trip-card-body">
                <div className="trip-info-item">
                    <span className="info-icon">📅</span>
                    <div className="info-content">
                        <span className="info-label">Duration</span>
                        <span className="info-value">{getDuration()}</span>
                    </div>
                </div>

                <div className="trip-info-item">
                    <span className="info-icon">💰</span>
                    <div className="info-content">
                        <span className="info-label">Budget</span>
                        <span className="info-value">{trip.budget || 'N/A'}</span>
                    </div>
                </div>

                <div className="trip-info-item">
                    <span className="info-icon">👥</span>
                    <div className="info-content">
                        <span className="info-label">Travelers</span>
                        <span className="info-value">{trip.travelers || 1}</span>
                    </div>
                </div>

                {trip.interests && trip.interests.length > 0 && (
                    <div className="trip-interests">
                        {trip.interests.slice(0, 3).map((interest, index) => (
                            <span key={index} className="interest-badge">{interest}</span>
                        ))}
                        {trip.interests.length > 3 && (
                            <span className="interest-badge">+{trip.interests.length - 3}</span>
                        )}
                    </div>
                )}
            </div>

            <div className="trip-card-footer">
                <button className="btn btn-secondary btn-small" onClick={onView}>
                    View Details
                </button>
                <button className="btn btn-danger btn-small" onClick={onDelete}>
                    Delete
                </button>
            </div>

            {trip.createdAt && (
                <div className="trip-meta">
                    Created {new Date(trip.createdAt).toLocaleDateString()}
                </div>
            )}
        </div>
    );
};

export default TripCard;
