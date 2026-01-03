import { useState } from 'react';
import { useTripContext } from '../../context/TripContext';
import { Navigate, Link } from 'react-router-dom';
import './PackingList.css';

const PackingList = () => {
    const { activeTrip, updateActiveTrip } = useTripContext();
    const [newItem, setNewItem] = useState('');

    if (!activeTrip) {
        return <Navigate to="/trip-creator" replace />;
    }

    // Get or initialize packing list
    const getPackingList = () => {
        return activeTrip.packingList || {
            essentials: [],
            clothing: [],
            electronics: [],
            toiletries: [],
            documents: [],
            custom: []
        };
    };

    const packingList = getPackingList();

    // Mock AI-generated suggestions based on trip data
    const getSuggestions = () => {
        const suggestions = {
            essentials: ['Passport', 'Wallet', 'Phone', 'Chargers', 'Medications'],
            clothing: ['Comfortable shoes', 'Light clothes', 'Jacket', 'Sunglasses', 'Hat'],
            electronics: ['Phone charger', 'Power bank', 'Camera', 'Headphones'],
            toiletries: ['Toothbrush', 'Toothpaste', 'Sunscreen', 'Hand sanitizer'],
            documents: ['ID proof', 'Hotel bookings', 'Travel insurance', 'Emergency contacts'],
        };

        // Add destination-specific items (mock logic)
        if (activeTrip.destination.toLowerCase().includes('beach') ||
            activeTrip.destination.toLowerCase().includes('goa')) {
            suggestions.clothing.push('Swimwear', 'Beach towel');
            suggestions.essentials.push('Sunscreen SPF 50+');
        }

        if (activeTrip.destination.toLowerCase().includes('hill') ||
            activeTrip.destination.toLowerCase().includes('shimla') ||
            activeTrip.destination.toLowerCase().includes('manali')) {
            suggestions.clothing.push('Warm jacket', 'Gloves', 'Thermal wear');
        }

        return suggestions;
    };

    const suggestions = getSuggestions();

    const handleAddItem = (category) => {
        if (!newItem.trim()) return;

        const updatedList = {
            ...packingList,
            [category]: [...packingList[category], { item: newItem, packed: false }]
        };

        updateActiveTrip({ packingList: updatedList });
        setNewItem('');
    };

    const handleToggleItem = (category, index) => {
        const updatedList = {
            ...packingList,
            [category]: packingList[category].map((item, i) =>
                i === index ? { ...item, packed: !item.packed } : item
            )
        };

        updateActiveTrip({ packingList: updatedList });
    };

    const handleDeleteItem = (category, index) => {
        const updatedList = {
            ...packingList,
            [category]: packingList[category].filter((_, i) => i !== index)
        };

        updateActiveTrip({ packingList: updatedList });
    };

    const categories = [
        { id: 'essentials', label: 'Essentials', icon: '🎒' },
        { id: 'clothing', label: 'Clothing', icon: '👕' },
        { id: 'electronics', label: 'Electronics', icon: '📱' },
        { id: 'toiletries', label: 'Toiletries', icon: '🧴' },
        { id: 'documents', label: 'Documents', icon: '📄' },
        { id: 'custom', label: 'Custom Items', icon: '✨' },
    ];

    return (
        <div className="packing-list-page">
            <div className="tool-header">
                <div>
                    <h1>🎒 Packing List</h1>
                    <p className="tool-subtitle">AI-generated packing list for {activeTrip.destination}</p>
                </div>
                <Link to="/smart-tools" className="btn btn-secondary">
                    Back to Smart Tools
                </Link>
            </div>

            <div className="ai-suggestions">
                <h3>✨ AI Suggestions</h3>
                <p>Based on your trip to {activeTrip.destination}</p>
                <div className="suggestions-grid">
                    {Object.entries(suggestions).map(([category, items]) => (
                        <div key={category} className="suggestion-category">
                            <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                            <ul>
                                {items.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="packing-categories">
                {categories.map(category => (
                    <div key={category.id} className="packing-category">
                        <div className="category-header">
                            <h3>
                                <span className="category-icon">{category.icon}</span>
                                {category.label}
                            </h3>
                            <span className="item-count">
                                {packingList[category.id]?.length || 0} items
                            </span>
                        </div>

                        <div className="items-list">
                            {packingList[category.id]?.map((item, index) => (
                                <div key={index} className={`packing-item ${item.packed ? 'packed' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={item.packed}
                                        onChange={() => handleToggleItem(category.id, index)}
                                    />
                                    <span className="item-text">{item.item}</span>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDeleteItem(category.id, index)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            {(!packingList[category.id] || packingList[category.id].length === 0) && (
                                <p className="empty-category">No items added yet</p>
                            )}
                        </div>

                        <div className="add-item-form">
                            <input
                                type="text"
                                placeholder="Add new item..."
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddItem(category.id)}
                            />
                            <button
                                className="btn btn-primary btn-small"
                                onClick={() => handleAddItem(category.id)}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PackingList;
