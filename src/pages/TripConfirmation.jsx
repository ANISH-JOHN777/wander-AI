import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';
import { useTripConfirmation } from '../context/TripConfirmationContext';
import { Check, AlertCircle, Car, Hotel, Calendar, Users, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import './TripConfirmation.css';

const TripConfirmation = () => {
    const navigate = useNavigate();
    const { createTrip } = useTripContext();
    const { confirmationData, isComplete, clearConfirmationData } = useTripConfirmation();

    const handleCreateTrip = async () => {
        if (!isComplete()) {
            alert('Please complete all required selections before creating your trip');
            return;
        }

        try {
            const tripData = {
                ...confirmationData.tripInfo,
                selectedVehicle: confirmationData.selectedVehicle,
                vehicleType: confirmationData.vehicleType,
                selectedHotel: confirmationData.selectedHotel,
                accommodationType: confirmationData.accommodationType,
                selectedTourPackage: confirmationData.selectedTourPackage,
                selectedRestaurants: confirmationData.selectedRestaurants,
                customDayPlan: confirmationData.customDayPlan,
                status: 'confirmed'
            };

            const newTrip = await createTrip(tripData);

            if (newTrip) {
                clearConfirmationData();
                alert('Trip created successfully!');
                navigate('/saved-trips');
            }
        } catch (error) {
            console.error('Error creating trip:', error);
            alert('Failed to create trip. Please try again.');
        }
    };

    const getCompletionStatus = () => {
        const steps = [
            { name: 'Trip Info', complete: !!confirmationData.tripInfo },
            { name: 'Vehicle', complete: !!confirmationData.selectedVehicle },
            { name: 'Accommodation', complete: !!confirmationData.selectedHotel },
        ];
        const completed = steps.filter(s => s.complete).length;
        return { steps, completed, total: steps.length };
    };

    const status = getCompletionStatus();

    return (
        <div className="trip-confirmation-page">
            <div className="confirmation-container">
                {/* Header */}
                <div className="confirmation-header">
                    <button className="back-btn" onClick={() => navigate('/overview')}>
                        <ArrowLeft size={20} />
                        Back
                    </button>
                    <h1>Review & Confirm Your Trip</h1>
                    <p className="subtitle">Review your selections and create your trip</p>
                </div>

                {/* Progress Indicator */}
                <div className="progress-section">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${(status.completed / status.total) * 100}%` }}
                        ></div>
                    </div>
                    <p className="progress-text">
                        {status.completed} of {status.total} required steps completed
                    </p>
                </div>

                {/* Trip Information */}
                {confirmationData.tripInfo ? (
                    <div className="confirmation-section">
                        <div className="section-header">
                            <Check size={24} className="check-icon" />
                            <h2>Trip Information</h2>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <MapPin size={18} />
                                <div>
                                    <span className="label">Destination</span>
                                    <span className="value">{confirmationData.tripInfo.destination}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <Calendar size={18} />
                                <div>
                                    <span className="label">Dates</span>
                                    <span className="value">
                                        {new Date(confirmationData.tripInfo.startDate).toLocaleDateString()} - {new Date(confirmationData.tripInfo.endDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="info-item">
                                <Users size={18} />
                                <div>
                                    <span className="label">Travelers</span>
                                    <span className="value">{confirmationData.tripInfo.members || 1} {confirmationData.tripInfo.travelType}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="confirmation-section incomplete">
                        <div className="section-header">
                            <AlertCircle size={24} className="alert-icon" />
                            <h2>Trip Information</h2>
                        </div>
                        <p className="incomplete-message">Please create a trip first</p>
                        <button className="btn btn-primary" onClick={() => navigate('/trip-creator')}>
                            Create Trip
                        </button>
                    </div>
                )}

                {/* Vehicle Selection */}
                {confirmationData.selectedVehicle ? (
                    <div className="confirmation-section">
                        <div className="section-header">
                            <Check size={24} className="check-icon" />
                            <h2>Selected Vehicle</h2>
                        </div>
                        <div className="selection-card">
                            <Car size={24} />
                            <div className="selection-details">
                                <h3>{confirmationData.selectedVehicle.name || confirmationData.selectedVehicle.airline || confirmationData.selectedVehicle.operator}</h3>
                                <p>{confirmationData.vehicleType}</p>
                                <span className="price">{confirmationData.selectedVehicle.price || confirmationData.selectedVehicle.pricePerDay || confirmationData.selectedVehicle.cost}</span>
                            </div>
                            <button className="change-btn" onClick={() => navigate('/bookings/transport')}>
                                Change
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="confirmation-section incomplete">
                        <div className="section-header">
                            <AlertCircle size={24} className="alert-icon" />
                            <h2>Vehicle Selection</h2>
                        </div>
                        <p className="incomplete-message">No vehicle selected</p>
                        <button className="btn btn-primary" onClick={() => navigate('/bookings/transport')}>
                            Select Vehicle
                        </button>
                    </div>
                )}

                {/* Accommodation Selection */}
                {confirmationData.selectedHotel ? (
                    <div className="confirmation-section">
                        <div className="section-header">
                            <Check size={24} className="check-icon" />
                            <h2>Selected Accommodation</h2>
                        </div>
                        <div className="selection-card">
                            <Hotel size={24} />
                            <div className="selection-details">
                                <h3>{confirmationData.selectedHotel.name}</h3>
                                <p>{confirmationData.accommodationType} - {confirmationData.selectedHotel.type || confirmationData.selectedHotel.location}</p>
                                <span className="price">{confirmationData.selectedHotel.price}</span>
                            </div>
                            <button className="change-btn" onClick={() => navigate('/bookings/hotels')}>
                                Change
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="confirmation-section incomplete">
                        <div className="section-header">
                            <AlertCircle size={24} className="alert-icon" />
                            <h2>Accommodation Selection</h2>
                        </div>
                        <p className="incomplete-message">No accommodation selected</p>
                        <button className="btn btn-primary" onClick={() => navigate('/bookings/hotels')}>
                            Select Accommodation
                        </button>
                    </div>
                )}

                {/* Optional: Tour Package */}
                {confirmationData.selectedTourPackage && (
                    <div className="confirmation-section">
                        <div className="section-header">
                            <Check size={24} className="check-icon" />
                            <h2>Tour Package (Optional)</h2>
                        </div>
                        <div className="selection-card">
                            <div className="selection-details">
                                <h3>{confirmationData.selectedTourPackage.name}</h3>
                                <p>{confirmationData.selectedTourPackage.duration}</p>
                                <span className="price">{confirmationData.selectedTourPackage.price}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Trip Button */}
                <div className="action-section">
                    {isComplete() ? (
                        <button className="btn btn-success btn-large" onClick={handleCreateTrip}>
                            <Check size={24} />
                            Create Trip
                            <ArrowRight size={20} />
                        </button>
                    ) : (
                        <div className="incomplete-notice">
                            <AlertCircle size={20} />
                            <p>Complete all required selections to create your trip</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TripConfirmation;
