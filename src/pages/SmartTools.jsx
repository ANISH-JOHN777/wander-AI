import { useTripContext } from '../context/TripContext';
import { Navigate, Link } from 'react-router-dom';
import { Bot, Backpack, Shield, Siren, MessageCircle, BookOpen, Sparkles, ArrowRight, Wallet, DollarSign } from 'lucide-react';
import './SmartTools.css';

const SmartTools = () => {
    const { activeTrip } = useTripContext();

    // Show message if no active trip
    if (!activeTrip) {
        return (
            <div className="smart-tools-page">
                <div className="no-trip-message">
                    <div className="message-icon"><Bot size={64} /></div>
                    <h2>No Active Trip</h2>
                    <p>You need to create a trip first to use Smart Tools & AI features.</p>
                    <Link to="/trip-creator" className="btn btn-primary btn-large">
                        Create Your First Trip
                    </Link>
                </div>
            </div>
        );
    }

    const tools = [
        {
            id: 'packing',
            title: 'Packing List',
            icon: Backpack,
            description: 'AI-generated packing list for your trip',
            path: '/smart-tools/packing',
            color: '#667eea',
        },
        {
            id: 'safety',
            title: 'Safety Alerts',
            icon: Shield,
            description: 'Safety tips and alerts for your destination',
            path: '/smart-tools/safety',
            color: '#f56565',
        },
        {
            id: 'emergency',
            title: 'Emergency Help',
            icon: Siren,
            description: 'Emergency contacts and assistance',
            path: '/smart-tools/emergency',
            color: '#ed8936',
        },
        {
            id: 'ai-chat',
            title: 'AI Chat Planner',
            icon: MessageCircle,
            description: 'Chat with AI to plan your trip',
            path: '/smart-tools/ai-chat',
            color: '#48bb78',
        },
        {
            id: 'story',
            title: 'Trip Story Creator',
            icon: BookOpen,
            description: 'Create and share your trip story',
            path: '/smart-tools/story',
            color: '#9f7aea',
        },
        {
            id: 'expenses',
            title: 'Expense Splitter',
            icon: Wallet,
            description: 'Split expenses with travel companions',
            path: '/smart-tools/expenses',
            color: '#f59e0b',
        },
        {
            id: 'currency',
            title: 'Currency Converter',
            icon: DollarSign,
            description: 'Convert currencies for your trip',
            path: '/smart-tools/currency',
            color: '#38b2ac',
        },
    ];

    return (
        <div className="smart-tools-page">
            <div className="tools-header">
                <div>
                    <h1>Smart Tools & AI</h1>
                    <p className="tools-subtitle">
                        AI-powered tools for {activeTrip.destination}
                    </p>
                </div>
                <Link to="/overview" className="btn btn-secondary">
                    Back to Overview
                </Link>
            </div>

            <div className="tools-grid">
                {tools.map(tool => {
                    const IconComponent = tool.icon;
                    return (
                        <Link
                            key={tool.id}
                            to={tool.path}
                            className="tool-card"
                            style={{ '--tool-color': tool.color }}
                        >
                            <div className="tool-icon">
                                <IconComponent size={32} />
                            </div>
                            <div className="tool-content">
                                <h3>{tool.title}</h3>
                                <p>{tool.description}</p>
                            </div>
                            <div className="tool-arrow"><ArrowRight size={20} /></div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default SmartTools;
