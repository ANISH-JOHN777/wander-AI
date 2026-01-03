import { Link } from 'react-router-dom';
import {
    MapPin, Bot, Edit3, Save, Calendar, Globe, Users, Hotel,
    DollarSign, Map, BookOpen, Smartphone, RefreshCw, Sparkles, CheckCircle
} from 'lucide-react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Plan Your Perfect Trip with <span className="gradient-text">AI Intelligence</span>
                        </h1>
                        <p className="hero-description">
                            Smart, stress-free trip planning powered by AI. Create personalized itineraries,
                            manage bookings, and organize every detail of your journey—all in one place.
                        </p>
                        <div className="hero-actions">
                            <Link to="/ai-trip-creator" className="btn btn-primary btn-lg">
                                <Bot size={20} />
                                Create Trip with AI
                            </Link>
                            <Link to="/trip-creator" className="btn btn-secondary btn-lg">
                                <Edit3 size={20} />
                                Create Trip Manually
                            </Link>
                            <Link to="/complete-trip-setup" className="btn btn-primary btn-lg">
                                <CheckCircle size={20} />
                                Complete Trip Setup
                            </Link>
                        </div>
                        <p className="hero-note">
                            <strong>AI Mode:</strong> Get instant detailed itinerary • <strong>Manual Mode:</strong> Plan step by step • <strong>Complete Setup:</strong> All-in-one trip configuration
                        </p>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">10K+</span>
                                <span className="stat-label">Trips Planned</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">50+</span>
                                <span className="stat-label">Destinations</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">98%</span>
                                <span className="stat-label">Satisfaction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header">
                        <h2>How It Works</h2>
                        <p>Plan your perfect trip in 4 simple steps</p>
                    </div>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <MapPin className="step-icon" size={48} strokeWidth={1.5} />
                            <h3>Choose Destination</h3>
                            <p>Select your destination, travel dates, and trip type (solo, couple, or group)</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <Bot className="step-icon" size={48} strokeWidth={1.5} />
                            <h3>AI Builds Itinerary</h3>
                            <p>Our AI analyzes your preferences and creates a personalized day-wise itinerary</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <Edit3 className="step-icon" size={48} strokeWidth={1.5} />
                            <h3>Customize Plans</h3>
                            <p>Edit activities, add bookings, manage expenses, and fine-tune every detail</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">4</div>
                            <Save className="step-icon" size={48} strokeWidth={1.5} />
                            <h3>Save & Manage</h3>
                            <p>Access your trips anytime, share with friends, and revisit your travel memories</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features Section */}
            <section className="features-section" id="features">
                <div className="container">
                    <div className="section-header">
                        <h2>Powerful Features for Smart Travel</h2>
                        <p>Everything you need to plan, book, and enjoy your perfect trip</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <Bot className="feature-icon" size={40} strokeWidth={1.5} />
                            <h3>AI Trip Planner</h3>
                            <p>Get intelligent suggestions for activities, restaurants, and attractions based on your preferences</p>
                        </div>
                        <div className="feature-card">
                            <Calendar className="feature-icon" size={40} strokeWidth={1.5} />
                            <h3>Day-wise Itinerary</h3>
                            <p>Organize your trip with detailed day-by-day plans, timings, and activity tracking</p>
                        </div>
                        <div className="feature-card">
                            <Globe className="feature-icon" size={40} strokeWidth={1.5} />
                            <h3>Multi-city Planning</h3>
                            <p>Plan complex trips across multiple cities with seamless transitions and logistics</p>
                        </div>
                        <div className="feature-card">
                            <Users className="feature-icon" size={40} strokeWidth={1.5} />
                            <h3>Group Travel Mode</h3>
                            <p>Coordinate with friends and family, split expenses, and manage group activities</p>
                        </div>
                        <div className="feature-card">
                            <Hotel className="feature-icon" size={40} strokeWidth={1.5} />
                            <h3>Smart Bookings</h3>
                            <p>Find and compare hotels, flights, trains, and restaurants all in one place</p>
                        </div>
                        <div className="feature-card">
                            <DollarSign className="feature-icon" size={40} strokeWidth={1.5} />
                            <h3>Expense Splitter</h3>
                            <p>Track shared expenses and automatically calculate who owes what</p>
                        </div>
                        <div className="feature-card">
                            <Map className="feature-icon" size={40} strokeWidth={1.5} />
                            <h3>Maps & Navigation</h3>
                            <p>Integrated maps with directions, distance calculations, and location tracking</p>
                        </div>
                        <div className="feature-card">
                            <BookOpen className="feature-icon" size={40} strokeWidth={1.5} />
                            <h3>Trip Story Creator</h3>
                            <p>Create beautiful travel stories with photos and memories to share with others</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="why-choose-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Choose WanderAI?</h2>
                        <p>The smartest way to plan your travels</p>
                    </div>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <Smartphone className="benefit-icon" size={56} strokeWidth={1.5} />
                            <h3>All Trips in One Place</h3>
                            <p>Never lose track of your travel plans. Access all your trips, past and future, from a single dashboard</p>
                        </div>
                        <div className="benefit-card">
                            <RefreshCw className="benefit-icon" size={56} strokeWidth={1.5} />
                            <h3>Fully Synced Planning</h3>
                            <p>Changes sync instantly across all devices. Your itinerary is always up-to-date, wherever you are</p>
                        </div>
                        <div className="benefit-card">
                            <MapPin className="benefit-icon" size={56} strokeWidth={1.5} />
                            <h3>India-Focused Intelligence</h3>
                            <p>Specialized AI trained on Indian destinations, culture, and travel patterns for authentic recommendations</p>
                        </div>
                        <div className="benefit-card">
                            <Sparkles className="benefit-icon" size={56} strokeWidth={1.5} />
                            <h3>Clean, Modern Interface</h3>
                            <p>Intuitive design that makes trip planning enjoyable. No clutter, just what you need</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Start Your Journey?</h2>
                        <p>Join thousands of travelers who plan smarter with WanderAI</p>
                        <Link to="/trip-creator" className="btn btn-primary btn-lg">
                            Start Planning Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <Globe size={24} strokeWidth={2} />
                                <span>WanderAI</span>
                            </div>
                            <p>AI-powered trip planning made simple</p>
                        </div>
                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Product</h4>
                                <Link to="/overview">Overview</Link>
                                <Link to="/trip-creator">Create Trip</Link>
                                <Link to="/smart-tools">Smart Tools</Link>
                            </div>
                            <div className="footer-column">
                                <h4>Features</h4>
                                <Link to="/day-planner">Day Planner</Link>
                                <Link to="/bookings">Bookings</Link>
                                <Link to="/saved-trips">Saved Trips</Link>
                            </div>
                            <div className="footer-column">
                                <h4>Support</h4>
                                <Link to="/settings">Settings</Link>
                                <a href="#help">Help Center</a>
                                <a href="#contact">Contact Us</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 WanderAI. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
