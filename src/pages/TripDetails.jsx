import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
    MapPin, Calendar, Users, Hotel, Car, DollarSign, Clock,
    Map as MapIcon, Utensils, Star, ArrowLeft, Save, Share2,
    TrendingUp, Navigation, Info
} from 'lucide-react';
import { getMockTripData, calculateTripDays, getBudgetEstimate } from '../utils/tripMockData';
import './TripDetails.css';

const TripDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [tripData, setTripData] = useState(null);
    const [mockData, setMockData] = useState(null);
    const [selectedDay, setSelectedDay] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get trip data from navigation state
        const data = location.state?.tripData;

        if (!data) {
            // If no data, redirect back to trip creator
            navigate('/trip-creator');
            return;
        }

        setTripData(data);

        // Get mock data for the destination
        const mock = getMockTripData(data.destination);
        if (mock) {
            setMockData(mock);
        }

        setLoading(false);
    }, [location, navigate]);

    if (loading || !tripData || !mockData) {
        return (
            <div className="trip-details-loading">
                <div className="spinner-large"></div>
                <p>Loading your trip details...</p>
            </div>
        );
    }

    const tripDays = calculateTripDays(tripData.startDate, tripData.endDate);
    const budgetEstimate = getBudgetEstimate(tripData.destination, tripData.travelType, tripDays);

    const handleSaveTrip = () => {
        // TODO: Implement save to context/database
        alert('Trip saved successfully!');
        navigate('/saved-trips');
    };

    const handleShareTrip = () => {
        // TODO: Implement share functionality
        alert('Share functionality coming soon!');
    };

    return (
        <div className="trip-details-page">
            {/* Header */}
            <div className="trip-details-header">
                <div className="container">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                        Back
                    </button>

                    <div className="header-content">
                        <div className="header-main">
                            <h1 className="trip-title">
                                <MapPin className="title-icon" size={32} />
                                {tripData.destination}
                            </h1>
                            <p className="trip-subtitle">Your AI-Generated Trip Plan</p>
                        </div>

                        <div className="header-actions">
                            <button className="btn btn-secondary" onClick={handleShareTrip}>
                                <Share2 size={18} />
                                Share
                            </button>
                            <button className="btn btn-primary" onClick={handleSaveTrip}>
                                <Save size={18} />
                                Save Trip
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trip Overview */}
            <section className="trip-overview">
                <div className="container">
                    <div className="overview-grid">
                        <div className="overview-card">
                            <div className="overview-icon">
                                <Calendar size={24} />
                            </div>
                            <div className="overview-content">
                                <h3>Duration</h3>
                                <p className="overview-value">{tripDays} Days</p>
                                <p className="overview-detail">
                                    {new Date(tripData.startDate).toLocaleDateString('en-IN', {
                                        day: 'numeric', month: 'short', year: 'numeric'
                                    })} - {new Date(tripData.endDate).toLocaleDateString('en-IN', {
                                        day: 'numeric', month: 'short', year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="overview-card">
                            <div className="overview-icon">
                                <Users size={24} />
                            </div>
                            <div className="overview-content">
                                <h3>Travel Type</h3>
                                <p className="overview-value">{tripData.travelType.charAt(0).toUpperCase() + tripData.travelType.slice(1)}</p>
                                <p className="overview-detail">{tripData.members || (tripData.travelType === 'solo' ? '1' : tripData.travelType === 'couple' ? '2' : '4')} Travelers</p>
                            </div>
                        </div>

                        <div className="overview-card">
                            <div className="overview-icon">
                                <MapIcon size={24} />
                            </div>
                            <div className="overview-content">
                                <h3>Total Distance</h3>
                                <p className="overview-value">{mockData.totalKm} km</p>
                                <p className="overview-detail">Approx. travel distance</p>
                            </div>
                        </div>

                        <div className="overview-card">
                            <div className="overview-icon">
                                <DollarSign size={24} />
                            </div>
                            <div className="overview-content">
                                <h3>Estimated Budget</h3>
                                <p className="overview-value">₹{budgetEstimate.min.toLocaleString('en-IN')} - ₹{budgetEstimate.max.toLocaleString('en-IN')}</p>
                                <p className="overview-detail">₹{budgetEstimate.perDay.min.toLocaleString('en-IN')} - ₹{budgetEstimate.perDay.max.toLocaleString('en-IN')} per day</p>
                            </div>
                        </div>
                    </div>

                    {/* Highlights */}
                    <div className="trip-highlights">
                        <h3>
                            <TrendingUp size={20} />
                            Trip Highlights
                        </h3>
                        <div className="highlights-list">
                            {mockData.highlights.map((highlight, index) => (
                                <span key={index} className="highlight-tag">
                                    {highlight}
                                </span>
                            ))}
                        </div>
                        <div className="best-time">
                            <Info size={16} />
                            <span>Best Time to Visit: {mockData.bestTime}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Day-wise Itinerary */}
            <section className="day-itinerary">
                <div className="container">
                    <h2 className="section-title">Day-wise Itinerary</h2>

                    {/* Day Selector */}
                    <div className="day-selector">
                        {mockData.dayPlans.slice(0, tripDays).map((day) => (
                            <button
                                key={day.day}
                                className={`day-tab ${selectedDay === day.day ? 'active' : ''}`}
                                onClick={() => setSelectedDay(day.day)}
                            >
                                <span className="day-number">Day {day.day}</span>
                                <span className="day-title">{day.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* Day Details */}
                    {mockData.dayPlans
                        .filter(day => day.day === selectedDay)
                        .map((day) => (
                            <div key={day.day} className="day-details">
                                <div className="day-header">
                                    <h3>Day {day.day}: {day.title}</h3>
                                    <span className="activity-count">{day.activities.length} Activities</span>
                                </div>

                                <div className="activities-timeline">
                                    {day.activities.map((activity, index) => (
                                        <div key={index} className="activity-item">
                                            <div className="activity-time">
                                                <Clock size={18} />
                                                <span>{activity.time}</span>
                                                <span className="duration">{activity.duration}</span>
                                            </div>
                                            <div className="activity-content">
                                                <div className="activity-marker"></div>
                                                <div className="activity-details">
                                                    <h4>{activity.place}</h4>
                                                    <p>{activity.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            </section>

            {/* Hotels */}
            <section className="hotels-section">
                <div className="container">
                    <h2 className="section-title">
                        <Hotel size={24} />
                        Recommended Hotels
                    </h2>
                    <div className="hotels-grid">
                        {mockData.hotels.map((hotel, index) => (
                            <div key={index} className="hotel-card">
                                <div className="hotel-header">
                                    <div>
                                        <h3>{hotel.name}</h3>
                                        <span className="hotel-type">{hotel.type}</span>
                                    </div>
                                    <div className="hotel-rating">
                                        <Star size={16} fill="currentColor" />
                                        <span>{hotel.rating}</span>
                                    </div>
                                </div>
                                <div className="hotel-details">
                                    <div className="hotel-location">
                                        <Navigation size={14} />
                                        <span>{hotel.location}</span>
                                    </div>
                                    <div className="hotel-price">{hotel.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Transport */}
            <section className="transport-section">
                <div className="container">
                    <h2 className="section-title">
                        <Car size={24} />
                        Local Transport Options
                    </h2>
                    <div className="transport-grid">
                        {mockData.transport.map((transport, index) => (
                            <div key={index} className="transport-card">
                                <div className="transport-header">
                                    <h3>{transport.mode}</h3>
                                    <span className="transport-cost">{transport.cost}</span>
                                </div>
                                <p className="transport-description">{transport.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to start your journey?</h2>
                        <p>Save this trip to access it anytime and start planning the details</p>
                        <div className="cta-actions">
                            <button className="btn btn-primary btn-lg" onClick={handleSaveTrip}>
                                <Save size={20} />
                                Save This Trip
                            </button>
                            <Link to="/day-planner" className="btn btn-secondary btn-lg">
                                <Calendar size={20} />
                                Plan Daily Activities
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TripDetails;
