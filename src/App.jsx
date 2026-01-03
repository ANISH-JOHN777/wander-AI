import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { TripConfirmationProvider } from './context/TripConfirmationContext';
import { StoryProvider } from './context/StoryContext';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
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
import Auth from './pages/Auth';
import EmailConfirmation from './pages/EmailConfirmation';
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
                      <Route path="/overview" element={<Overview />} />
                      <Route path="/trip-creator" element={<TripCreator />} />
                      <Route path="/ai-trip-creator" element={<AITripCreator />} />
                      <Route path="/trip-details" element={<TripDetails />} />
                      <Route path="/trip-confirmation" element={<TripConfirmation />} />
                      <Route path="/complete-trip-setup" element={<CompleteTripSetup />} />
                      <Route path="/day-planner" element={<DayPlanner />} />
                      <Route path="/saved-trips" element={<SavedTrips />} />
                      <Route path="/bookings" element={<Bookings />} />
                      <Route path="/bookings/hotels" element={<HotelFinder />} />
                      <Route path="/bookings/airbnb" element={<AirbnbFinder />} />
                      <Route path="/bookings/resorts" element={<ResortFinder />} />
                      <Route path="/bookings/transport" element={<Transport />} />
                      <Route path="/bookings/restaurants" element={<Restaurants />} />
                      <Route path="/bookings/packages" element={<TourPackages />} />
                      <Route path="/smart-tools/expenses" element={<ExpenseSplitter />} />
                      <Route path="/smart-tools/currency" element={<CurrencyConverter />} />
                      <Route path="/smart-tools" element={<SmartTools />} />
                      <Route path="/smart-tools/packing" element={<PackingList />} />
                      <Route path="/smart-tools/safety" element={<SafetyAlerts />} />
                      <Route path="/smart-tools/emergency" element={<EmergencyHelp />} />
                      <Route path="/smart-tools/ai-chat" element={<AIChatPlanner />} />
                      <Route path="/smart-tools/story" element={<TripStoryCreator />} />
                      <Route path="/settings" element={<Settings />} />
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
