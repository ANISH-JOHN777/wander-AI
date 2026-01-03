// Mock data generator based on destination
// This generates realistic mock data for different Indian cities

const INDIAN_CITIES_DATA = {
    'Goa': {
        hotels: [
            { id: 1, name: 'Taj Exotica Resort & Spa', location: 'Benaulim Beach', rating: 4.8, price: 12500, amenities: ['Pool', 'Spa', 'Beach Access', 'Restaurant'], image: 'hotel1', type: 'Luxury' },
            { id: 2, name: 'Alila Diwa Goa', location: 'Majorda', rating: 4.7, price: 9800, amenities: ['Pool', 'Spa', 'Gym', 'Restaurant'], image: 'hotel2', type: 'Luxury' },
            { id: 3, name: 'Novotel Goa Dona Sylvia Resort', location: 'Cavelossim Beach', rating: 4.5, price: 7500, amenities: ['Pool', 'Beach Access', 'Restaurant', 'Bar'], image: 'hotel3', type: 'Mid-Range' },
            { id: 4, name: 'Lemon Tree Hotel', location: 'Candolim', rating: 4.3, price: 4200, amenities: ['Pool', 'Restaurant', 'WiFi'], image: 'hotel4', type: 'Budget' },
            { id: 5, name: 'FabHotel Palm Grove', location: 'Baga', rating: 4.0, price: 2800, amenities: ['WiFi', 'AC', 'Restaurant'], image: 'hotel5', type: 'Budget' },
        ],
        flights: [
            { id: 1, airline: 'IndiGo', from: 'Delhi', to: 'Goa', departure: '06:00', arrival: '08:30', duration: '2h 30m', price: 4500, stops: 'Non-stop' },
            { id: 2, airline: 'Air India', from: 'Mumbai', to: 'Goa', departure: '09:15', arrival: '10:30', duration: '1h 15m', price: 3200, stops: 'Non-stop' },
            { id: 3, airline: 'SpiceJet', from: 'Bangalore', to: 'Goa', departure: '14:30', arrival: '15:45', duration: '1h 15m', price: 2800, stops: 'Non-stop' },
            { id: 4, airline: 'Vistara', from: 'Delhi', to: 'Goa', departure: '18:00', arrival: '20:45', duration: '2h 45m', price: 5200, stops: 'Non-stop' },
        ],
        trains: [
            { id: 1, name: 'Goa Express', from: 'Delhi', to: 'Goa', departure: '15:00', arrival: '14:30+1', duration: '23h 30m', price: 1200, class: 'AC 3-Tier' },
            { id: 2, name: 'Konkan Kanya Express', from: 'Mumbai', to: 'Goa', departure: '23:00', arrival: '10:30+1', duration: '11h 30m', price: 800, class: 'AC 2-Tier' },
            { id: 3, name: 'Mandovi Express', from: 'Mumbai', to: 'Goa', departure: '07:10', arrival: '18:30', duration: '11h 20m', price: 650, class: 'Sleeper' },
        ],
        buses: [
            { id: 1, operator: 'Paulo Travels', from: 'Mumbai', to: 'Goa', departure: '20:00', arrival: '08:00+1', duration: '12h', price: 1200, type: 'Sleeper AC', seats: 'Available' },
            { id: 2, operator: 'Neeta Volvo', from: 'Bangalore', to: 'Goa', departure: '18:30', arrival: '06:30+1', duration: '12h', price: 1500, type: 'Sleeper AC', seats: 'Available' },
            { id: 3, operator: 'VRL Travels', from: 'Pune', to: 'Goa', departure: '22:00', arrival: '06:00+1', duration: '8h', price: 800, type: 'Semi-Sleeper', seats: 'Available' },
            { id: 4, operator: 'Kadamba Transport', from: 'Mumbai', to: 'Goa', departure: '19:00', arrival: '07:00+1', duration: '12h', price: 600, type: 'Seater', seats: 'Available' },
        ],
        restaurants: [
            { id: 1, name: 'Thalassa', cuisine: 'Greek', location: 'Vagator', rating: 4.7, priceRange: '₹₹₹', specialty: 'Seafood & Mediterranean', popular: 'Grilled Octopus' },
            { id: 2, name: 'Fisherman\'s Wharf', cuisine: 'Goan', location: 'Cavelossim', rating: 4.5, priceRange: '₹₹', specialty: 'Goan Seafood', popular: 'Fish Curry Rice' },
            { id: 3, name: 'Bomra\'s', cuisine: 'Burmese', location: 'Candolim', rating: 4.6, priceRange: '₹₹₹', specialty: 'Asian Fusion', popular: 'Khao Suey' },
            { id: 4, name: 'Vinayak Family Restaurant', cuisine: 'Goan', location: 'Assagao', rating: 4.4, priceRange: '₹', specialty: 'Local Goan', popular: 'Pork Vindaloo' },
            { id: 5, name: 'Pousada by the Beach', cuisine: 'Continental', location: 'Calangute', rating: 4.3, priceRange: '₹₹', specialty: 'Seafood', popular: 'Prawn Balchao' },
        ]
    },
    'Mumbai': {
        hotels: [
            { id: 1, name: 'The Taj Mahal Palace', location: 'Colaba', rating: 4.9, price: 25000, amenities: ['Pool', 'Spa', 'Fine Dining', 'Heritage'], image: 'hotel1', type: 'Luxury' },
            { id: 2, name: 'The Oberoi Mumbai', location: 'Nariman Point', rating: 4.8, price: 22000, amenities: ['Pool', 'Spa', 'Sea View', 'Restaurant'], image: 'hotel2', type: 'Luxury' },
            { id: 3, name: 'Novotel Mumbai Juhu Beach', location: 'Juhu', rating: 4.5, price: 8500, amenities: ['Pool', 'Beach', 'Restaurant', 'Bar'], image: 'hotel3', type: 'Mid-Range' },
            { id: 4, name: 'Hotel Suba Palace', location: 'Colaba', rating: 4.2, price: 5000, amenities: ['Restaurant', 'WiFi', 'AC'], image: 'hotel4', type: 'Budget' },
            { id: 5, name: 'Treebo Trend', location: 'Andheri', rating: 4.0, price: 3200, amenities: ['WiFi', 'AC', 'Breakfast'], image: 'hotel5', type: 'Budget' },
        ],
        flights: [
            { id: 1, airline: 'IndiGo', from: 'Delhi', to: 'Mumbai', departure: '07:00', arrival: '09:15', duration: '2h 15m', price: 4200, stops: 'Non-stop' },
            { id: 2, airline: 'Air India', from: 'Bangalore', to: 'Mumbai', departure: '10:30', arrival: '12:15', duration: '1h 45m', price: 3800, stops: 'Non-stop' },
            { id: 3, airline: 'Vistara', from: 'Kolkata', to: 'Mumbai', departure: '15:00', arrival: '17:30', duration: '2h 30m', price: 5500, stops: 'Non-stop' },
        ],
        trains: [
            { id: 1, name: 'Rajdhani Express', from: 'Delhi', to: 'Mumbai', departure: '16:55', arrival: '08:35+1', duration: '15h 40m', price: 2500, class: 'AC 2-Tier' },
            { id: 2, name: 'Duronto Express', from: 'Bangalore', to: 'Mumbai', departure: '19:00', arrival: '09:30+1', duration: '14h 30m', price: 1800, class: 'AC 3-Tier' },
        ],
        buses: [
            { id: 1, operator: 'VRL Travels', from: 'Pune', to: 'Mumbai', departure: '23:00', arrival: '06:00+1', duration: '7h', price: 600, type: 'Sleeper AC', seats: 'Available' },
            { id: 2, operator: 'Neeta Volvo', from: 'Bangalore', to: 'Mumbai', departure: '17:00', arrival: '05:00+1', duration: '12h', price: 1400, type: 'Sleeper AC', seats: 'Available' },
            { id: 3, operator: 'Shrinath Travels', from: 'Goa', to: 'Mumbai', departure: '19:00', arrival: '07:00+1', duration: '12h', price: 1100, type: 'Semi-Sleeper', seats: 'Available' },
        ],
        restaurants: [
            { id: 1, name: 'Trishna', cuisine: 'Seafood', location: 'Fort', rating: 4.6, priceRange: '₹₹₹', specialty: 'Coastal Seafood', popular: 'Butter Garlic Crab' },
            { id: 2, name: 'Leopold Cafe', cuisine: 'Multi-cuisine', location: 'Colaba', rating: 4.3, priceRange: '₹₹', specialty: 'Continental', popular: 'Fish & Chips' },
            { id: 3, name: 'Britannia & Co.', cuisine: 'Parsi', location: 'Ballard Estate', rating: 4.5, priceRange: '₹₹', specialty: 'Parsi Cuisine', popular: 'Berry Pulav' },
            { id: 4, name: 'Bademiya', cuisine: 'Mughlai', location: 'Colaba', rating: 4.4, priceRange: '₹', specialty: 'Street Food', popular: 'Seekh Kebab' },
        ]
    },
    'Delhi': {
        hotels: [
            { id: 1, name: 'The Leela Palace', location: 'Chanakyapuri', rating: 4.9, price: 28000, amenities: ['Pool', 'Spa', 'Fine Dining', 'Luxury'], image: 'hotel1', type: 'Luxury' },
            { id: 2, name: 'The Imperial', location: 'Connaught Place', rating: 4.8, price: 24000, amenities: ['Pool', 'Spa', 'Heritage', 'Restaurant'], image: 'hotel2', type: 'Luxury' },
            { id: 3, name: 'Radisson Blu', location: 'Dwarka', rating: 4.4, price: 7000, amenities: ['Pool', 'Restaurant', 'Gym'], image: 'hotel3', type: 'Mid-Range' },
            { id: 4, name: 'Hotel Florence Inn', location: 'Paharganj', rating: 4.0, price: 3500, amenities: ['WiFi', 'AC', 'Restaurant'], image: 'hotel4', type: 'Budget' },
        ],
        flights: [
            { id: 1, airline: 'IndiGo', from: 'Mumbai', to: 'Delhi', departure: '06:30', arrival: '08:45', duration: '2h 15m', price: 4200, stops: 'Non-stop' },
            { id: 2, airline: 'Air India', from: 'Bangalore', to: 'Delhi', departure: '09:00', arrival: '11:45', duration: '2h 45m', price: 4800, stops: 'Non-stop' },
            { id: 3, airline: 'SpiceJet', from: 'Goa', to: 'Delhi', departure: '14:00', arrival: '16:30', duration: '2h 30m', price: 4500, stops: 'Non-stop' },
        ],
        trains: [
            { id: 1, name: 'Shatabdi Express', from: 'Agra', to: 'Delhi', departure: '08:00', arrival: '10:00', duration: '2h', price: 600, class: 'AC Chair Car' },
            { id: 2, name: 'Rajdhani Express', from: 'Mumbai', to: 'Delhi', departure: '16:00', arrival: '08:35+1', duration: '16h 35m', price: 2500, class: 'AC 2-Tier' },
        ],
        buses: [
            { id: 1, operator: 'Rajasthan Roadways', from: 'Jaipur', to: 'Delhi', departure: '22:00', arrival: '05:00+1', duration: '7h', price: 500, type: 'Sleeper AC', seats: 'Available' },
            { id: 2, operator: 'VRL Travels', from: 'Agra', to: 'Delhi', departure: '20:00', arrival: '03:00+1', duration: '7h', price: 400, type: 'Semi-Sleeper', seats: 'Available' },
            { id: 3, operator: 'Neeta Volvo', from: 'Chandigarh', to: 'Delhi', departure: '23:00', arrival: '05:00+1', duration: '6h', price: 600, type: 'Sleeper AC', seats: 'Available' },
        ],
        restaurants: [
            { id: 1, name: 'Indian Accent', cuisine: 'Modern Indian', location: 'Lodhi Colony', rating: 4.8, priceRange: '₹₹₹₹', specialty: 'Fine Dining', popular: 'Meetha Achaar Pork Ribs' },
            { id: 2, name: 'Karim\'s', cuisine: 'Mughlai', location: 'Jama Masjid', rating: 4.5, priceRange: '₹₹', specialty: 'Mughlai', popular: 'Mutton Korma' },
            { id: 3, name: 'Bukhara', cuisine: 'North Indian', location: 'Chanakyapuri', rating: 4.7, priceRange: '₹₹₹₹', specialty: 'Tandoor', popular: 'Dal Bukhara' },
            { id: 4, name: 'Saravana Bhavan', cuisine: 'South Indian', location: 'Connaught Place', rating: 4.3, priceRange: '₹', specialty: 'Vegetarian', popular: 'Masala Dosa' },
        ]
    },
    // Default data for cities not in the list
    'default': {
        hotels: [
            { id: 1, name: 'Premium Hotel & Resort', location: 'City Center', rating: 4.5, price: 8500, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi'], image: 'hotel1', type: 'Luxury' },
            { id: 2, name: 'Comfort Inn', location: 'Downtown', rating: 4.2, price: 5000, amenities: ['Restaurant', 'WiFi', 'Gym'], image: 'hotel2', type: 'Mid-Range' },
            { id: 3, name: 'Budget Stay Hotel', location: 'Near Station', rating: 3.9, price: 2500, amenities: ['WiFi', 'AC', 'Breakfast'], image: 'hotel3', type: 'Budget' },
        ],
        flights: [
            { id: 1, airline: 'IndiGo', from: 'Delhi', to: 'Destination', departure: '08:00', arrival: '10:30', duration: '2h 30m', price: 4000, stops: 'Non-stop' },
            { id: 2, airline: 'Air India', from: 'Mumbai', to: 'Destination', departure: '12:00', arrival: '14:15', duration: '2h 15m', price: 3800, stops: 'Non-stop' },
        ],
        trains: [
            { id: 1, name: 'Express Train', from: 'Delhi', to: 'Destination', departure: '10:00', arrival: '18:00', duration: '8h', price: 1000, class: 'AC 3-Tier' },
        ],
        buses: [
            { id: 1, operator: 'State Transport', from: 'Nearby City', to: 'Destination', departure: '20:00', arrival: '06:00+1', duration: '10h', price: 700, type: 'Sleeper AC', seats: 'Available' },
            { id: 2, operator: 'Private Travels', from: 'Major City', to: 'Destination', departure: '19:00', arrival: '05:00+1', duration: '10h', price: 900, type: 'Semi-Sleeper', seats: 'Available' },
        ],
        restaurants: [
            { id: 1, name: 'Local Flavors Restaurant', cuisine: 'Multi-cuisine', location: 'City Center', rating: 4.3, priceRange: '₹₹', specialty: 'Local Cuisine', popular: 'Special Thali' },
            { id: 2, name: 'Street Food Corner', cuisine: 'Street Food', location: 'Market Area', rating: 4.0, priceRange: '₹', specialty: 'Local Street Food', popular: 'Chaat' },
            { id: 3, name: 'Fine Dine Restaurant', cuisine: 'Continental', location: 'Downtown', rating: 4.4, priceRange: '₹₹₹', specialty: 'Fine Dining', popular: 'Grilled Specialties' },
        ]
    }
};

// Helper function to get city name from destination string
export const getCityName = (destination) => {
    if (!destination) return 'default';

    // Extract city name (handle formats like "Goa, Goa" or "Mumbai, Maharashtra")
    const cityName = destination.split(',')[0].trim();

    // Check if we have data for this city
    return INDIAN_CITIES_DATA[cityName] ? cityName : 'default';
};

// Get mock hotels for a destination
export const getMockHotels = (destination) => {
    const city = getCityName(destination);
    return INDIAN_CITIES_DATA[city]?.hotels || INDIAN_CITIES_DATA.default.hotels;
};

// Get mock flights for a destination
export const getMockFlights = (destination) => {
    const city = getCityName(destination);
    return INDIAN_CITIES_DATA[city]?.flights || INDIAN_CITIES_DATA.default.flights;
};

// Get mock trains for a destination
export const getMockTrains = (destination) => {
    const city = getCityName(destination);
    return INDIAN_CITIES_DATA[city]?.trains || INDIAN_CITIES_DATA.default.trains;
};

// Get mock restaurants for a destination
export const getMockRestaurants = (destination) => {
    const city = getCityName(destination);
    return INDIAN_CITIES_DATA[city]?.restaurants || INDIAN_CITIES_DATA.default.restaurants;
};

// Get mock buses for a destination
export const getMockBuses = (destination) => {
    const city = getCityName(destination);
    return INDIAN_CITIES_DATA[city]?.buses || INDIAN_CITIES_DATA.default.buses;
};

export default INDIAN_CITIES_DATA;
