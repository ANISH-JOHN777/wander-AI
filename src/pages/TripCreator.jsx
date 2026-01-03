import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';
import { Luggage, Heart, Users, MapPin, Calendar, AlertTriangle, Sparkles, Target, Wallet, Smartphone, Map, Car } from 'lucide-react';
import './TripCreator.css';

const TripCreator = () => {
    const navigate = useNavigate();
    const { createTrip } = useTripContext();

    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        travelType: 'solo',
        transportMode: 'own', // 'own', 'rented', 'public'
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // India-focused cities
    const indianCities = [
        { value: '', label: 'Select a destination' },
        { value: 'Mumbai, Maharashtra', label: 'Mumbai, Maharashtra' },
        { value: 'Delhi, Delhi', label: 'Delhi, Delhi' },
        { value: 'Bangalore, Karnataka', label: 'Bangalore, Karnataka' },
        { value: 'Hyderabad, Telangana', label: 'Hyderabad, Telangana' },
        { value: 'Chennai, Tamil Nadu', label: 'Chennai, Tamil Nadu' },
        { value: 'Kolkata, West Bengal', label: 'Kolkata, West Bengal' },
        { value: 'Pune, Maharashtra', label: 'Pune, Maharashtra' },
        { value: 'Ahmedabad, Gujarat', label: 'Ahmedabad, Gujarat' },
        { value: 'Jaipur, Rajasthan', label: 'Jaipur, Rajasthan' },
        { value: 'Goa, Goa', label: 'Goa, Goa' },
        { value: 'Udaipur, Rajasthan', label: 'Udaipur, Rajasthan' },
        { value: 'Varanasi, Uttar Pradesh', label: 'Varanasi, Uttar Pradesh' },
        { value: 'Agra, Uttar Pradesh', label: 'Agra, Uttar Pradesh' },
        { value: 'Shimla, Himachal Pradesh', label: 'Shimla, Himachal Pradesh' },
        { value: 'Manali, Himachal Pradesh', label: 'Manali, Himachal Pradesh' },
        { value: 'Darjeeling, West Bengal', label: 'Darjeeling, West Bengal' },
        { value: 'Ooty, Tamil Nadu', label: 'Ooty, Tamil Nadu' },
        { value: 'Kochi, Kerala', label: 'Kochi, Kerala' },
        { value: 'Mysore, Karnataka', label: 'Mysore, Karnataka' },
        { value: 'Rishikesh, Uttarakhand', label: 'Rishikesh, Uttarakhand' },
    ];

    const travelTypes = [
        { value: 'solo', label: 'Solo', icon: Luggage, description: 'Traveling alone' },
        { value: 'couple', label: 'Couple', icon: Heart, description: 'Traveling with partner' },
        { value: 'group', label: 'Group', icon: Users, description: 'Traveling with friends/family' },
    ];

    const transportModes = [
        { value: 'own', label: 'Own Vehicle', icon: Car, description: 'Using your own car/bike' },
        { value: 'rented', label: 'Rented Vehicle', icon: Car, description: 'Rent a car or bike' },
        { value: 'public', label: 'Public Transport', icon: Map, description: 'Buses, trains, metro' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate destination
        if (!formData.destination || formData.destination === '') {
            newErrors.destination = 'Please select a destination';
        }

        // Validate start date
        if (!formData.startDate) {
            newErrors.startDate = 'Please select a start date';
        }

        // Validate end date
        if (!formData.endDate) {
            newErrors.endDate = 'Please select an end date';
        }

        // Validate date range
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

            if (end.getTime() === start.getTime()) {
                newErrors.endDate = 'Trip must be at least 1 day long';
            }
        }

        // Validate travel type
        if (!formData.travelType) {
            newErrors.travelType = 'Please select a travel type';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Calculate number of travelers based on travel type
            const travelers = formData.travelType === 'solo' ? 1 : formData.travelType === 'couple' ? 2 : 4;

            // Create trip data for navigation
            const tripData = {
                destination: formData.destination,
                startDate: formData.startDate,
                endDate: formData.endDate,
                travelType: formData.travelType,
                transportMode: formData.transportMode,
                members: travelers,
            };

            console.log('🚀 Generating trip details with data:', tripData);

            // Navigate to trip details page with the form data
            navigate('/trip-details', { state: { tripData } });
        } catch (error) {
            console.error('❌ Error:', error);
            setErrors({ submit: 'Failed to generate trip. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <div className="trip-creator-page">
            <div className="creator-header">
                <h1>Create Your Trip</h1>
                <p className="creator-subtitle">Plan your next adventure in India</p>
            </div>

            <div className="creator-container">
                <form className="trip-form" onSubmit={handleSubmit}>
                    {/* Destination Selection */}
                    <div className="form-group">
                        <label htmlFor="destination" className="form-label">
                            <span className="label-icon"><MapPin size={18} /></span>
                            Destination
                        </label>
                        <select
                            id="destination"
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            className={`form-select ${errors.destination ? 'error' : ''}`}
                            disabled={isSubmitting}
                        >
                            {indianCities.map(city => (
                                <option key={city.value} value={city.value}>
                                    {city.label}
                                </option>
                            ))}
                        </select>
                        {errors.destination && (
                            <span className="error-message">{errors.destination}</span>
                        )}
                    </div>

                    {/* Date Selection */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startDate" className="form-label">
                                <span className="label-icon"><Calendar size={18} /></span>
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                min={getTodayDate()}
                                className={`form-input ${errors.startDate ? 'error' : ''}`}
                                disabled={isSubmitting}
                            />
                            {errors.startDate && (
                                <span className="error-message">{errors.startDate}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="endDate" className="form-label">
                                <span className="label-icon"><Calendar size={18} /></span>
                                End Date
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                min={formData.startDate || getTodayDate()}
                                className={`form-input ${errors.endDate ? 'error' : ''}`}
                                disabled={isSubmitting}
                            />
                            {errors.endDate && (
                                <span className="error-message">{errors.endDate}</span>
                            )}
                        </div>
                    </div>

                    {/* Travel Type Selection */}
                    <div className="form-group">
                        <label className="form-label">
                            <span className="label-icon"><Users size={18} /></span>
                            Travel Type
                        </label>
                        <div className="travel-type-grid">
                            {travelTypes.map(type => (
                                <label
                                    key={type.value}
                                    className={`travel-type-card ${formData.travelType === type.value ? 'selected' : ''} ${isSubmitting ? 'disabled' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="travelType"
                                        value={type.value}
                                        checked={formData.travelType === type.value}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className="travel-type-input"
                                    />
                                    <div className="travel-type-icon">
                                        <type.icon size={32} />
                                    </div>
                                    <div className="travel-type-label">{type.label}</div>
                                    <div className="travel-type-description">{type.description}</div>
                                </label>
                            ))}
                        </div>
                        {errors.travelType && (
                            <span className="error-message">{errors.travelType}</span>
                        )}
                    </div>

                    {/* Transport Mode Selection */}
                    <div className="form-group">
                        <label className="form-label">
                            <span className="label-icon"><Car size={18} /></span>
                            Transport Mode
                        </label>
                        <div className="travel-type-grid">
                            {transportModes.map(mode => (
                                <label
                                    key={mode.value}
                                    className={`travel-type-card ${formData.transportMode === mode.value ? 'selected' : ''} ${isSubmitting ? 'disabled' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="transportMode"
                                        value={mode.value}
                                        checked={formData.transportMode === mode.value}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className="travel-type-input"
                                    />
                                    <div className="travel-type-icon">
                                        <mode.icon size={32} />
                                    </div>
                                    <div className="travel-type-label">{mode.label}</div>
                                    <div className="travel-type-description">{mode.description}</div>
                                </label>
                            ))}
                        </div>
                        {errors.transportMode && (
                            <span className="error-message">{errors.transportMode}</span>
                        )}
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="submit-error">
                            <span className="error-icon"><AlertTriangle size={18} /></span>
                            {errors.submit}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-primary btn-large"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Generating Trip...
                                </>
                            ) : (
                                <>
                                    Generate Trip with AI
                                    <span className="btn-icon"><Sparkles size={18} /></span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Info Panel */}
                <div className="info-panel">
                    <h3>Why Plan Your Trip?</h3>
                    <div className="info-list">
                        <div className="info-item">
                            <span className="info-icon"><Target size={24} /></span>
                            <div className="info-content">
                                <h4>Organized Travel</h4>
                                <p>Keep all your trip details in one place</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <span className="info-icon"><Wallet size={24} /></span>
                            <div className="info-content">
                                <h4>Budget Tracking</h4>
                                <p>Monitor your expenses throughout the trip</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <span className="info-icon"><Smartphone size={24} /></span>
                            <div className="info-content">
                                <h4>Easy Access</h4>
                                <p>Access your itinerary anytime, anywhere</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <span className="info-icon"><Map size={24} /></span>
                            <div className="info-content">
                                <h4>Day Planning</h4>
                                <p>Plan activities for each day of your trip</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripCreator;
