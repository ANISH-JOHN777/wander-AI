import { useTripContext } from '../../context/TripContext';
import { Navigate, Link } from 'react-router-dom';
import { Info, AlertTriangle, Palmtree, Mountain, Shield, Check } from 'lucide-react';
import './SafetyAlerts.css';

const SafetyAlerts = () => {
    const { activeTrip } = useTripContext();

    if (!activeTrip) {
        return <Navigate to="/trip-creator" replace />;
    }

    // Mock safety alerts based on destination
    const getSafetyAlerts = () => {
        const alerts = [
            {
                type: 'info',
                icon: Info,
                title: 'General Safety',
                message: 'Keep your valuables secure and be aware of your surroundings.',
            },
            {
                type: 'warning',
                icon: AlertTriangle,
                title: 'Travel Advisory',
                message: 'Check local weather conditions before heading out.',
            },
        ];

        // Add destination-specific alerts (mock logic)
        if (activeTrip.destination.toLowerCase().includes('goa')) {
            alerts.push({
                type: 'info',
                icon: Palmtree,
                title: 'Beach Safety',
                message: 'Swim only in designated areas and follow lifeguard instructions.',
            });
        }

        if (activeTrip.destination.toLowerCase().includes('hill') ||
            activeTrip.destination.toLowerCase().includes('shimla')) {
            alerts.push({
                type: 'warning',
                icon: Mountain,
                title: 'Mountain Safety',
                message: 'Carry warm clothing and be prepared for sudden weather changes.',
            });
        }

        return alerts;
    };

    const safetyTips = [
        'Keep emergency contacts saved in your phone',
        'Share your itinerary with family or friends',
        'Keep copies of important documents',
        'Stay hydrated and carry water',
        'Use trusted transportation services',
        'Keep your hotel address written down',
        'Avoid displaying expensive items',
        'Know the local emergency numbers',
    ];

    const alerts = getSafetyAlerts();

    return (
        <div className="safety-alerts-page">
            <div className="tool-header">
                <div>
                    <h1><Shield size={32} style={{ display: 'inline', marginRight: '8px' }} /> Safety Alerts</h1>
                    <p className="tool-subtitle">Safety information for {activeTrip.destination}</p>
                </div>
                <Link to="/smart-tools" className="btn btn-secondary">
                    Back to Smart Tools
                </Link>
            </div>

            <div className="alerts-section">
                <h3>Active Alerts</h3>
                <div className="alerts-list">
                    {alerts.map((alert, index) => {
                        const IconComponent = alert.icon;
                        return (
                            <div key={index} className={`alert-card alert-${alert.type}`}>
                                <div className="alert-icon">
                                    <IconComponent size={32} />
                                </div>
                                <div className="alert-content">
                                    <h4>{alert.title}</h4>
                                    <p>{alert.message}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="safety-tips-section">
                <h3>Safety Tips</h3>
                <div className="tips-grid">
                    {safetyTips.map((tip, index) => (
                        <div key={index} className="tip-card">
                            <span className="tip-icon"><Check size={18} /></span>
                            <span className="tip-text">{tip}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="trip-info-card">
                <h3>Trip Information</h3>
                <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">Destination:</span>
                        <span className="info-value">{activeTrip.destination}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Travel Dates:</span>
                        <span className="info-value">
                            {activeTrip.startDate} to {activeTrip.endDate}
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Travelers:</span>
                        <span className="info-value">{activeTrip.travelers || 1}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SafetyAlerts;
