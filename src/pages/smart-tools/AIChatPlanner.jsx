import { useState } from 'react';
import { useTripContext } from '../../context/TripContext';
import { Navigate, Link } from 'react-router-dom';
import './AIChatPlanner.css';

const AIChatPlanner = () => {
    const { activeTrip } = useTripContext();
    const [messages, setMessages] = useState([
        {
            type: 'ai',
            text: `Hello! I'm your AI travel assistant. I can help you plan your trip to ${activeTrip?.destination}. What would you like to know?`,
            timestamp: new Date().toISOString(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');

    if (!activeTrip) {
        return <Navigate to="/trip-creator" replace />;
    }

    // Mock AI responses
    const getMockResponse = (userMessage) => {
        const message = userMessage.toLowerCase();

        if (message.includes('hotel') || message.includes('stay')) {
            return `For ${activeTrip.destination}, I recommend staying in the city center for easy access to attractions. Popular areas include the main tourist zone and beachfront properties. Would you like specific hotel recommendations?`;
        }

        if (message.includes('food') || message.includes('restaurant')) {
            return `${activeTrip.destination} is known for its delicious local cuisine! I can suggest some popular restaurants and must-try dishes. What type of cuisine are you interested in?`;
        }

        if (message.includes('places') || message.includes('visit') || message.includes('attractions')) {
            return `There are many amazing places to visit in ${activeTrip.destination}! Based on your ${Math.ceil((new Date(activeTrip.endDate) - new Date(activeTrip.startDate)) / (1000 * 60 * 60 * 24))} day trip, I can create a detailed itinerary. Would you like me to suggest day-wise activities?`;
        }

        if (message.includes('budget') || message.includes('cost')) {
            return `For a ${activeTrip.travelers}-person trip to ${activeTrip.destination}, I can help you estimate costs for accommodation, food, transportation, and activities. What's your approximate budget range?`;
        }

        if (message.includes('weather')) {
            return `Let me check the weather forecast for ${activeTrip.destination} during your travel dates (${activeTrip.startDate} to ${activeTrip.endDate}). Generally, this time of year is pleasant for travel. I'll provide more specific details!`;
        }

        return `That's a great question about ${activeTrip.destination}! I'm here to help you plan the perfect trip. You can ask me about hotels, restaurants, attractions, budget, weather, or anything else related to your travel plans.`;
    };

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        // Add user message
        const userMsg = {
            type: 'user',
            text: inputMessage,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMsg]);

        // Simulate AI response delay
        setTimeout(() => {
            const aiMsg = {
                type: 'ai',
                text: getMockResponse(inputMessage),
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1000);

        setInputMessage('');
    };

    const suggestedQuestions = [
        'What are the best places to visit?',
        'Recommend some good restaurants',
        'What\'s the weather like?',
        'Help me plan a budget',
        'Suggest hotels to stay',
    ];

    return (
        <div className="ai-chat-planner-page">
            <div className="tool-header">
                <div>
                    <h1>💬 AI Chat Planner</h1>
                    <p className="tool-subtitle">Chat with AI about {activeTrip.destination}</p>
                </div>
                <Link to="/smart-tools" className="btn btn-secondary">
                    Back to Smart Tools
                </Link>
            </div>

            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.type}`}>
                            <div className="message-avatar">
                                {message.type === 'ai' ? '🤖' : '👤'}
                            </div>
                            <div className="message-content">
                                <p>{message.text}</p>
                                <span className="message-time">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="suggested-questions">
                    <p>Suggested questions:</p>
                    <div className="questions-list">
                        {suggestedQuestions.map((question, index) => (
                            <button
                                key={index}
                                className="question-btn"
                                onClick={() => setInputMessage(question)}
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="chat-input">
                    <input
                        type="text"
                        placeholder="Ask me anything about your trip..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button className="btn btn-primary" onClick={handleSendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChatPlanner;
