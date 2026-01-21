import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { TripConfirmationProvider } from './context/TripConfirmationContext';
import { StoryProvider } from './context/StoryContext';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Overview from './pages/Overview';
import TripCreator from './pages/TripCreator';
import AITripCreator from './pages/AITripCreator';
import TripDetails from './pages/TripDetails';
import TripConfirmation from './pages/TripConfirmation';
import CompleteTripSetup from './pages/CompleteTripSetup';
import DayPlanner from './pages/DayPlanner';
import SavedTrips from './pages/SavedTrips';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import HotelFinder from './pages/bookings/HotelFinder';
import AirbnbFinder from './pages/bookings/AirbnbFinder';
import ResortFinder from './pages/bookings/ResortFinder';
import Transport from './pages/bookings/Transport';
import Restaurants from './pages/bookings/Restaurants';
import TourPackages from './pages/bookings/TourPackages';
import ExpenseSplitter from './pages/smart-tools/ExpenseSplitter';
import CurrencyConverter from './pages/smart-tools/CurrencyConverter';
import SmartTools from './pages/SmartTools';
import PackingList from './pages/smart-tools/PackingList';
import SafetyAlerts from './pages/smart-tools/SafetyAlerts';
import EmergencyHelp from './pages/smart-tools/EmergencyHelp';
import AIChatPlanner from './pages/smart-tools/AIChatPlanner';
import TripStoryCreator from './pages/smart-tools/TripStoryCreator';
import TravelBuddyFinder from './pages/TravelBuddyFinder';
import Auth from './pages/Auth';
import EmailConfirmation from './pages/EmailConfirmation';
import SharedTripView from './pages/SharedTripView';
import Explore from './pages/Explore';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <TripProvider>
            <TripConfirmationProvider>
              <StoryProvider>
                <ScrollToTop />
                <div className="app">
                  <Navbar />
                  <main className="app-main">
                    <Routes>
                      <Route path="/" element={<Navigate to="/home" replace />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/auth/confirm" element={<EmailConfirmation />} />
                      <Route path="/shared/:shareToken" element={<SharedTripView />} />
                      <Route path="/explore" element={<Explore />} />

                      <Route path="/overview" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
                      <Route path="/trip-creator" element={<ProtectedRoute><TripCreator /></ProtectedRoute>} />
                      <Route path="/ai-trip-creator" element={<ProtectedRoute><AITripCreator /></ProtectedRoute>} />
                      <Route path="/trip-details" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
                      <Route path="/trip-confirmation" element={<ProtectedRoute><TripConfirmation /></ProtectedRoute>} />
                      <Route path="/complete-trip-setup" element={<ProtectedRoute><CompleteTripSetup /></ProtectedRoute>} />
                      <Route path="/day-planner" element={<ProtectedRoute><DayPlanner /></ProtectedRoute>} />
                      <Route path="/saved-trips" element={<ProtectedRoute><SavedTrips /></ProtectedRoute>} />
                      <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
                      <Route path="/bookings/hotels" element={<ProtectedRoute><HotelFinder /></ProtectedRoute>} />
                      <Route path="/bookings/airbnb" element={<ProtectedRoute><AirbnbFinder /></ProtectedRoute>} />
                      <Route path="/bookings/resorts" element={<ProtectedRoute><ResortFinder /></ProtectedRoute>} />
                      <Route path="/bookings/transport" element={<ProtectedRoute><Transport /></ProtectedRoute>} />
                      <Route path="/bookings/restaurants" element={<ProtectedRoute><Restaurants /></ProtectedRoute>} />
                      <Route path="/bookings/packages" element={<ProtectedRoute><TourPackages /></ProtectedRoute>} />
                      <Route path="/smart-tools/expenses" element={<ProtectedRoute><ExpenseSplitter /></ProtectedRoute>} />
                      <Route path="/smart-tools/currency" element={<ProtectedRoute><CurrencyConverter /></ProtectedRoute>} />
                      <Route path="/smart-tools" element={<ProtectedRoute><SmartTools /></ProtectedRoute>} />
                      <Route path="/smart-tools/packing" element={<ProtectedRoute><PackingList /></ProtectedRoute>} />
                      <Route path="/smart-tools/safety" element={<ProtectedRoute><SafetyAlerts /></ProtectedRoute>} />
                      <Route path="/smart-tools/emergency" element={<ProtectedRoute><EmergencyHelp /></ProtectedRoute>} />
                      <Route path="/smart-tools/ai-chat" element={<ProtectedRoute><AIChatPlanner /></ProtectedRoute>} />
                      <Route path="/smart-tools/story" element={<ProtectedRoute><TripStoryCreator /></ProtectedRoute>} />
                      <Route path="/travel-buddy" element={<ProtectedRoute><TravelBuddyFinder /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                      <Route path="*" element={<Navigate to="/overview" replace />} />
                    </Routes>
                  </main>
                </div>
              </StoryProvider>
            </TripConfirmationProvider>
          </TripProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
