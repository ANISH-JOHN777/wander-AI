import { useTripContext } from '../context/TripContext';
import { Link, Navigate } from 'react-router-dom';
import { Luggage, Heart, Users, Plane, Clock, PartyPopper, Calendar, CalendarDays, ClipboardList, Save, Sparkles, ArrowRight, Route } from 'lucide-react';
import './Overview.css';

const Overview = () => {
    const { activeTrip } = useTripContext();

    // Redirect to TripCreator if no active trip
    if (!activeTrip) {
        return <Navigate to="/trip-creator" replace />;
    }

    // Helper to get field value (handles both camelCase and snake_case)
    const getField = (camelCase, snakeCase) => {
        return activeTrip[camelCase] || activeTrip[snakeCase];
    };

    const startDate = getField('startDate', 'start_date');
    const endDate = getField('endDate', 'end_date');
    const travelType = getField('travelType', 'travel_type');

    // Calculate total days
    const calculateTotalDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1; // Include both start and end day
    };

    // Calculate days until trip starts
    const calculateDaysUntil = () => {
        if (!startDate) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const diffTime = start - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-IN', options);
    };

    // Get travel type display
    const getTravelTypeDisplay = () => {
        const types = {
            solo: { icon: Luggage, label: 'Solo Trip' },
            couple: { icon: Heart, label: 'Couple Trip' },
            group: { icon: Users, label: 'Group Trip' },
        };
        return types[travelType] || { icon: Plane, label: 'Trip' };
    };

    const totalDays = calculateTotalDays();
    const daysUntil = calculateDaysUntil();
    const travelTypeInfo = getTravelTypeDisplay();

    return (
        <div className="overview-page">
            {/* Hero Section */}
            <div className="overview-hero">
                <div className="hero-content">
                    <div className="trip-badge">
                        <span className="badge-icon">
                            {travelTypeInfo.icon && <travelTypeInfo.icon size={20} />}
                        </span>
                        <span className="badge-text">{travelTypeInfo.label}</span>
                    </div>
                    <h1 className="trip-destination">{activeTrip.destination}</h1>

                    {daysUntil !== null && daysUntil > 0 && (
                        <div className="countdown-banner">
                            <span className="countdown-icon"><Clock size={20} /></span>
                            <span className="countdown-text">
                                {daysUntil === 1 ? 'Starts tomorrow!' : `Starts in ${daysUntil} days`}
                            </span>
                        </div>
                    )}

                    {daysUntil !== null && daysUntil === 0 && (
                        <div className="countdown-banner today">
                            <span className="countdown-icon"><PartyPopper size={20} /></span>
                            <span className="countdown-text">Your trip starts today!</span>
                        </div>
                    )}

                    {daysUntil !== null && daysUntil < 0 && (
                        <div className="countdown-banner ongoing">
                            <span className="countdown-icon"><Plane size={20} /></span>
                            <span className="countdown-text">Trip in progress</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Trip Details Cards */}
            <div className="trip-details-grid">
                {/* Start Date Card */}
                <div className="detail-card">
                    <div className="card-icon"><Calendar size={24} /></div>
                    <div className="card-content">
                        <div className="card-label">Start Date</div>
                        <div className="card-value">{formatDate(startDate)}</div>
                    </div>
                </div>

                {/* End Date Card */}
                <div className="detail-card">
                    <div className="card-icon"><Calendar size={24} /></div>
                    <div className="card-content">
                        <div className="card-label">End Date</div>
                        <div className="card-value">{formatDate(endDate)}</div>
                    </div>
                </div>

                {/* Total Days Card */}
                <div className="detail-card highlight">
                    <div className="card-icon"><CalendarDays size={24} /></div>
                    <div className="card-content">
                        <div className="card-label">Total Days</div>
                        <div className="card-value">{totalDays} {totalDays === 1 ? 'Day' : 'Days'}</div>
                    </div>
                </div>

                {/* Travelers Card */}
                <div className="detail-card">
                    <div className="card-icon"><Users size={24} /></div>
                    <div className="card-content">
                        <div className="card-label">Travelers</div>
                        <div className="card-value">{activeTrip.travelers || 1}</div>
                    </div>
                </div>

                {/* Total Distance Card */}
                {activeTrip.totalKm && (
                    <div className="detail-card highlight">
                        <div className="card-icon"><Route size={24} /></div>
                        <div className="card-content">
                            <div className="card-label">Total Distance</div>
                            <div className="card-value">{activeTrip.totalKm} km</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
                <h2 className="section-title">Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/day-planner" className="action-card">
                        <div className="action-icon"><ClipboardList size={32} /></div>
                        <div className="action-content">
                            <h3>Plan Day-wise Itinerary</h3>
                            <p>Create detailed plans for each day of your trip</p>
                        </div>
                        <div className="action-arrow"><ArrowRight size={20} /></div>
                    </Link>

                    <Link to="/saved-trips" className="action-card">
                        <div className="action-icon"><Save size={32} /></div>
                        <div className="action-content">
                            <h3>View Saved Trips</h3>
                            <p>Browse and manage all your saved trips</p>
                        </div>
                        <div className="action-arrow"><ArrowRight size={20} /></div>
                    </Link>

                    <Link to="/trip-creator" className="action-card">
                        <div className="action-icon"><Sparkles size={32} /></div>
                        <div className="action-content">
                            <h3>Create New Trip</h3>
                            <p>Start planning your next adventure</p>
                        </div>
                        <div className="action-arrow"><ArrowRight size={20} /></div>
                    </Link>
                </div>
            </div>

            {/* Day Planner Preview */}
            {((activeTrip.day_plans && Object.keys(activeTrip.day_plans).length > 0) ||
                (activeTrip.dayPlans && Object.keys(activeTrip.dayPlans).length > 0)) && (
                    <div className="day-planner-preview-section">
                        <div className="section-header-with-action">
                            <h2 className="section-title">Your Itinerary</h2>
                            <Link to="/day-planner" className="btn btn-secondary btn-sm">
                                Edit in Day Planner <ArrowRight size={16} style={{ display: 'inline', marginLeft: '4px' }} />
                            </Link>
                        </div>
                        <div className="days-preview-grid">
                            {Object.entries(activeTrip.day_plans || activeTrip.dayPlans || {})
                                .sort(([a], [b]) => {
                                    const dayNumA = parseInt(a.replace('day', ''));
                                    const dayNumB = parseInt(b.replace('day', ''));
                                    return dayNumA - dayNumB;
                                })
                                .map(([dayKey, activities]) => {
                                    const dayNumber = parseInt(dayKey.replace('day', ''));
                                    const dayDate = new Date(startDate);
                                    dayDate.setDate(dayDate.getDate() + (dayNumber - 1));

                                    return (
                                        <div key={dayKey} className="day-preview-card">
                                            <div className="day-preview-header">
                                                <div className="day-number-badge">Day {dayNumber}</div>
                                                <div className="day-date-text">
                                                    {dayDate.toLocaleDateString('en-IN', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                            <div className="activities-preview-list">
                                                {activities && activities.length > 0 ? (
                                                    <>
                                                        {activities.slice(0, 3).map((activity, index) => (
                                                            <div key={activity.id || index} className="activity-preview-item">
                                                                {activity.time && (
                                                                    <span className="activity-time-badge">{activity.time}</span>
                                                                )}
                                                                <span className="activity-name">{activity.place}</span>
                                                            </div>
                                                        ))}
                                                        {activities.length > 3 && (
                                                            <div className="more-activities">
                                                                +{activities.length - 3} more {activities.length - 3 === 1 ? 'activity' : 'activities'}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="no-activities">No activities planned</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                )}

            {/* Trip Info */}
            <div className="trip-info-section">
                <div className="info-card">
                    <h3>Trip Information</h3>
                    <div className="info-list">
                        <div className="info-row">
                            <span className="info-label">Destination:</span>
                            <span className="info-value">{activeTrip.destination}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Travel Type:</span>
                            <span className="info-value">{travelTypeInfo.label}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Status:</span>
                            <span className={`status-badge status-${activeTrip.status || 'planned'}`}>
                                {(activeTrip.status || 'planned').charAt(0).toUpperCase() + (activeTrip.status || 'planned').slice(1)}
                            </span>
                        </div>
                        {activeTrip.totalKm && (
                            <div className="info-row">
                                <span className="info-label">Total Distance:</span>
                                <span className="info-value">{activeTrip.totalKm} km</span>
                            </div>
                        )}
                        <div className="info-row">
                            <span className="info-label">Created:</span>
                            <span className="info-value">
                                {activeTrip.createdAt ? formatDate(activeTrip.createdAt.split('T')[0]) : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
