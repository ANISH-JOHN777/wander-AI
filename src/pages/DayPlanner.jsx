import { useState } from 'react';
import { useTripContext } from '../context/TripContext';
import { Navigate, Link } from 'react-router-dom';
import { AlertTriangle, Clock, Pencil, Trash2, FileText } from 'lucide-react';
import './DayPlanner.css';

const DayPlanner = () => {
    const { activeTrip, updateActiveTrip } = useTripContext();
    const [editingActivity, setEditingActivity] = useState(null);
    const [showAddForm, setShowAddForm] = useState({ dayIndex: null });

    // Redirect if no active trip
    if (!activeTrip) {
        return <Navigate to="/trip-creator" replace />;
    }

    // Helper to get field value (handles both camelCase and snake_case)
    const getField = (camelCase, snakeCase) => {
        return activeTrip[camelCase] || activeTrip[snakeCase];
    };

    const startDate = getField('startDate', 'start_date');
    const endDate = getField('endDate', 'end_date');

    // Check if dates are missing
    if (!startDate || !endDate) {
        return (
            <div className="day-planner-page">
                <div className="error-state">
                    <div className="error-icon"><AlertTriangle size={48} /></div>
                    <h2>Missing Trip Dates</h2>
                    <p>This trip doesn't have start and end dates set.</p>
                    <Link to="/overview" className="btn btn-primary">
                        Back to Overview
                    </Link>
                </div>
            </div>
        );
    }

    // Calculate days array from trip dates
    const calculateDays = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        const days = [];
        for (let i = 0; i < diffDays; i++) {
            const currentDate = new Date(start);
            currentDate.setDate(start.getDate() + i);

            days.push({
                dayNumber: i + 1,
                date: currentDate.toISOString().split('T')[0],
                displayDate: currentDate.toLocaleDateString('en-IN', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                }),
            });
        }
        return days;
    };

    const days = calculateDays();

    // Get or initialize day_plans from activeTrip
    const getDayPlans = () => {
        return activeTrip.day_plans || activeTrip.dayPlans || {};
    };

    // Add activity to a specific day
    const handleAddActivity = async (dayIndex, activityData) => {
        const dayPlans = getDayPlans();
        const dayKey = `day${dayIndex + 1}`;

        const newActivity = {
            id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...activityData,
            createdAt: new Date().toISOString(),
        };

        const updatedDayPlans = {
            ...dayPlans,
            [dayKey]: [...(dayPlans[dayKey] || []), newActivity],
        };

        console.log('💾 Saving day plan:', { dayKey, activity: newActivity });
        await updateActiveTrip({ day_plans: updatedDayPlans });
        console.log('✅ Day plan saved successfully');
        setShowAddForm({ dayIndex: null });
    };

    // Update activity
    const handleUpdateActivity = async (dayIndex, activityId, updatedData) => {
        const dayPlans = getDayPlans();
        const dayKey = `day${dayIndex + 1}`;

        const updatedDayPlans = {
            ...dayPlans,
            [dayKey]: dayPlans[dayKey].map(activity =>
                activity.id === activityId
                    ? { ...activity, ...updatedData, updatedAt: new Date().toISOString() }
                    : activity
            ),
        };

        console.log('📝 Updating activity:', { dayKey, activityId });
        await updateActiveTrip({ day_plans: updatedDayPlans });
        console.log('✅ Activity updated successfully');
        setEditingActivity(null);
    };

    // Delete activity
    const handleDeleteActivity = async (dayIndex, activityId) => {
        if (!window.confirm('Are you sure you want to delete this activity?')) {
            return;
        }

        const dayPlans = getDayPlans();
        const dayKey = `day${dayIndex + 1}`;

        const updatedDayPlans = {
            ...dayPlans,
            [dayKey]: dayPlans[dayKey].filter(activity => activity.id !== activityId),
        };

        console.log('🗑️ Deleting activity:', { dayKey, activityId });
        await updateActiveTrip({ day_plans: updatedDayPlans });
        console.log('✅ Activity deleted successfully');
    };

    // Get activities for a specific day
    const getActivitiesForDay = (dayIndex) => {
        const dayPlans = getDayPlans();
        const dayKey = `day${dayIndex + 1}`;
        return dayPlans[dayKey] || [];
    };

    return (
        <div className="day-planner-page">
            <div className="planner-header">
                <div>
                    <h1>Day-wise Planner</h1>
                    <p className="planner-subtitle">
                        {activeTrip.destination} • {days.length} {days.length === 1 ? 'Day' : 'Days'}
                    </p>
                </div>
                <Link to="/overview" className="btn btn-secondary">
                    Back to Overview
                </Link>
            </div>

            <div className="days-container">
                {days.map((day, dayIndex) => {
                    const activities = getActivitiesForDay(dayIndex);
                    const isAddingToThisDay = showAddForm.dayIndex === dayIndex;

                    return (
                        <div key={dayIndex} className="day-section">
                            <div className="day-header">
                                <div className="day-info">
                                    <h2>Day {day.dayNumber}</h2>
                                    <span className="day-date">{day.displayDate}</span>
                                </div>
                                <button
                                    className="btn btn-primary btn-small"
                                    onClick={() => setShowAddForm({ dayIndex })}
                                    disabled={isAddingToThisDay}
                                >
                                    + Add Activity
                                </button>
                            </div>

                            {/* Add Activity Form */}
                            {isAddingToThisDay && (
                                <ActivityForm
                                    onSubmit={(data) => handleAddActivity(dayIndex, data)}
                                    onCancel={() => setShowAddForm({ dayIndex: null })}
                                />
                            )}

                            {/* Activities List */}
                            <div className="activities-list">
                                {activities.length === 0 && !isAddingToThisDay && (
                                    <div className="empty-day">
                                        <span className="empty-icon"><FileText size={32} /></span>
                                        <p>No activities planned for this day</p>
                                    </div>
                                )}

                                {activities.map((activity) => {
                                    const isEditing = editingActivity?.activityId === activity.id && editingActivity?.dayIndex === dayIndex;

                                    if (isEditing) {
                                        return (
                                            <ActivityForm
                                                key={activity.id}
                                                initialData={activity}
                                                onSubmit={(data) => handleUpdateActivity(dayIndex, activity.id, data)}
                                                onCancel={() => setEditingActivity(null)}
                                                isEditing
                                            />
                                        );
                                    }

                                    return (
                                        <ActivityCard
                                            key={activity.id}
                                            activity={activity}
                                            onEdit={() => setEditingActivity({ dayIndex, activityId: activity.id })}
                                            onDelete={() => handleDeleteActivity(dayIndex, activity.id)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Activity Form Component
const ActivityForm = ({ initialData = {}, onSubmit, onCancel, isEditing = false }) => {
    const [formData, setFormData] = useState({
        place: initialData.place || '',
        time: initialData.time || '',
        notes: initialData.notes || '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.place.trim()) {
            newErrors.place = 'Place/Activity is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error submitting activity:', error);
            setErrors({ submit: 'Failed to save activity. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="activity-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="place">Place / Activity *</label>
                    <input
                        type="text"
                        id="place"
                        name="place"
                        value={formData.place}
                        onChange={handleChange}
                        placeholder="e.g., Visit Taj Mahal"
                        className={errors.place ? 'error' : ''}
                    />
                    {errors.place && <span className="error-message">{errors.place}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="time">Time (Optional)</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="notes">Notes (Optional)</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add any additional notes..."
                    rows="2"
                />
            </div>

            <div className="form-actions">
                <button type="button" className="btn btn-secondary btn-small" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-small" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Add'} Activity
                </button>
            </div>
            {errors.submit && (
                <div className="error-message">{errors.submit}</div>
            )}
        </form>
    );
};

// Activity Card Component
const ActivityCard = ({ activity, onEdit, onDelete }) => {
    return (
        <div className="activity-card">
            <div className="activity-content">
                {activity.time && (
                    <div className="activity-time">
                        <span className="time-icon"><Clock size={16} /></span>
                        {activity.time}
                    </div>
                )}
                <h3 className="activity-place">{activity.place}</h3>
                {activity.notes && (
                    <p className="activity-notes">{activity.notes}</p>
                )}
            </div>
            <div className="activity-actions">
                <button className="btn-icon" onClick={onEdit} title="Edit">
                    <Pencil size={16} />
                </button>
                <button className="btn-icon" onClick={onDelete} title="Delete">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default DayPlanner;
