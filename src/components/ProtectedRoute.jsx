import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return (
            <div className="sign-in-required">
                <div className="sign-in-required-content">
                    <Lock className="lock-icon" size={64} />
                    <h2>Sign In Required</h2>
                    <p>Please sign in to plan your day-wise itinerary and save your activities.</p>
                    <button
                        className="sign-in-now-btn"
                        onClick={() => navigate('/auth')}
                    >
                        Sign In Now
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
