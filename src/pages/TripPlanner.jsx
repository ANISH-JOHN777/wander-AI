import { useState } from 'react';
import { useTripContext } from '../context/TripContext';
import { aiService } from '../services/aiService';
import TripForm from '../components/TripForm';
import LoadingSpinner from '../components/LoadingSpinner';
import './TripPlanner.css';

const TripPlanner = ({ onNavigate }) => {
    const { createTrip, selectTrip, setLoading, loading } = useTripContext();
    const [step, setStep] = useState(1);
    const [tripData, setTripData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        budget: '',
        travelers: 1,
        interests: [],
        accommodation: 'hotel',
        transportation: 'flight',
    });
    const [generatedItinerary, setGeneratedItinerary] = useState(null);
    const [error, setError] = useState(null);

    const handleFormSubmit = async (formData) => {
        setTripData(formData);
        setError(null);
        setLoading(true);

        try {
            // Generate itinerary using AI
            const itinerary = await aiService.generateTripItinerary(formData);
            setGeneratedItinerary(itinerary);
            setStep(2);
        } catch (err) {
            setError('Failed to generate itinerary. Please try again.');
            console.error('Error generating itinerary:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTrip = () => {
        const newTrip = {
            ...tripData,
            itinerary: generatedItinerary,
            status: 'planned',
        };

        // Create trip (automatically sets as active trip)
        const savedTrip = createTrip(newTrip);
        onNavigate('trips');
    };

    const handleEditTrip = () => {
        setStep(1);
        setGeneratedItinerary(null);
    };

    if (loading) {
        return (
            <div className="trip-planner-page">
                <LoadingSpinner message="Creating your perfect itinerary..." />
            </div>
        );
    }

    return (
        <div className="trip-planner-page">
            <div className="planner-header">
                <h1>Plan Your Trip</h1>
                <div className="step-indicator">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <div className="step-label">Trip Details</div>
                    </div>
                    <div className="step-divider"></div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <div className="step-label">Review Itinerary</div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                    <button className="error-close" onClick={() => setError(null)}>×</button>
                </div>
            )}

            {step === 1 && (
                <div className="planner-content">
                    <TripForm onSubmit={handleFormSubmit} initialData={tripData} />
                </div>
            )}

            {step === 2 && generatedItinerary && (
                <div className="planner-content">
                    <div className="itinerary-preview">
                        <div className="preview-header">
                            <h2>Your Personalized Itinerary</h2>
                            <div className="preview-actions">
                                <button className="btn btn-secondary" onClick={handleEditTrip}>
                                    Edit Details
                                </button>
                                <button className="btn btn-primary" onClick={handleSaveTrip}>
                                    Save Trip
                                </button>
                            </div>
                        </div>

                        {/* Trip Summary */}
                        <div className="summary-card">
                            <h3>Trip Summary</h3>
                            <p>{generatedItinerary.summary}</p>
                            <div className="summary-details">
                                <div className="detail-item">
                                    <span className="detail-icon">📍</span>
                                    <span className="detail-label">Destination:</span>
                                    <span className="detail-value">{tripData.destination}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-icon">📅</span>
                                    <span className="detail-label">Duration:</span>
                                    <span className="detail-value">
                                        {tripData.startDate} - {tripData.endDate}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-icon">👥</span>
                                    <span className="detail-label">Travelers:</span>
                                    <span className="detail-value">{tripData.travelers}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-icon">💰</span>
                                    <span className="detail-label">Budget:</span>
                                    <span className="detail-value">{tripData.budget}</span>
                                </div>
                            </div>
                        </div>

                        {/* Daily Itinerary */}
                        <div className="itinerary-section">
                            <h3>Daily Itinerary</h3>
                            {generatedItinerary.dailyItinerary?.map((day, index) => (
                                <div key={index} className="day-card">
                                    <div className="day-header">
                                        <h4>Day {day.day}</h4>
                                        <span className="day-date">{day.date}</span>
                                    </div>
                                    <div className="activities-list">
                                        {day.activities?.map((activity, actIndex) => (
                                            <div key={actIndex} className="activity-item">
                                                <div className="activity-time">{activity.time}</div>
                                                <div className="activity-details">
                                                    <h5>{activity.title}</h5>
                                                    <p>{activity.description}</p>
                                                    <div className="activity-meta">
                                                        <span>⏱️ {activity.duration}</span>
                                                        <span>💵 {activity.cost}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Hotels */}
                        {generatedItinerary.hotels && generatedItinerary.hotels.length > 0 && (
                            <div className="itinerary-section">
                                <h3>Recommended Hotels</h3>
                                <div className="hotels-grid">
                                    {generatedItinerary.hotels.map((hotel, index) => (
                                        <div key={index} className="hotel-card">
                                            <h4>{hotel.name}</h4>
                                            <div className="hotel-rating">⭐ {hotel.rating}</div>
                                            <p className="hotel-location">📍 {hotel.location}</p>
                                            <p className="hotel-price">{hotel.pricePerNight} / night</p>
                                            <div className="hotel-amenities">
                                                {hotel.amenities?.map((amenity, i) => (
                                                    <span key={i} className="amenity-tag">{amenity}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Budget Breakdown */}
                        {generatedItinerary.budgetBreakdown && (
                            <div className="itinerary-section">
                                <h3>Budget Breakdown</h3>
                                <div className="budget-card">
                                    {Object.entries(generatedItinerary.budgetBreakdown).map(([key, value]) => (
                                        <div key={key} className="budget-item">
                                            <span className="budget-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                            <span className="budget-value">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tips */}
                        {generatedItinerary.tips && generatedItinerary.tips.length > 0 && (
                            <div className="itinerary-section">
                                <h3>Travel Tips</h3>
                                <div className="tips-list">
                                    {generatedItinerary.tips.map((tip, index) => (
                                        <div key={index} className="tip-item">
                                            <span className="tip-icon">💡</span>
                                            <span>{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripPlanner;
