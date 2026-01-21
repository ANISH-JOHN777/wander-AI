import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTripContext } from '../context/TripContext';
import { useUserContext } from '../context/UserContext';
import {
    User, Mail, MapPin, Calendar, Award, Camera, Edit3, Save, X,
    Globe, Plane, Heart, Star, Trophy, Clock, Users, Settings as SettingsIcon,
    Instagram, Twitter, Facebook, Link as LinkIcon, Check, Plus, TrendingUp,
    Map, Compass, Mountain, Palmtree, Building2, Sunset
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const { trips } = useTripContext();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [profileData, setProfileData] = useState({
        name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'Travel Explorer',
        tagline: 'Adventure Seeker | World Wanderer',
        bio: 'Passionate traveler exploring the world one destination at a time. Love discovering hidden gems, trying local cuisines, and capturing moments through photography.',
        location: 'New York, USA',
        joinedDate: user?.created_at || new Date().toISOString(),
        avatar: null,
        banner: null,
        website: 'wanderlust.com',
        social: {
            instagram: '@traveler',
            twitter: '@traveler',
        },
        interests: ['Adventure', 'Food', 'Culture', 'Photography', 'Hiking', 'Beach'],
        favoriteDestinations: ['Paris, France', 'Tokyo, Japan', 'Bali, Indonesia', 'New York, USA'],
        travelStyle: ['Solo Travel', 'Budget Travel', 'Photography', 'Food Tours'],
    });

    const stats = {
        totalTrips: trips.length,
        countriesVisited: new Set(trips.map(t => t.destination?.split(',')[1]?.trim())).size || 12,
        citiesVisited: trips.length || 24,
        totalDays: trips.reduce((acc, trip) => {
            if (trip.startDate && trip.endDate) {
                const days = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24));
                return acc + days;
            }
            return acc;
        }, 0) || 156,
        continents: 4,
        followers: 1234,
        following: 567,
    };

    const badges = [
        { icon: Trophy, title: 'First Trip', color: '#f59e0b', unlocked: true },
        { icon: Globe, title: 'Explorer', color: '#3b82f6', unlocked: true },
        { icon: Star, title: 'Wanderlust', color: '#8b5cf6', unlocked: true },
        { icon: Plane, title: 'Globetrotter', color: '#10b981', unlocked: true },
        { icon: Heart, title: 'Travel Lover', color: '#ef4444', unlocked: true },
        { icon: Mountain, title: 'Adventurer', color: '#6366f1', unlocked: false },
    ];

    const recentTrips = trips.slice(0, 6).map(trip => ({
        destination: trip.destination,
        image: trip.photos?.[0]?.url || null,
        dates: `${new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
        days: Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)),
    }));

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData({ ...profileData, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData({ ...profileData, banner: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-page-new">
            {/* Banner Section */}
            <div className="profile-banner-section">
                {profileData.banner ? (
                    <img src={profileData.banner} alt="Cover" className="profile-banner-img" />
                ) : (
                    <div className="profile-banner-gradient">
                        <div className="banner-pattern"></div>
                    </div>
                )}
                {isEditing && (
                    <label className="banner-edit-btn">
                        <Camera size={20} />
                        <span>Change Cover</span>
                        <input type="file" accept="image/*" onChange={handleBannerChange} />
                    </label>
                )}
            </div>

            {/* Profile Info Card */}
            <div className="profile-container">
                <div className="profile-info-card">
                    <div className="profile-avatar-large">
                        {profileData.avatar ? (
                            <img src={profileData.avatar} alt="Profile" />
                        ) : (
                            <div className="avatar-placeholder-large">
                                <User size={64} />
                            </div>
                        )}
                        {isEditing && (
                            <label className="avatar-edit-btn">
                                <Camera size={18} />
                                <input type="file" accept="image/*" onChange={handleAvatarChange} />
                            </label>
                        )}
                        <div className="avatar-status"></div>
                    </div>

                    <div className="profile-header-info">
                        <div className="profile-name-section">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="profile-name-edit"
                                />
                            ) : (
                                <>
                                    <h1 className="profile-name-large">{profileData.name}</h1>
                                    <Check className="verified-icon" size={24} />
                                </>
                            )}
                        </div>

                        {isEditing ? (
                            <input
                                type="text"
                                value={profileData.tagline}
                                onChange={(e) => setProfileData({ ...profileData, tagline: e.target.value })}
                                className="profile-tagline-edit"
                            />
                        ) : (
                            <p className="profile-tagline">{profileData.tagline}</p>
                        )}

                        <div className="profile-meta-row">
                            <span className="meta-badge">
                                <MapPin size={16} />
                                {profileData.location}
                            </span>
                            <span className="meta-badge">
                                <Calendar size={16} />
                                Joined {new Date(profileData.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                            <span className="meta-badge">
                                <LinkIcon size={16} />
                                {profileData.website}
                            </span>
                        </div>

                        <div className="profile-social-links">
                            <a href="#" className="social-link instagram">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="social-link twitter">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="social-link facebook">
                                <Facebook size={18} />
                            </a>
                        </div>
                    </div>

                    <div className="profile-actions-new">
                        {isEditing ? (
                            <>
                                <button className="btn-action btn-save" onClick={handleSave}>
                                    <Save size={18} />
                                    Save
                                </button>
                                <button className="btn-action btn-cancel" onClick={() => setIsEditing(false)}>
                                    <X size={18} />
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn-action btn-edit-new" onClick={() => setIsEditing(true)}>
                                    <Edit3 size={18} />
                                    Edit Profile
                                </button>
                                <button className="btn-action btn-settings">
                                    <SettingsIcon size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="stats-bar">
                    <div className="stat-item-new">
                        <div className="stat-number">{stats.totalTrips}</div>
                        <div className="stat-label-new">Trips</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item-new">
                        <div className="stat-number">{stats.countriesVisited}</div>
                        <div className="stat-label-new">Countries</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item-new">
                        <div className="stat-number">{stats.citiesVisited}</div>
                        <div className="stat-label-new">Cities</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item-new">
                        <div className="stat-number">{stats.totalDays}</div>
                        <div className="stat-label-new">Days</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item-new">
                        <div className="stat-number">{stats.followers}</div>
                        <div className="stat-label-new">Followers</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item-new">
                        <div className="stat-number">{stats.following}</div>
                        <div className="stat-label-new">Following</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <Compass size={18} />
                        Overview
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'trips' ? 'active' : ''}`}
                        onClick={() => setActiveTab('trips')}
                    >
                        <Map size={18} />
                        Trips
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
                        onClick={() => setActiveTab('badges')}
                    >
                        <Trophy size={18} />
                        Badges
                    </button>
                </div>

                {/* Content */}
                <div className="profile-content-new">
                    {activeTab === 'overview' && (
                        <div className="overview-grid">
                            {/* About */}
                            <div className="content-card">
                                <h3 className="card-title">About</h3>
                                {isEditing ? (
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        className="bio-edit"
                                        rows="4"
                                    />
                                ) : (
                                    <p className="bio-text">{profileData.bio}</p>
                                )}
                            </div>

                            {/* Travel Interests */}
                            <div className="content-card">
                                <h3 className="card-title">Travel Interests</h3>
                                <div className="tags-grid">
                                    {profileData.interests.map((interest, i) => (
                                        <span key={i} className="interest-badge">{interest}</span>
                                    ))}
                                    {isEditing && <button className="add-interest-btn"><Plus size={16} /> Add</button>}
                                </div>
                            </div>

                            {/* Favorite Destinations */}
                            <div className="content-card">
                                <h3 className="card-title">Favorite Destinations</h3>
                                <div className="destinations-list">
                                    {profileData.favoriteDestinations.map((dest, i) => (
                                        <div key={i} className="destination-item">
                                            <MapPin size={16} className="dest-icon" />
                                            <span>{dest}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Travel Style */}
                            <div className="content-card">
                                <h3 className="card-title">Travel Style</h3>
                                <div className="tags-grid">
                                    {profileData.travelStyle.map((style, i) => (
                                        <span key={i} className="style-badge">{style}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'trips' && (
                        <div className="trips-grid-new">
                            {recentTrips.length > 0 ? (
                                recentTrips.map((trip, i) => (
                                    <div key={i} className="trip-card-new">
                                        <div className="trip-image-wrapper">
                                            {trip.image ? (
                                                <img src={trip.image} alt={trip.destination} />
                                            ) : (
                                                <div className="trip-placeholder">
                                                    <Palmtree size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="trip-info-new">
                                            <h4>{trip.destination}</h4>
                                            <p>{trip.dates} • {trip.days} days</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <Plane size={64} />
                                    <p>No trips yet</p>
                                    <span>Start planning your first adventure!</span>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'badges' && (
                        <div className="badges-grid-new">
                            {badges.map((badge, i) => (
                                <div key={i} className={`badge-card-new ${badge.unlocked ? 'unlocked' : 'locked'}`}>
                                    <div className="badge-icon-new" style={{ background: badge.unlocked ? badge.color : '#e5e7eb' }}>
                                        <badge.icon size={32} />
                                    </div>
                                    <h4>{badge.title}</h4>
                                    {badge.unlocked && <Check className="badge-check" size={20} />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
