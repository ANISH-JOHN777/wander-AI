import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Globe, Calendar, MapPin, Users, Plane, Clock,
    ArrowRight, Copy, Share2, ClipboardList,
    Download, Printer, Heart, ExternalLink
} from 'lucide-react';
import tripService from '../services/tripService';
import { useAuth } from '../context/AuthContext';
import './SharedTripView.css';

const SharedTripView = () => {
    const { shareToken } = useParams();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copying, setCopying] = useState(false);

    useEffect(() => {
        const fetchSharedTrip = async () => {
            setLoading(true);
            try {
                const { trip: tripData, error: tripError } = await tripService.getSharedTrip(shareToken);

                if (tripError) throw tripError;

                console.log('✅ Trip Data Loaded:', tripData);
                setTrip(tripData);

                // Increment view count
                await tripService.incrementViewCount(shareToken);
            } catch (err) {
                console.error('❌ Error fetching shared trip:', err);
                setError(err.message || 'Failed to load the shared trip.');
            } finally {
                setLoading(false);
            }
        };

        if (shareToken) {
            console.log('🔍 Fetching shared trip for token:', shareToken);
            fetchSharedTrip();
        }
    }, [shareToken]);

    const handleCopyTrip = async () => {
        if (!isAuthenticated) {
            // Store target for post-login redirect if needed
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            navigate('/auth');
            return;
        }

        setCopying(true);
        try {
            const attribution = trip.user_id ? 'a fellow traveler' : 'WanderAI';
            const { trip: newTrip, error: copyError } = await tripService.copySharedTrip(shareToken, attribution);

            if (copyError) throw copyError;

            alert('Trip copied successfully to your account!');
            navigate('/overview');
        } catch (err) {
            console.error('Error copying trip:', err);
            alert('Failed to copy trip. Please try again.');
        } finally {
            setCopying(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="shared-trip-loading">
                <div className="loader"></div>
                <p>Loading adventure details...</p>
            </div>
        );
    }

    if (error || !trip) {
        return (
            <div className="shared-trip-error">
                <div className="error-card">
                    <span className="error-icon">😕</span>
                    <h2>Trip Not Available</h2>
                    <p>{error || "This trip link might have expired or is set to private."}</p>
                    <Link to="/home" className="btn btn-primary">Go Home</Link>
                </div>
            </div>
        );
    }

    const startDate = trip.start_date || trip.startDate;
    const endDate = trip.end_date || trip.endDate;
    const travelType = trip.travel_type || trip.travelType;

    const formatDate = (dateStr) => {
        if (!dateStr) return 'TBD';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="shared-trip-container">
            {/* Header / Banner */}
            <div className="shared-header">
                <div className="header-bg" style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80&destination=${encodeURIComponent(trip.destination)}')`
                }}></div>
                <div className="header-content">
                    <div className="trip-meta">
                        <span className="shared-badge">Shared via WanderAI</span>
                        <div className="view-count">
                            <Clock size={16} />
                            <span>{trip.view_count || 0} views</span>
                        </div>
                    </div>
                    <h1>{trip.destination}</h1>
                    <div className="trip-specs">
                        <div className="spec-item">
                            <Calendar size={18} />
                            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
                        </div>
                        <div className="spec-item capitalize">
                            <Users size={18} />
                            <span>{travelType} Adventure</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="shared-actions-bar">
                <div className="actions-left">
                    <div className="creator-attribution">
                        <div className="avatar">
                            <MapPin size={20} />
                        </div>
                        <div className="attribution-text">
                            <h3>{trip.destination} Itinerary</h3>
                            <p>Created by a WanderAI User</p>
                        </div>
                    </div>
                </div>
                <div className="actions-right">
                    <button className="btn btn-outline" onClick={handlePrint}>
                        <Printer size={18} />
                        <span>Print</span>
                    </button>
                    <button
                        className="btn btn-primary copy-trip-btn"
                        onClick={handleCopyTrip}
                        disabled={copying}
                    >
                        <Copy size={18} />
                        <span>{copying ? 'Copying...' : 'Copy to My Trips'}</span>
                    </button>
                </div>
            </div>

            <div className="shared-main-content">
                <div className="content-grid">
                    {/* Itinerary Column */}
                    <div className="itinerary-column">
                        <div className="section-title">
                            <ClipboardList size={22} color="var(--color-primary)" />
                            <h2>Trip Itinerary</h2>
                        </div>

                        {(trip.day_plans || trip.dayPlans) && Array.isArray(trip.day_plans || trip.dayPlans) ? (
                            <div className="shared-itinerary-timeline">
                                {(trip.day_plans || trip.dayPlans).map((day, idx) => (
                                    <div key={idx} className="timeline-day">
                                        <div className="day-number">Day {idx + 1}</div>
                                        <div className="day-content">
                                            {day.activities && day.activities.length > 0 ? (
                                                <div className="activity-list">
                                                    {day.activities.map((act, actIdx) => (
                                                        <div key={actIdx} className="shared-activity-card">
                                                            <div className="act-time">{act.time || 'flexible'}</div>
                                                            <div className="act-details">
                                                                <h4>{act.activity}</h4>
                                                                {act.location && <p className="act-loc"><MapPin size={12} /> {act.location}</p>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="no-activities">Relax and explore the surroundings.</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-itinerary">
                                <p>This trip consists of flexible exploration without a fixed day-by-day itinerary yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Details */}
                    <div className="details-sidebar">
                        {/* Transport */}
                        {(trip.transport_mode || trip.transportMode) && (
                            <div className="sidebar-card">
                                <h3><Plane size={18} /> Transport</h3>
                                <p className="capitalize">{trip.transport_mode || trip.transportMode}</p>
                                {trip.vehicle_details?.vehicle_type && (
                                    <div className="detail-tag">{trip.vehicle_details.vehicle_type}</div>
                                )}
                            </div>
                        )}

                        {/* Accommodation */}
                        {(trip.accommodation_details?.hotel_name || trip.accommodation_details?.accommodationName) && (
                            <div className="sidebar-card">
                                <h3><Heart size={18} /> Stay</h3>
                                <p className="bold">{trip.accommodation_details.hotel_name || trip.accommodation_details.accommodationName}</p>
                                {(trip.accommodation_details.hotel_address || trip.accommodation_details.accommodationAddress) && (
                                    <p className="small">{trip.accommodation_details.hotel_address || trip.accommodation_details.accommodationAddress}</p>
                                )}
                            </div>
                        )}

                        {/* Budget */}
                        {trip.budget_details && (
                            <div className="sidebar-card budget-card">
                                <h3>💰 Budget Breakdown</h3>
                                <div className="budget-items">
                                    {Object.entries(trip.budget_details).map(([key, val]) => (
                                        val > 0 && (
                                            <div key={key} className="budget-row">
                                                <span className="capitalize">{key.replace('_', ' ')}</span>
                                                <span className="bold">₹{val.toLocaleString()}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* App Promotion */}
                        <div className="promo-card">
                            <Globe size={32} color="white" />
                            <h3>Plan your own trip with WanderAI</h3>
                            <p>The ultimate personal travel assistant powered by AI.</p>
                            <Link to="/auth" className="btn btn-white btn-sm">Get Started Free</Link>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="shared-footer">
                <p>© 2026 WanderAI - Empowering Personalized Travel Planning</p>
                <div className="footer-links">
                    <Link to="/home">Home</Link>
                    <Link to="/smart-tools">Smart Tools</Link>
                </div>
            </footer>
        </div>
    );
};

export default SharedTripView;
