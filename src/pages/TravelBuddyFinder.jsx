import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTripContext } from '../context/TripContext';
import { Users, MapPin, Calendar, MessageCircle, Heart, Search, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './TravelBuddyFinder.css';

const TravelBuddyFinder = () => {
    const { user } = useAuth();
    const { trips } = useTripContext();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('all');
    const [buddies, setBuddies] = useState([]);
    const [filteredBuddies, setFilteredBuddies] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadBuddies();
    }, []);

    useEffect(() => {
        filterBuddies();
    }, [searchQuery, selectedDestination, buddies]);

    const loadBuddies = () => {
        // Mock data - in real app, fetch from Supabase
        const mockBuddies = [
            {
                id: 1,
                name: 'Sarah Johnson',
                destination: 'Paris, France',
                dates: 'Feb 15 - Feb 22, 2026',
                travelType: 'solo',
                interests: ['Photography', 'Museums', 'Food'],
                bio: 'Love exploring art and culture. Looking for someone to share museum visits!',
                verified: true,
                trips: 12
            },
            {
                id: 2,
                name: 'Mike Chen',
                destination: 'Tokyo, Japan',
                dates: 'Mar 1 - Mar 10, 2026',
                travelType: 'solo',
                interests: ['Food', 'Technology', 'Hiking'],
                bio: 'Tech enthusiast and foodie. First time in Japan, would love local tips!',
                verified: true,
                trips: 8
            },
            {
                id: 3,
                name: 'Emma Williams',
                destination: 'Bali, Indonesia',
                dates: 'Feb 20 - Mar 5, 2026',
                travelType: 'solo',
                interests: ['Yoga', 'Beach', 'Wellness'],
                bio: 'Yoga instructor looking for wellness and beach activities companions.',
                verified: false,
                trips: 15
            },
            {
                id: 4,
                name: 'David Kumar',
                destination: 'Dubai, UAE',
                dates: 'Jan 25 - Feb 2, 2026',
                travelType: 'couple',
                interests: ['Shopping', 'Adventure', 'Luxury'],
                bio: 'Traveling with partner, looking for couples to explore Dubai together!',
                verified: true,
                trips: 6
            },
            {
                id: 5,
                name: 'Lisa Anderson',
                destination: 'New York, USA',
                dates: 'Feb 10 - Feb 17, 2026',
                travelType: 'solo',
                interests: ['Broadway', 'Shopping', 'Food'],
                bio: 'Broadway fan! Looking for theater buddies and food tour companions.',
                verified: true,
                trips: 20
            }
        ];
        setBuddies(mockBuddies);
        setFilteredBuddies(mockBuddies);
    };

    const filterBuddies = () => {
        let filtered = buddies;

        if (searchQuery) {
            filtered = filtered.filter(buddy =>
                buddy.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                buddy.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (selectedDestination !== 'all') {
            filtered = filtered.filter(buddy => buddy.destination === selectedDestination);
        }

        setFilteredBuddies(filtered);
    };

    const getUniqueDestinations = () => {
        return [...new Set(buddies.map(b => b.destination))];
    };

    const handleConnect = (buddyId) => {
        alert('Connection request sent! (In real app, this would send a notification)');
    };

    return (
        <div className="travel-buddy-finder">
            <div className="buddy-finder-header">
                <div className="header-content">
                    <div className="header-icon">
                        <Users size={40} />
                    </div>
                    <div className="header-text">
                        <h1>Travel Buddy Finder</h1>
                        <p>Connect with travelers going to the same destination</p>
                    </div>
                </div>
            </div>

            <div className="search-section">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by destination, name, or interests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="clear-search" onClick={() => setSearchQuery('')}>
                            <X size={18} />
                        </button>
                    )}
                </div>

                <button
                    className="filter-toggle"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter size={20} />
                    Filters
                </button>
            </div>

            {showFilters && (
                <div className="filters-panel">
                    <div className="filter-group">
                        <label>Destination</label>
                        <select
                            value={selectedDestination}
                            onChange={(e) => setSelectedDestination(e.target.value)}
                        >
                            <option value="all">All Destinations</option>
                            {getUniqueDestinations().map(dest => (
                                <option key={dest} value={dest}>{dest}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <div className="results-header">
                <h2>Available Travel Buddies</h2>
                <span className="results-count">{filteredBuddies.length} travelers found</span>
            </div>

            <div className="buddies-grid">
                {filteredBuddies.map(buddy => (
                    <div key={buddy.id} className="buddy-card">
                        <div className="buddy-header">
                            <div className="buddy-avatar">
                                {buddy.name.charAt(0)}
                            </div>
                            <div className="buddy-info">
                                <div className="buddy-name">
                                    {buddy.name}
                                    {buddy.verified && (
                                        <span className="verified-badge" title="Verified Traveler">✓</span>
                                    )}
                                </div>
                                <div className="buddy-stats">
                                    {buddy.trips} trips completed
                                </div>
                            </div>
                        </div>

                        <div className="buddy-details">
                            <div className="detail-item">
                                <MapPin size={16} />
                                <span>{buddy.destination}</span>
                            </div>
                            <div className="detail-item">
                                <Calendar size={16} />
                                <span>{buddy.dates}</span>
                            </div>
                            <div className="detail-item">
                                <Users size={16} />
                                <span className="travel-type-badge">{buddy.travelType}</span>
                            </div>
                        </div>

                        <div className="buddy-bio">
                            {buddy.bio}
                        </div>

                        <div className="buddy-interests">
                            {buddy.interests.map(interest => (
                                <span key={interest} className="interest-tag">
                                    {interest}
                                </span>
                            ))}
                        </div>

                        <div className="buddy-actions">
                            <button
                                className="btn-connect"
                                onClick={() => handleConnect(buddy.id)}
                            >
                                <MessageCircle size={18} />
                                Connect
                            </button>
                            <button className="btn-like">
                                <Heart size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredBuddies.length === 0 && (
                <div className="no-results">
                    <Users size={64} />
                    <h3>No travel buddies found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default TravelBuddyFinder;
