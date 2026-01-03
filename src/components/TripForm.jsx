import { useState } from 'react';
import './TripForm.css';

const TripForm = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState({
        destination: initialData.destination || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        budget: initialData.budget || '',
        travelers: initialData.travelers || 1,
        interests: initialData.interests || [],
        accommodation: initialData.accommodation || 'hotel',
        transportation: initialData.transportation || 'flight',
    });

    const interestOptions = [
        'Adventure', 'Culture', 'Food', 'Nature', 'Shopping',
        'Nightlife', 'History', 'Beach', 'Photography', 'Relaxation'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInterestToggle = (interest) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className="trip-form" onSubmit={handleSubmit}>
            <div className="form-section">
                <h3>Where do you want to go?</h3>
                <div className="form-group">
                    <label htmlFor="destination">Destination</label>
                    <input
                        type="text"
                        id="destination"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        placeholder="e.g., Paris, France"
                        required
                    />
                </div>
            </div>

            <div className="form-section">
                <h3>When are you traveling?</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>Trip Details</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="budget">Budget (USD)</label>
                        <select
                            id="budget"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select budget</option>
                            <option value="budget">Budget ($500-$1500)</option>
                            <option value="moderate">Moderate ($1500-$3000)</option>
                            <option value="luxury">Luxury ($3000+)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="travelers">Number of Travelers</label>
                        <input
                            type="number"
                            id="travelers"
                            name="travelers"
                            value={formData.travelers}
                            onChange={handleChange}
                            min="1"
                            max="20"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>What are your interests?</h3>
                <div className="interests-grid">
                    {interestOptions.map(interest => (
                        <button
                            key={interest}
                            type="button"
                            className={`interest-tag ${formData.interests.includes(interest) ? 'selected' : ''}`}
                            onClick={() => handleInterestToggle(interest)}
                        >
                            {interest}
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-section">
                <h3>Preferences</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="accommodation">Accommodation Type</label>
                        <select
                            id="accommodation"
                            name="accommodation"
                            value={formData.accommodation}
                            onChange={handleChange}
                        >
                            <option value="hotel">Hotel</option>
                            <option value="hostel">Hostel</option>
                            <option value="airbnb">Airbnb</option>
                            <option value="resort">Resort</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="transportation">Transportation</label>
                        <select
                            id="transportation"
                            name="transportation"
                            value={formData.transportation}
                            onChange={handleChange}
                        >
                            <option value="flight">Flight</option>
                            <option value="train">Train</option>
                            <option value="car">Car</option>
                            <option value="bus">Bus</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-large">
                    Generate Itinerary
                    <span className="btn-icon">✨</span>
                </button>
            </div>
        </form>
    );
};

export default TripForm;
