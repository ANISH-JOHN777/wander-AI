import { useTripContext } from '../../context/TripContext';
import { Navigate, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Plane, Train, Bus, Clock, IndianRupee, MapPin, Car, Bike, Search, Star, Users as UsersIcon, Fuel } from 'lucide-react';
import { getMockFlights, getMockTrains, getMockBuses } from '../../utils/mockData';
import './Transport.css';

const Transport = () => {
    const { activeTrip } = useTripContext();
    const [transportType, setTransportType] = useState('flights');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState('best');

    if (!activeTrip) {
        return <Navigate to="/trip-creator" replace />;
    }

    const transportTypes = [
        { id: 'flights', label: 'Flights', icon: Plane },
        { id: 'trains', label: 'Trains', icon: Train },
        { id: 'buses', label: 'Buses', icon: Bus },
        { id: 'rentCar', label: 'Rent Car', icon: Car },
        { id: 'rentBike', label: 'Rent Bike', icon: Bike },
    ];

    // Get location-based mock data
    const flights = getMockFlights(activeTrip.destination);
    const trains = getMockTrains(activeTrip.destination);
    const buses = getMockBuses(activeTrip.destination);

    // Mock rental car data
    const rentalCars = [
        { id: 1, name: 'Maruti Swift', type: 'Hatchback', seats: 4, transmission: 'Manual', fuel: 'Petrol', pricePerDay: 1200, rating: 4.5, company: 'Zoomcar', features: ['AC', 'Music System', 'GPS'] },
        { id: 2, name: 'Hyundai i20', type: 'Hatchback', seats: 5, transmission: 'Automatic', fuel: 'Petrol', pricePerDay: 1800, rating: 4.6, company: 'Revv', features: ['AC', 'Music System', 'GPS', 'Bluetooth'] },
        { id: 3, name: 'Honda City', type: 'Sedan', seats: 5, transmission: 'Manual', fuel: 'Diesel', pricePerDay: 2200, rating: 4.7, company: 'Zoomcar', features: ['AC', 'Music System', 'GPS', 'Sunroof'] },
        { id: 4, name: 'Toyota Innova', type: 'SUV', seats: 7, transmission: 'Manual', fuel: 'Diesel', pricePerDay: 3500, rating: 4.8, company: 'Myles', features: ['AC', 'Music System', 'GPS', 'Spacious'] },
        { id: 5, name: 'Mahindra XUV500', type: 'SUV', seats: 7, transmission: 'Automatic', fuel: 'Diesel', pricePerDay: 4000, rating: 4.7, company: 'Revv', features: ['AC', 'Music System', 'GPS', '4WD'] },
        { id: 6, name: 'Tata Nexon', type: 'Compact SUV', seats: 5, transmission: 'Automatic', fuel: 'Petrol', pricePerDay: 2500, rating: 4.5, company: 'Zoomcar', features: ['AC', 'Music System', 'GPS', 'Safety+'] },
    ];

    // Mock rental bike data
    const rentalBikes = [
        { id: 1, name: 'Honda Activa', type: 'Scooter', engine: '110cc', transmission: 'Automatic', fuel: 'Petrol', pricePerDay: 400, rating: 4.4, company: 'Bounce', features: ['Helmet', 'Storage Box'] },
        { id: 2, name: 'TVS Jupiter', type: 'Scooter', engine: '110cc', transmission: 'Automatic', fuel: 'Petrol', pricePerDay: 450, rating: 4.5, company: 'Vogo', features: ['Helmet', 'USB Charging', 'Storage'] },
        { id: 3, name: 'Royal Enfield Classic 350', type: 'Cruiser', engine: '350cc', transmission: 'Manual', fuel: 'Petrol', pricePerDay: 1200, rating: 4.8, company: 'Wicked Ride', features: ['Helmet', 'Riding Jacket', 'Gloves'] },
        { id: 4, name: 'Bajaj Pulsar 150', type: 'Sports', engine: '150cc', transmission: 'Manual', fuel: 'Petrol', pricePerDay: 600, rating: 4.3, company: 'Bounce', features: ['Helmet', 'Lock'] },
        { id: 5, name: 'KTM Duke 200', type: 'Sports', engine: '200cc', transmission: 'Manual', fuel: 'Petrol', pricePerDay: 1000, rating: 4.7, company: 'Wicked Ride', features: ['Helmet', 'Riding Gear', 'GPS'] },
        { id: 6, name: 'Honda Dio', type: 'Scooter', engine: '110cc', transmission: 'Automatic', fuel: 'Petrol', pricePerDay: 380, rating: 4.4, company: 'Vogo', features: ['Helmet', 'Mobile Holder'] },
    ];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Filter and sort rental cars
    const filteredCars = useMemo(() => {
        let filtered = rentalCars;

        if (searchQuery.trim()) {
            filtered = filtered.filter(car =>
                car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.company.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        const sorted = [...filtered].sort((a, b) => {
            if (priceFilter === 'lower') {
                return a.pricePerDay - b.pricePerDay;
            } else if (priceFilter === 'higher') {
                return b.pricePerDay - a.pricePerDay;
            } else {
                if (b.rating !== a.rating) {
                    return b.rating - a.rating;
                }
                return a.pricePerDay - b.pricePerDay;
            }
        });

        return sorted;
    }, [rentalCars, searchQuery, priceFilter]);

    // Filter and sort rental bikes
    const filteredBikes = useMemo(() => {
        let filtered = rentalBikes;

        if (searchQuery.trim()) {
            filtered = filtered.filter(bike =>
                bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bike.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bike.company.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        const sorted = [...filtered].sort((a, b) => {
            if (priceFilter === 'lower') {
                return a.pricePerDay - b.pricePerDay;
            } else if (priceFilter === 'higher') {
                return b.pricePerDay - a.pricePerDay;
            } else {
                if (b.rating !== a.rating) {
                    return b.rating - a.rating;
                }
                return a.pricePerDay - b.pricePerDay;
            }
        });

        return sorted;
    }, [rentalBikes, searchQuery, priceFilter]);

    return (
        <div className="transport-page">
            <div className="module-header">
                <div>
                    <h1><Plane size={32} /> Transport</h1>
                    <p className="module-subtitle">Book transport to {activeTrip.destination}</p>
                </div>
                <Link to="/bookings" className="btn btn-secondary">
                    Back to Bookings
                </Link>
            </div>

            <div className="transport-tabs">
                {transportTypes.map(type => {
                    const Icon = type.icon;
                    return (
                        <button
                            key={type.id}
                            className={`transport-tab ${transportType === type.id ? 'active' : ''}`}
                            onClick={() => setTransportType(type.id)}
                        >
                            <Icon size={20} />
                            <span className="tab-label">{type.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="search-criteria">
                <h3>Travel Details</h3>
                <div className="criteria-grid">
                    <div className="criteria-item">
                        <span className="criteria-label">Destination:</span>
                        <span className="criteria-value">{activeTrip.destination}</span>
                    </div>
                    <div className="criteria-item">
                        <span className="criteria-label">Departure Date:</span>
                        <span className="criteria-value">{formatDate(activeTrip.startDate)}</span>
                    </div>
                    <div className="criteria-item">
                        <span className="criteria-label">Return Date:</span>
                        <span className="criteria-value">{formatDate(activeTrip.endDate)}</span>
                    </div>
                    <div className="criteria-item">
                        <span className="criteria-label">Passengers:</span>
                        <span className="criteria-value">{activeTrip.travelers || 1}</span>
                    </div>
                </div>
            </div>

            {/* Search and Filter for Rentals */}
            {(transportType === 'rentCar' || transportType === 'rentBike') && (
                <div className="search-filter-section">
                    <div className="search-bar">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, type, or company..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="filter-buttons">
                        <span className="filter-label">Sort by:</span>
                        <button
                            className={`filter-btn ${priceFilter === 'lower' ? 'active' : ''}`}
                            onClick={() => setPriceFilter('lower')}
                        >
                            Lower Price
                        </button>
                        <button
                            className={`filter-btn ${priceFilter === 'best' ? 'active' : ''}`}
                            onClick={() => setPriceFilter('best')}
                        >
                            Best Price
                        </button>
                        <button
                            className={`filter-btn ${priceFilter === 'higher' ? 'active' : ''}`}
                            onClick={() => setPriceFilter('higher')}
                        >
                            Higher Price
                        </button>
                    </div>
                </div>
            )}

            {/* Flights Section */}
            {transportType === 'flights' && (
                <div className="results-section">
                    <div className="results-header">
                        <h3>{flights.length} Flights Found to {activeTrip.destination}</h3>
                        <p className="results-note">Showing available flights for your travel dates</p>
                    </div>

                    <div className="transport-grid">
                        {flights.map(flight => (
                            <div key={flight.id} className="transport-card">
                                <div className="transport-header">
                                    <div className="airline-info">
                                        <Plane size={24} className="transport-icon" />
                                        <div>
                                            <h4>{flight.airline}</h4>
                                            <span className="transport-type">{flight.stops}</span>
                                        </div>
                                    </div>
                                    <div className="price-info">
                                        <span className="price-label">Per person</span>
                                        <span className="price-amount">₹{flight.price.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <div className="transport-route">
                                    <div className="route-point">
                                        <MapPin size={16} />
                                        <div>
                                            <div className="route-city">{flight.from}</div>
                                            <div className="route-time">{flight.departure}</div>
                                        </div>
                                    </div>
                                    <div className="route-duration">
                                        <Clock size={16} />
                                        <span>{flight.duration}</span>
                                    </div>
                                    <div className="route-point">
                                        <MapPin size={16} />
                                        <div>
                                            <div className="route-city">{flight.to}</div>
                                            <div className="route-time">{flight.arrival}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="transport-footer">
                                    <div className="total-price">
                                        Total: ₹{(flight.price * (activeTrip.travelers || 1)).toLocaleString('en-IN')}
                                        <span className="passenger-count"> ({activeTrip.travelers || 1} passenger{(activeTrip.travelers || 1) > 1 ? 's' : ''})</span>
                                    </div>
                                    <button className="btn btn-primary btn-sm">Book Now</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Trains Section */}
            {transportType === 'trains' && (
                <div className="results-section">
                    <div className="results-header">
                        <h3>{trains.length} Trains Found to {activeTrip.destination}</h3>
                        <p className="results-note">Showing available trains for your travel dates</p>
                    </div>

                    <div className="transport-grid">
                        {trains.map(train => (
                            <div key={train.id} className="transport-card">
                                <div className="transport-header">
                                    <div className="airline-info">
                                        <Train size={24} className="transport-icon" />
                                        <div>
                                            <h4>{train.name}</h4>
                                            <span className="transport-type">{train.class}</span>
                                        </div>
                                    </div>
                                    <div className="price-info">
                                        <span className="price-label">Per person</span>
                                        <span className="price-amount">₹{train.price.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <div className="transport-route">
                                    <div className="route-point">
                                        <MapPin size={16} />
                                        <div>
                                            <div className="route-city">{train.from}</div>
                                            <div className="route-time">{train.departure}</div>
                                        </div>
                                    </div>
                                    <div className="route-duration">
                                        <Clock size={16} />
                                        <span>{train.duration}</span>
                                    </div>
                                    <div className="route-point">
                                        <MapPin size={16} />
                                        <div>
                                            <div className="route-city">{train.to}</div>
                                            <div className="route-time">{train.arrival}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="transport-footer">
                                    <div className="total-price">
                                        Total: ₹{(train.price * (activeTrip.travelers || 1)).toLocaleString('en-IN')}
                                        <span className="passenger-count"> ({activeTrip.travelers || 1} passenger{(activeTrip.travelers || 1) > 1 ? 's' : ''})</span>
                                    </div>
                                    <button className="btn btn-primary btn-sm">Book Now</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Buses Section */}
            {transportType === 'buses' && (
                <div className="results-section">
                    <div className="results-header">
                        <h3>{buses.length} Buses Found to {activeTrip.destination}</h3>
                        <p className="results-note">Showing available buses for your travel dates</p>
                    </div>

                    <div className="transport-grid">
                        {buses.map(bus => (
                            <div key={bus.id} className="transport-card">
                                <div className="transport-header">
                                    <div className="airline-info">
                                        <Bus size={24} className="transport-icon" />
                                        <div>
                                            <h4>{bus.operator}</h4>
                                            <span className="transport-type">{bus.type}</span>
                                        </div>
                                    </div>
                                    <div className="price-info">
                                        <span className="price-label">Per person</span>
                                        <span className="price-amount">₹{bus.price.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <div className="transport-route">
                                    <div className="route-point">
                                        <MapPin size={16} />
                                        <div>
                                            <div className="route-city">{bus.from}</div>
                                            <div className="route-time">{bus.departure}</div>
                                        </div>
                                    </div>
                                    <div className="route-duration">
                                        <Clock size={16} />
                                        <span>{bus.duration}</span>
                                    </div>
                                    <div className="route-point">
                                        <MapPin size={16} />
                                        <div>
                                            <div className="route-city">{bus.to}</div>
                                            <div className="route-time">{bus.arrival}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="transport-footer">
                                    <div className="total-price">
                                        Total: ₹{(bus.price * (activeTrip.travelers || 1)).toLocaleString('en-IN')}
                                        <span className="passenger-count"> ({activeTrip.travelers || 1} passenger{(activeTrip.travelers || 1) > 1 ? 's' : ''})</span>
                                    </div>
                                    <button className="btn btn-primary btn-sm">Book Now</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Rent Car Section */}
            {transportType === 'rentCar' && (
                <div className="results-section">
                    <div className="results-header">
                        <h3>{filteredCars.length} Cars Available for Rent</h3>
                        <p className="results-note">Prices shown are per day</p>
                    </div>

                    <div className="rental-grid">
                        {filteredCars.map(car => (
                            <div key={car.id} className="rental-card">
                                <div className="rental-header">
                                    <div className="rental-icon-wrapper">
                                        <Car size={32} className="rental-icon" />
                                    </div>
                                    <div className="rental-info">
                                        <h4>{car.name}</h4>
                                        <span className="rental-type">{car.type}</span>
                                    </div>
                                    <div className="rental-rating">
                                        <Star size={16} fill="currentColor" />
                                        <span>{car.rating}</span>
                                    </div>
                                </div>

                                <div className="rental-details">
                                    <div className="detail-row">
                                        <UsersIcon size={16} />
                                        <span>{car.seats} Seats</span>
                                    </div>
                                    <div className="detail-row">
                                        <Fuel size={16} />
                                        <span>{car.fuel}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Transmission:</span>
                                        <span>{car.transmission}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Company:</span>
                                        <span>{car.company}</span>
                                    </div>
                                </div>

                                <div className="rental-features">
                                    {car.features.map((feature, idx) => (
                                        <span key={idx} className="feature-tag">{feature}</span>
                                    ))}
                                </div>

                                <div className="rental-footer">
                                    <div className="rental-price">
                                        <span className="price-label">Per Day</span>
                                        <span className="price-amount">₹{car.pricePerDay.toLocaleString('en-IN')}</span>
                                    </div>
                                    <button className="btn btn-primary btn-sm">Book Now</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Rent Bike Section */}
            {transportType === 'rentBike' && (
                <div className="results-section">
                    <div className="results-header">
                        <h3>{filteredBikes.length} Bikes Available for Rent</h3>
                        <p className="results-note">Prices shown are per day</p>
                    </div>

                    <div className="rental-grid">
                        {filteredBikes.map(bike => (
                            <div key={bike.id} className="rental-card">
                                <div className="rental-header">
                                    <div className="rental-icon-wrapper bike">
                                        <Bike size={32} className="rental-icon" />
                                    </div>
                                    <div className="rental-info">
                                        <h4>{bike.name}</h4>
                                        <span className="rental-type">{bike.type}</span>
                                    </div>
                                    <div className="rental-rating">
                                        <Star size={16} fill="currentColor" />
                                        <span>{bike.rating}</span>
                                    </div>
                                </div>

                                <div className="rental-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Engine:</span>
                                        <span>{bike.engine}</span>
                                    </div>
                                    <div className="detail-row">
                                        <Fuel size={16} />
                                        <span>{bike.fuel}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Transmission:</span>
                                        <span>{bike.transmission}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Company:</span>
                                        <span>{bike.company}</span>
                                    </div>
                                </div>

                                <div className="rental-features">
                                    {bike.features.map((feature, idx) => (
                                        <span key={idx} className="feature-tag">{feature}</span>
                                    ))}
                                </div>

                                <div className="rental-footer">
                                    <div className="rental-price">
                                        <span className="price-label">Per Day</span>
                                        <span className="price-amount">₹{bike.pricePerDay.toLocaleString('en-IN')}</span>
                                    </div>
                                    <button className="btn btn-primary btn-sm">Book Now</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transport;
