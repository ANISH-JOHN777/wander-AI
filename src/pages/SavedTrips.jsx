import { useState } from 'react';
import { useTripContext } from '../context/TripContext';
import { useStoryContext } from '../context/StoryContext';
import { useNavigate } from 'react-router-dom';
import { Plane, Luggage, Heart, Users, Calendar, CalendarDays, Check, Trash2, BookOpen, Plus } from 'lucide-react';
import './SavedTrips.css';

const SavedTrips = () => {
    const { trips, activeTrip, selectTrip, deleteTrip } = useTripContext();
    const { stories, deleteStory } = useStoryContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('trips'); // 'trips' or 'stories'

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Calculate trip duration
    const calculateDuration = (startDate, endDate) => {
        if (!startDate || !endDate) return 'N/A';
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return `${diffDays} ${diffDays === 1 ? 'Day' : 'Days'}`;
    };

    // Get travel type display
    const getTravelTypeInfo = (travelType) => {
        const types = {
            solo: { icon: Luggage, label: 'Solo' },
            couple: { icon: Heart, label: 'Couple' },
            group: { icon: Users, label: 'Group' },
        };
        return types[travelType] || { icon: Plane, label: 'Trip' };
    };

    // Handle trip selection
    const handleSelectTrip = (tripId) => {
        selectTrip(tripId);
        navigate('/overview');
    };

    // Handle trip deletion
    const handleDeleteTrip = (tripId) => {
        const tripToDelete = trips.find(t => t.id === tripId);
        if (!tripToDelete) return;

        const confirmMessage = `Are you sure you want to delete the trip to ${tripToDelete.destination}?`;
        if (!window.confirm(confirmMessage)) return;

        const isActiveTrip = activeTrip?.id === tripId;

        // Delete the trip
        deleteTrip(tripId);

        // If we deleted the active trip
        if (isActiveTrip) {
            const remainingTrips = trips.filter(t => t.id !== tripId);

            if (remainingTrips.length > 0) {
                // Switch to the first remaining trip
                selectTrip(remainingTrips[0].id);
                navigate('/overview');
            } else {
                // No trips left, redirect to TripCreator
                navigate('/trip-creator');
            }
        }
    };

    // Handle story viewing
    const handleViewStory = (story) => {
        // Select the trip associated with the story
        if (story.tripId) {
            selectTrip(story.tripId);
        }
        // Navigate to story creator to view/edit
        navigate('/smart-tools/story');
    };

    // Handle story deletion
    const handleDeleteStory = (storyId) => {
        const storyToDelete = stories.find(s => s.id === storyId);
        if (!storyToDelete) return;

        const confirmMessage = `Are you sure you want to delete "${storyToDelete.title}"?`;
        if (!window.confirm(confirmMessage)) return;

        deleteStory(storyId);
    };

    return (
        <div className="saved-page">
            {/* Sidebar */}
            <div className="saved-sidebar">
                <div className="sidebar-header">
                    <h2>Saved Info</h2>
                    <p>Your trips & stories</p>
                </div>

                <div className="sidebar-tabs">
                    <button
                        className={`sidebar-tab ${activeTab === 'trips' ? 'active' : ''}`}
                        onClick={() => setActiveTab('trips')}
                    >
                        <Plane size={20} />
                        <span>Trips</span>
                        <span className="tab-count">{trips.length}</span>
                    </button>
                    <button
                        className={`sidebar-tab ${activeTab === 'stories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stories')}
                    >
                        <BookOpen size={20} />
                        <span>Stories</span>
                        <span className="tab-count">{stories.length}</span>
                    </button>
                </div>

                <div className="sidebar-actions">
                    {activeTab === 'trips' && (
                        <button className="btn btn-primary btn-full" onClick={() => navigate('/trip-creator')}>
                            <Plus size={18} />
                            New Trip
                        </button>
                    )}
                    {activeTab === 'stories' && (
                        <button className="btn btn-primary btn-full" onClick={() => navigate('/smart-tools/story')}>
                            <Plus size={18} />
                            New Story
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="saved-content">
                {/* Trips Tab */}
                {activeTab === 'trips' && (
                    <div className="content-section">
                        <div className="content-header">
                            <div>
                                <h1>Saved Trips</h1>
                                <p className="content-subtitle">
                                    {trips.length === 0
                                        ? 'Start planning your first adventure!'
                                        : `You have ${trips.length} trip${trips.length !== 1 ? 's' : ''} saved`}
                                </p>
                            </div>
                        </div>

                        {trips.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon"><Plane size={64} /></div>
                                <h2>No Trips Yet</h2>
                                <p>Start planning your dream vacation with our trip planner</p>
                                <button className="btn btn-primary btn-large" onClick={() => navigate('/trip-creator')}>
                                    Create Your First Trip
                                </button>
                            </div>
                        ) : (
                            <div className="trips-grid">
                                {trips.map(trip => {
                                    const isActive = activeTrip?.id === trip.id;
                                    const travelTypeInfo = getTravelTypeInfo(trip.travelType);
                                    const duration = calculateDuration(trip.startDate, trip.endDate);
                                    const TravelIcon = travelTypeInfo.icon;

                                    return (
                                        <div
                                            key={trip.id}
                                            className={`trip-card ${isActive ? 'active' : ''}`}
                                        >
                                            {isActive && (
                                                <div className="active-badge">
                                                    <span className="badge-icon"><Check size={16} /></span>
                                                    Active Trip
                                                </div>
                                            )}

                                            <div className="trip-card-header">
                                                <div className="travel-type-badge">
                                                    <span className="badge-icon"><TravelIcon size={16} /></span>
                                                    <span className="badge-label">{travelTypeInfo.label}</span>
                                                </div>
                                                <div className="status-badge status-badge-small">
                                                    {trip.status || 'planned'}
                                                </div>
                                            </div>

                                            <div className="trip-card-content">
                                                <h2 className="trip-destination">{trip.destination}</h2>

                                                <div className="trip-details">
                                                    <div className="detail-item">
                                                        <span className="detail-icon"><Calendar size={16} /></span>
                                                        <div className="detail-text">
                                                            <span className="detail-label">Dates</span>
                                                            <span className="detail-value">
                                                                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="detail-item">
                                                        <span className="detail-icon"><CalendarDays size={16} /></span>
                                                        <div className="detail-text">
                                                            <span className="detail-label">Duration</span>
                                                            <span className="detail-value">{duration}</span>
                                                        </div>
                                                    </div>

                                                    <div className="detail-item">
                                                        <span className="detail-icon"><Users size={16} /></span>
                                                        <div className="detail-text">
                                                            <span className="detail-label">Travelers</span>
                                                            <span className="detail-value">{trip.travelers || 1}</span>
                                                        </div>
                                                    </div>

                                                    {trip.dayPlans && Object.keys(trip.dayPlans).length > 0 && (
                                                        <div className="detail-item">
                                                            <span className="detail-icon"><Check size={16} /></span>
                                                            <div className="detail-text">
                                                                <span className="detail-label">Activities</span>
                                                                <span className="detail-value">
                                                                    {Object.values(trip.dayPlans).reduce((total, day) => total + day.length, 0)} planned
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="trip-card-actions">
                                                {!isActive && (
                                                    <button
                                                        className="btn btn-primary btn-full"
                                                        onClick={() => handleSelectTrip(trip.id)}
                                                    >
                                                        Select Trip
                                                    </button>
                                                )}
                                                {isActive && (
                                                    <button
                                                        className="btn btn-secondary btn-full"
                                                        onClick={() => navigate('/overview')}
                                                    >
                                                        View Details
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-danger btn-full"
                                                    onClick={() => handleDeleteTrip(trip.id)}
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Stories Tab */}
                {activeTab === 'stories' && (
                    <div className="content-section">
                        <div className="content-header">
                            <div>
                                <h1>Saved Stories</h1>
                                <p className="content-subtitle">
                                    {stories.length === 0
                                        ? 'Create your first trip story!'
                                        : `You have ${stories.length} ${stories.length === 1 ? 'story' : 'stories'} saved`}
                                </p>
                            </div>
                        </div>

                        {stories.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon"><BookOpen size={64} /></div>
                                <h2>No Stories Yet</h2>
                                <p>Create and share your amazing travel stories</p>
                                <button className="btn btn-primary btn-large" onClick={() => navigate('/smart-tools/story')}>
                                    Create Your First Story
                                </button>
                            </div>
                        ) : (
                            <div className="stories-grid">
                                {stories.map(story => {
                                    // Get excerpt from content (first 150 characters)
                                    const excerpt = story.content
                                        ? story.content.substring(0, 150).replace(/[#*]/g, '') + '...'
                                        : 'No content available';

                                    return (
                                        <div key={story.id} className="story-card">
                                            <div className="story-cover">
                                                {story.image ? (
                                                    <img src={story.image} alt={story.title} />
                                                ) : (
                                                    <div className="story-cover-placeholder">
                                                        <BookOpen size={48} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="story-content">
                                                <h3>{story.title}</h3>
                                                <p className="story-destination">
                                                    <Plane size={14} />
                                                    {story.destination}
                                                </p>
                                                <p className="story-excerpt">{excerpt}</p>
                                                <p className="story-date">
                                                    <Calendar size={14} />
                                                    {formatDate(story.createdAt)}
                                                </p>
                                            </div>
                                            <div className="story-actions">
                                                <button
                                                    className="btn btn-secondary btn-full"
                                                    onClick={() => handleViewStory(story)}
                                                >
                                                    View Story
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-full"
                                                    onClick={() => handleDeleteStory(story.id)}
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedTrips;
