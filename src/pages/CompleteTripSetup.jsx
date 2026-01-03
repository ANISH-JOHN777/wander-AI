import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';
import {
    MapPin, Calendar, Users, Car, Hotel, Package,
    DollarSign, CheckCircle, ArrowRight, ArrowLeft,
    Plane, Home, Utensils, Clock
} from 'lucide-react';
import './CompleteTripSetup.css';

const CompleteTripSetup = () => {
    const navigate = useNavigate();
    const { createTrip } = useTripContext();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Basic Information
        destination: '',
        startDate: '',
        endDate: '',
        travelType: 'solo',
        members: 1,
        transportMode: 'own',

        // Step 2: Transportation
        vehicleType: '',
        vehicleName: '',
        vehiclePrice: '',

        // Step 3: Accommodation
        accommodationType: '',
        accommodationName: '',
        accommodationPrice: '',

        // Step 4: Activities & Dining
        tourPackage: '',
        tourPackagePrice: '',
        restaurants: '',

        // Step 5: Budget & Preferences
        budget: '',
        preferences: '',
        notes: ''
    });

    const [errors, setErrors] = useState({});

    const totalSteps = 5;

    const travelTypes = [
        { value: 'solo', label: 'Solo', members: 1 },
        { value: 'couple', label: 'Couple', members: 2 },
        { value: 'group', label: 'Group', members: 4 }
    ];

    const transportModes = [
        { value: 'own', label: 'Own Vehicle' },
        { value: 'rented', label: 'Rented Vehicle' },
        { value: 'public', label: 'Public Transport' }
    ];

    const vehicleTypes = [
        { value: 'flight', label: 'Flight', icon: Plane },
        { value: 'train', label: 'Train', icon: Car },
        { value: 'bus', label: 'Bus', icon: Car },
        { value: 'car', label: 'Rental Car', icon: Car },
        { value: 'bike', label: 'Rental Bike', icon: Car }
    ];

    const accommodationTypes = [
        { value: 'hotel', label: 'Hotel', icon: Hotel },
        { value: 'airbnb', label: 'Airbnb', icon: Home },
        { value: 'resort', label: 'Resort', icon: Hotel }
    ];

    const indianCities = [
        'Mumbai, Maharashtra',
        'Goa, Goa',
        'Jaipur, Rajasthan',
        'Manali, Himachal Pradesh',
        'Udaipur, Rajasthan',
        'Varanasi, Uttar Pradesh',
        'Agra, Uttar Pradesh',
        'Shimla, Himachal Pradesh',
        'Darjeeling, West Bengal',
        'Kochi, Kerala'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Update members based on travel type
        if (name === 'travelType') {
            const type = travelTypes.find(t => t.value === value);
            setFormData(prev => ({
                ...prev,
                members: type?.members || 1
            }));
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 1:
                if (!formData.destination) newErrors.destination = 'Please select a destination';
                if (!formData.startDate) newErrors.startDate = 'Please select start date';
                if (!formData.endDate) newErrors.endDate = 'Please select end date';
                if (formData.startDate && formData.endDate) {
                    const start = new Date(formData.startDate);
                    const end = new Date(formData.endDate);
                    if (end < start) newErrors.endDate = 'End date must be after start date';
                }
                break;
            case 2:
                if (!formData.vehicleType) newErrors.vehicleType = 'Please select vehicle type';
                if (!formData.vehicleName) newErrors.vehicleName = 'Please enter vehicle details';
                break;
            case 3:
                if (!formData.accommodationType) newErrors.accommodationType = 'Please select accommodation type';
                if (!formData.accommodationName) newErrors.accommodationName = 'Please enter accommodation name';
                break;
            case 4:
                // Optional fields, no validation required
                break;
            case 5:
                if (!formData.budget) newErrors.budget = 'Please enter estimated budget';
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) {
            return;
        }

        try {
            const tripData = {
                destination: formData.destination,
                start_date: formData.startDate,
                end_date: formData.endDate,
                travel_type: formData.travelType,
                transport_mode: formData.transportMode,
                travelers: formData.members,
                status: 'planned',
                setupType: 'complete', // Tag for complete setup

                // Additional details
                vehicleDetails: {
                    type: formData.vehicleType,
                    name: formData.vehicleName,
                    price: formData.vehiclePrice
                },
                accommodationDetails: {
                    type: formData.accommodationType,
                    name: formData.accommodationName,
                    price: formData.accommodationPrice
                },
                activitiesDetails: {
                    tourPackage: formData.tourPackage,
                    tourPackagePrice: formData.tourPackagePrice,
                    restaurants: formData.restaurants
                },
                budgetDetails: {
                    estimatedBudget: formData.budget,
                    preferences: formData.preferences,
                    notes: formData.notes
                }
            };

            const newTrip = await createTrip(tripData);

            if (newTrip) {
                alert('Complete trip setup created successfully!');
                navigate('/saved-trips');
            }
        } catch (error) {
            console.error('Error creating trip:', error);
            alert('Failed to create trip. Please try again.');
        }
    };

    const renderStepIndicator = () => (
        <div className="step-indicator">
            {[1, 2, 3, 4, 5].map(step => (
                <div key={step} className="step-item">
                    <div className={`step-circle ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
                        {currentStep > step ? <CheckCircle size={20} /> : step}
                    </div>
                    <span className="step-label">
                        {step === 1 && 'Basic Info'}
                        {step === 2 && 'Transport'}
                        {step === 3 && 'Stay'}
                        {step === 4 && 'Activities'}
                        {step === 5 && 'Budget'}
                    </span>
                    {step < 5 && <div className={`step-line ${currentStep > step ? 'completed' : ''}`}></div>}
                </div>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="form-step">
            <h2>Basic Trip Information</h2>
            <p className="step-description">Let's start with the essentials of your trip</p>

            <div className="form-group">
                <label>
                    <MapPin size={18} />
                    Destination
                </label>
                <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className={errors.destination ? 'error' : ''}
                >
                    <option value="">Select destination</option>
                    {indianCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                {errors.destination && <span className="error-text">{errors.destination}</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>
                        <Calendar size={18} />
                        Start Date
                    </label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={errors.startDate ? 'error' : ''}
                    />
                    {errors.startDate && <span className="error-text">{errors.startDate}</span>}
                </div>

                <div className="form-group">
                    <label>
                        <Calendar size={18} />
                        End Date
                    </label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                        className={errors.endDate ? 'error' : ''}
                    />
                    {errors.endDate && <span className="error-text">{errors.endDate}</span>}
                </div>
            </div>

            <div className="form-group">
                <label>
                    <Users size={18} />
                    Travel Type
                </label>
                <div className="radio-group">
                    {travelTypes.map(type => (
                        <label key={type.value} className={`radio-card ${formData.travelType === type.value ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="travelType"
                                value={type.value}
                                checked={formData.travelType === type.value}
                                onChange={handleChange}
                            />
                            <span>{type.label}</span>
                            <small>{type.members} {type.members === 1 ? 'person' : 'people'}</small>
                        </label>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>
                    <Car size={18} />
                    Transport Mode
                </label>
                <div className="radio-group">
                    {transportModes.map(mode => (
                        <label key={mode.value} className={`radio-card ${formData.transportMode === mode.value ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="transportMode"
                                value={mode.value}
                                checked={formData.transportMode === mode.value}
                                onChange={handleChange}
                            />
                            <span>{mode.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="form-step">
            <h2>Transportation Details</h2>
            <p className="step-description">How will you travel to your destination?</p>

            <div className="form-group">
                <label>Vehicle Type</label>
                <div className="icon-grid">
                    {vehicleTypes.map(type => {
                        const Icon = type.icon;
                        return (
                            <label key={type.value} className={`icon-card ${formData.vehicleType === type.value ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="vehicleType"
                                    value={type.value}
                                    checked={formData.vehicleType === type.value}
                                    onChange={handleChange}
                                />
                                <Icon size={32} />
                                <span>{type.label}</span>
                            </label>
                        );
                    })}
                </div>
                {errors.vehicleType && <span className="error-text">{errors.vehicleType}</span>}
            </div>

            <div className="form-group">
                <label>Vehicle/Service Name</label>
                <input
                    type="text"
                    name="vehicleName"
                    value={formData.vehicleName}
                    onChange={handleChange}
                    placeholder="e.g., IndiGo 6E-123, Rajdhani Express"
                    className={errors.vehicleName ? 'error' : ''}
                />
                {errors.vehicleName && <span className="error-text">{errors.vehicleName}</span>}
            </div>

            <div className="form-group">
                <label>
                    <DollarSign size={18} />
                    Price (Optional)
                </label>
                <input
                    type="text"
                    name="vehiclePrice"
                    value={formData.vehiclePrice}
                    onChange={handleChange}
                    placeholder="e.g., ₹5,000"
                />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="form-step">
            <h2>Accommodation Details</h2>
            <p className="step-description">Where will you stay during your trip?</p>

            <div className="form-group">
                <label>Accommodation Type</label>
                <div className="icon-grid">
                    {accommodationTypes.map(type => {
                        const Icon = type.icon;
                        return (
                            <label key={type.value} className={`icon-card ${formData.accommodationType === type.value ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="accommodationType"
                                    value={type.value}
                                    checked={formData.accommodationType === type.value}
                                    onChange={handleChange}
                                />
                                <Icon size={32} />
                                <span>{type.label}</span>
                            </label>
                        );
                    })}
                </div>
                {errors.accommodationType && <span className="error-text">{errors.accommodationType}</span>}
            </div>

            <div className="form-group">
                <label>Accommodation Name</label>
                <input
                    type="text"
                    name="accommodationName"
                    value={formData.accommodationName}
                    onChange={handleChange}
                    placeholder="e.g., Taj Hotel, Cozy Apartment"
                    className={errors.accommodationName ? 'error' : ''}
                />
                {errors.accommodationName && <span className="error-text">{errors.accommodationName}</span>}
            </div>

            <div className="form-group">
                <label>
                    <DollarSign size={18} />
                    Price per Night (Optional)
                </label>
                <input
                    type="text"
                    name="accommodationPrice"
                    value={formData.accommodationPrice}
                    onChange={handleChange}
                    placeholder="e.g., ₹3,000/night"
                />
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="form-step">
            <h2>Activities & Dining</h2>
            <p className="step-description">Plan your experiences and meals (Optional)</p>

            <div className="form-group">
                <label>
                    <Package size={18} />
                    Tour Package (Optional)
                </label>
                <input
                    type="text"
                    name="tourPackage"
                    value={formData.tourPackage}
                    onChange={handleChange}
                    placeholder="e.g., City Heritage Tour"
                />
            </div>

            <div className="form-group">
                <label>
                    <DollarSign size={18} />
                    Tour Package Price (Optional)
                </label>
                <input
                    type="text"
                    name="tourPackagePrice"
                    value={formData.tourPackagePrice}
                    onChange={handleChange}
                    placeholder="e.g., ₹8,000"
                />
            </div>

            <div className="form-group">
                <label>
                    <Utensils size={18} />
                    Preferred Restaurants (Optional)
                </label>
                <textarea
                    name="restaurants"
                    value={formData.restaurants}
                    onChange={handleChange}
                    placeholder="List your preferred restaurants, separated by commas"
                    rows="3"
                />
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="form-step">
            <h2>Budget & Preferences</h2>
            <p className="step-description">Final details to complete your trip setup</p>

            <div className="form-group">
                <label>
                    <DollarSign size={18} />
                    Estimated Total Budget
                </label>
                <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g., ₹50,000"
                    className={errors.budget ? 'error' : ''}
                />
                {errors.budget && <span className="error-text">{errors.budget}</span>}
            </div>

            <div className="form-group">
                <label>
                    <Clock size={18} />
                    Preferences & Interests
                </label>
                <textarea
                    name="preferences"
                    value={formData.preferences}
                    onChange={handleChange}
                    placeholder="e.g., Adventure activities, Cultural sites, Food tours"
                    rows="3"
                />
            </div>

            <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special requirements or notes for your trip"
                    rows="3"
                />
            </div>
        </div>
    );

    return (
        <div className="complete-trip-setup">
            <div className="setup-container">
                <div className="setup-header">
                    <button className="back-btn" onClick={() => navigate('/home')}>
                        <ArrowLeft size={20} />
                        Back to Home
                    </button>
                    <h1>Complete Trip Setup</h1>
                    <p className="subtitle">Set up your entire trip in one go with all the details</p>
                </div>

                {renderStepIndicator()}

                <div className="setup-form">
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                    {currentStep === 5 && renderStep5()}

                    <div className="form-actions">
                        {currentStep > 1 && (
                            <button className="btn btn-secondary" onClick={handlePrevious}>
                                <ArrowLeft size={20} />
                                Previous
                            </button>
                        )}

                        {currentStep < totalSteps ? (
                            <button className="btn btn-primary" onClick={handleNext}>
                                Next
                                <ArrowRight size={20} />
                            </button>
                        ) : (
                            <button className="btn btn-success" onClick={handleSubmit}>
                                <CheckCircle size={20} />
                                Create Complete Trip
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompleteTripSetup;
