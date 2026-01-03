import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MapPin, Calendar, Users, Sparkles, Download, Save, Check,
    Clock, Hotel, Car, DollarSign, TrendingUp, Info, Star, Navigation
} from 'lucide-react';
import { getMockTripData, calculateTripDays, getBudgetEstimate } from '../utils/tripMockData';
import { generateProfessionalPDF } from '../utils/pdfGenerator';
import { useTripContext } from '../context/TripContext';
import './AITripCreator.css';

const AITripCreator = () => {
    const navigate = useNavigate();
    const { createTrip } = useTripContext();
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        travelType: 'solo',
        transportMode: 'own',
    });

    const [errors, setErrors] = useState({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [tripGenerated, setTripGenerated] = useState(false);
    const [generatedTrip, setGeneratedTrip] = useState(null);
    const [selectedDay, setSelectedDay] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [savedTripId, setSavedTripId] = useState(null);

    const indianCities = [
        { value: '', label: 'Select a destination' },
        { value: 'Mumbai, Maharashtra', label: 'Mumbai, Maharashtra' },
        { value: 'Goa, Goa', label: 'Goa, Goa' },
        { value: 'Jaipur, Rajasthan', label: 'Jaipur, Rajasthan' },
        { value: 'Manali, Himachal Pradesh', label: 'Manali, Himachal Pradesh' },
        { value: 'Udaipur, Rajasthan', label: 'Udaipur, Rajasthan' },
        { value: 'Varanasi, Uttar Pradesh', label: 'Varanasi, Uttar Pradesh' },
        { value: 'Agra, Uttar Pradesh', label: 'Agra, Uttar Pradesh' },
        { value: 'Shimla, Himachal Pradesh', label: 'Shimla, Himachal Pradesh' },
        { value: 'Darjeeling, West Bengal', label: 'Darjeeling, West Bengal' },
        { value: 'Kochi, Kerala', label: 'Kochi, Kerala' },
    ];

    const travelTypes = [
        { value: 'solo', label: 'Solo', icon: '🧳', members: 1 },
        { value: 'couple', label: 'Couple', icon: '❤️', members: 2 },
        { value: 'group', label: 'Group', icon: '👥', members: 4 },
    ];

    const transportModes = [
        { value: 'own', label: 'Own Vehicle', icon: '🚗', description: 'Using your own car/bike' },
        { value: 'rented', label: 'Rented Vehicle', icon: '🚙', description: 'Rent a car or bike' },
        { value: 'public', label: 'Public Transport', icon: '🚌', description: 'Buses, trains, metro' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.destination || formData.destination === '') {
            newErrors.destination = 'Please select a destination';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Please select a start date';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'Please select an end date';
        }

        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (start < today) {
                newErrors.startDate = 'Start date cannot be in the past';
            }

            if (end < start) {
                newErrors.endDate = 'End date must be after start date';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGenerateTrip = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsGenerating(true);

        // Simulate AI generation delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockData = getMockTripData(formData.destination);
        const tripDays = calculateTripDays(formData.startDate, formData.endDate);
        const budgetEstimate = getBudgetEstimate(formData.destination, formData.travelType, tripDays);
        const travelers = travelTypes.find(t => t.value === formData.travelType)?.members || 1;

        setGeneratedTrip({
            ...formData,
            mockData,
            tripDays,
            budgetEstimate,
            travelers
        });

        setTripGenerated(true);
        setIsGenerating(false);
        setSelectedDay(1);

        // Reset save state for new trip
        setIsSaved(false);
        setSavedTripId(null);

        // Scroll to results
        setTimeout(() => {
            document.getElementById('trip-results')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSaveTrip = async () => {
        if (!generatedTrip || isSaved) return;

        setIsSaving(true);

        try {
            const travelers = travelTypes.find(t => t.value === formData.travelType)?.members || 1;

            // Create trip data in the format expected by TripContext
            const tripData = {
                destination: formData.destination,
                start_date: formData.startDate,
                end_date: formData.endDate,
                travel_type: formData.travelType,
                transport_mode: formData.transportMode,
                travelers: travelers,
                status: 'planned',
            };

            console.log('💾 Saving AI-generated trip...', tripData);

            // Save trip using TripContext
            const savedTrip = await createTrip(tripData);

            console.log('✅ Trip saved successfully!', savedTrip);

            setIsSaved(true);
            setSavedTripId(savedTrip.id);

            // Show success message
            alert('Trip saved successfully! You can view it in Saved Trips.');
        } catch (error) {
            console.error('❌ Error saving trip:', error);
            alert('Failed to save trip. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };



    const handleDownloadPDF = () => {
        if (!generatedTrip) return;
        generateProfessionalPDF(formData, generatedTrip);
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <div className="ai-trip-creator-page">
            {/* Header */}
            <div className="ai-creator-header">
                <div className="container">
                    <h1>
                        <Sparkles size={32} />
                        AI Trip Creator
                    </h1>
                    <p>Get instant detailed itinerary powered by AI</p>
                </div>
            </div>

            {/* Form Section */}
            <section className="form-section">
                <div className="container">
                    <div className="form-card">
                        <h2>Tell us about your trip</h2>
                        <form onSubmit={handleGenerateTrip}>
                            {/* Destination */}
                            <div className="form-group">
                                <label htmlFor="destination">
                                    <MapPin size={18} />
                                    Destination
                                </label>
                                <select
                                    id="destination"
                                    name="destination"
                                    value={formData.destination}
                                    onChange={handleChange}
                                    className={errors.destination ? 'error' : ''}
                                    disabled={isGenerating}
                                >
                                    {indianCities.map(city => (
                                        <option key={city.value} value={city.value}>
                                            {city.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.destination && <span className="error-text">{errors.destination}</span>}
                            </div>

                            {/* Dates */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="startDate">
                                        <Calendar size={18} />
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        min={getTodayDate()}
                                        className={errors.startDate ? 'error' : ''}
                                        disabled={isGenerating}
                                    />
                                    {errors.startDate && <span className="error-text">{errors.startDate}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="endDate">
                                        <Calendar size={18} />
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        min={formData.startDate || getTodayDate()}
                                        className={errors.endDate ? 'error' : ''}
                                        disabled={isGenerating}
                                    />
                                    {errors.endDate && <span className="error-text">{errors.endDate}</span>}
                                </div>
                            </div>

                            {/* Travel Type */}
                            <div className="form-group">
                                <label>
                                    <Users size={18} />
                                    Travel Type
                                </label>
                                <div className="travel-type-options">
                                    {travelTypes.map(type => (
                                        <label
                                            key={type.value}
                                            className={`travel-option ${formData.travelType === type.value ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="travelType"
                                                value={type.value}
                                                checked={formData.travelType === type.value}
                                                onChange={handleChange}
                                                disabled={isGenerating}
                                            />
                                            <span className="option-icon">{type.icon}</span>
                                            <span className="option-label">{type.label}</span>
                                            <span className="option-members">{type.members} {type.members === 1 ? 'Person' : 'People'}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Transport Mode */}
                            <div className="form-group">
                                <label>
                                    <Car size={18} />
                                    Transport Mode
                                </label>
                                <div className="travel-type-options">
                                    {transportModes.map(mode => (
                                        <label
                                            key={mode.value}
                                            className={`travel-option ${formData.transportMode === mode.value ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="transportMode"
                                                value={mode.value}
                                                checked={formData.transportMode === mode.value}
                                                onChange={handleChange}
                                                disabled={isGenerating}
                                            />
                                            <span className="option-icon">{mode.icon}</span>
                                            <span className="option-label">{mode.label}</span>
                                            <span className="option-description">{mode.description}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn btn-primary btn-large"
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <span className="spinner"></span>
                                        Generating Your Perfect Trip...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Generate Trip with AI
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            {tripGenerated && generatedTrip && (
                <section id="trip-results" className="results-section">
                    <div className="container">
                        {/* Action Buttons */}
                        <div className="results-header">
                            <h2>Your AI-Generated Trip Plan</h2>
                            <div className="header-actions">
                                <button
                                    className={`btn ${isSaved ? 'btn-secondary' : 'btn-primary'}`}
                                    onClick={handleSaveTrip}
                                    disabled={isSaving || isSaved}
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="spinner"></span>
                                            Saving...
                                        </>
                                    ) : isSaved ? (
                                        <>
                                            <Check size={20} />
                                            Saved to Trips
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            Save Trip
                                        </>
                                    )}
                                </button>
                                <button className="btn btn-success" onClick={handleDownloadPDF}>
                                    <Download size={20} />
                                    Download PDF
                                </button>
                            </div>
                        </div>

                        {/* Overview Cards */}
                        <div className="overview-grid">
                            <div className="overview-card">
                                <div className="card-icon">
                                    <Calendar size={24} />
                                </div>
                                <div className="card-content">
                                    <h3>Duration</h3>
                                    <p className="card-value">{generatedTrip.tripDays} Days</p>
                                    <p className="card-detail">
                                        {new Date(formData.startDate).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })} - {new Date(formData.endDate).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="overview-card">
                                <div className="card-icon">
                                    <Users size={24} />
                                </div>
                                <div className="card-content">
                                    <h3>Travelers</h3>
                                    <p className="card-value">{generatedTrip.travelers} {generatedTrip.travelers === 1 ? 'Person' : 'People'}</p>
                                    <p className="card-detail">{formData.travelType.charAt(0).toUpperCase() + formData.travelType.slice(1)} Trip</p>
                                </div>
                            </div>

                            <div className="overview-card">
                                <div className="card-icon">
                                    <MapPin size={24} />
                                </div>
                                <div className="card-content">
                                    <h3>Distance</h3>
                                    <p className="card-value">{generatedTrip.mockData.totalKm} km</p>
                                    <p className="card-detail">Total coverage</p>
                                </div>
                            </div>

                            <div className="overview-card">
                                <div className="card-icon">
                                    <DollarSign size={24} />
                                </div>
                                <div className="card-content">
                                    <h3>Budget</h3>
                                    <p className="card-value">₹{generatedTrip.budgetEstimate.min.toLocaleString()} - ₹{generatedTrip.budgetEstimate.max.toLocaleString()}</p>
                                    <p className="card-detail">₹{generatedTrip.budgetEstimate.perDay.min.toLocaleString()} - ₹{generatedTrip.budgetEstimate.perDay.max.toLocaleString()} per day</p>
                                </div>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="highlights-section">
                            <h3>
                                <TrendingUp size={20} />
                                Trip Highlights
                            </h3>
                            <div className="highlights-tags">
                                {generatedTrip.mockData.highlights.map((highlight, index) => (
                                    <span key={index} className="highlight-tag">{highlight}</span>
                                ))}
                            </div>
                            <div className="best-time">
                                <Info size={16} />
                                <span>Best Time to Visit: {generatedTrip.mockData.bestTime}</span>
                            </div>
                        </div>

                        {/* Day-wise Itinerary */}
                        <div className="itinerary-section">
                            <h3>Day-wise Itinerary</h3>

                            {/* Day Tabs */}
                            <div className="day-tabs">
                                {generatedTrip.mockData.dayPlans.slice(0, generatedTrip.tripDays).map((day) => (
                                    <button
                                        key={day.day}
                                        className={`day-tab ${selectedDay === day.day ? 'active' : ''}`}
                                        onClick={() => setSelectedDay(day.day)}
                                    >
                                        <span className="tab-number">Day {day.day}</span>
                                        <span className="tab-title">{day.title}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Day Content */}
                            {generatedTrip.mockData.dayPlans
                                .filter(day => day.day === selectedDay)
                                .map((day) => (
                                    <div key={day.day} className="day-content">
                                        <div className="day-header">
                                            <h4>Day {day.day}: {day.title}</h4>
                                            <span className="activity-badge">{day.activities.length} Activities</span>
                                        </div>

                                        <div className="activities-list">
                                            {day.activities.map((activity, index) => (
                                                <div key={index} className="activity-item">
                                                    <div className="activity-time">
                                                        <Clock size={18} />
                                                        <span className="time">{activity.time}</span>
                                                        <span className="duration">{activity.duration}</span>
                                                    </div>
                                                    <div className="activity-details">
                                                        <div className="activity-marker"></div>
                                                        <div className="activity-info">
                                                            <h5>{activity.place}</h5>
                                                            <p>{activity.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* Hotels */}
                        <div className="hotels-section">
                            <h3>
                                <Hotel size={24} />
                                Recommended Hotels
                            </h3>
                            <div className="hotels-grid">
                                {generatedTrip.mockData.hotels.map((hotel, index) => (
                                    <div key={index} className="hotel-card">
                                        <div className="hotel-header">
                                            <div>
                                                <h4>{hotel.name}</h4>
                                                <span className="hotel-type">{hotel.type}</span>
                                            </div>
                                            <div className="hotel-rating">
                                                <Star size={16} fill="currentColor" />
                                                <span>{hotel.rating}</span>
                                            </div>
                                        </div>
                                        <div className="hotel-footer">
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

                        {/* Transport */}
                        <div className="transport-section">
                            <h3>
                                <Car size={24} />
                                Local Transport Options
                            </h3>
                            <div className="transport-grid">
                                {generatedTrip.mockData.transport.map((transport, index) => (
                                    <div key={index} className="transport-card">
                                        <div className="transport-header">
                                            <h4>{transport.mode}</h4>
                                            <span className="transport-cost">{transport.cost}</span>
                                        </div>
                                        <p>{transport.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Download CTA */}
                        <div className="download-cta">
                            <h3>Ready to start your journey?</h3>
                            <p>Download your complete itinerary as a PDF to access offline</p>
                            <button className="btn btn-primary btn-large" onClick={handleDownloadPDF}>
                                <Download size={24} />
                                Download Complete Itinerary (PDF)
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default AITripCreator;
