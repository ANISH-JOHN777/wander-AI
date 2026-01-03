import { useTripContext } from '../../context/TripContext';
import { Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Wallet, Plus, Trash2, Users, DollarSign, Luggage, Heart } from 'lucide-react';
import './ExpenseSplitter.css';

const ExpenseSplitter = () => {
    const { activeTrip } = useTripContext();
    const [expenses, setExpenses] = useState([
        { id: 1, description: 'Hotel Booking', amount: 12000, paidBy: 'Person 1', category: 'Accommodation' },
        { id: 2, description: 'Flight Tickets', amount: 8000, paidBy: 'Person 2', category: 'Transport' },
        { id: 3, description: 'Dinner at Restaurant', amount: 2500, paidBy: 'Person 1', category: 'Food' },
    ]);
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        paidBy: 'Person 1',
        category: 'Food'
    });

    if (!activeTrip) {
        return <Navigate to="/trip-creator" replace />;
    }

    const travelers = activeTrip.travelers || 1;
    const peopleList = Array.from({ length: travelers }, (_, i) => `Person ${i + 1}`);
    const categories = ['Food', 'Transport', 'Accommodation', 'Activities', 'Shopping', 'Other'];

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const perPersonShare = totalExpenses / travelers;

    // Calculate how much each person paid
    const paidByPerson = {};
    peopleList.forEach(person => {
        paidByPerson[person] = expenses
            .filter(exp => exp.paidBy === person)
            .reduce((sum, exp) => sum + exp.amount, 0);
    });

    // Calculate settlements
    const settlements = [];
    peopleList.forEach(person => {
        const balance = paidByPerson[person] - perPersonShare;
        if (balance !== 0) {
            settlements.push({
                person,
                balance,
                status: balance > 0 ? 'receives' : 'owes'
            });
        }
    });

    const addExpense = () => {
        if (newExpense.description && newExpense.amount) {
            setExpenses([...expenses, {
                id: Date.now(),
                description: newExpense.description,
                amount: parseFloat(newExpense.amount),
                paidBy: newExpense.paidBy,
                category: newExpense.category
            }]);
            setNewExpense({ description: '', amount: '', paidBy: 'Person 1', category: 'Food' });
        }
    };

    const removeExpense = (id) => {
        setExpenses(expenses.filter(exp => exp.id !== id));
    };

    return (
        <div className="expense-splitter-page">
            <div className="module-header">
                <div>
                    <h1><Wallet size={32} /> Expense Splitter</h1>
                    <p className="module-subtitle">Split expenses for {activeTrip.destination}</p>
                </div>
                <Link to="/smart-tools" className="btn btn-secondary">
                    Back to Smart Tools
                </Link>
            </div>

            <div className="search-criteria">
                <h3>Trip Information</h3>
                <div className="criteria-grid">
                    <div className="criteria-item">
                        <span className="criteria-label">Destination:</span>
                        <span className="criteria-value">{activeTrip.destination}</span>
                    </div>
                    <div className="criteria-item">
                        <span className="criteria-label">Travel Type:</span>
                        <span className="criteria-value">
                            {activeTrip.travelType === 'solo' && <><Luggage size={16} /> Solo</>}
                            {activeTrip.travelType === 'couple' && <><Heart size={16} /> Couple</>}
                            {activeTrip.travelType === 'group' && <><Users size={16} /> Group</>}
                        </span>
                    </div>
                    <div className="criteria-item">
                        <span className="criteria-label">Total Travelers:</span>
                        <span className="criteria-value">{activeTrip.travelers || 1}</span>
                    </div>
                    <div className="criteria-item">
                        <span className="criteria-label">Trip Dates:</span>
                        <span className="criteria-value">
                            {activeTrip.startDate} to {activeTrip.endDate}
                        </span>
                    </div>
                </div>
            </div>

            <div className="expense-container">
                {/* Summary Cards */}
                <div className="expense-summary">
                    <div className="summary-card">
                        <div className="summary-icon">
                            <DollarSign size={24} />
                        </div>
                        <div className="summary-details">
                            <div className="summary-label">Total Expenses</div>
                            <div className="summary-value">₹{totalExpenses.toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon">
                            <Users size={24} />
                        </div>
                        <div className="summary-details">
                            <div className="summary-label">Per Person</div>
                            <div className="summary-value">₹{perPersonShare.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-icon">
                            <Wallet size={24} />
                        </div>
                        <div className="summary-details">
                            <div className="summary-label">Total Items</div>
                            <div className="summary-value">{expenses.length}</div>
                        </div>
                    </div>
                </div>

                <div className="expense-content">
                    {/* Add Expense Form */}
                    <div className="add-expense-card">
                        <h3><Plus size={20} /> Add New Expense</h3>
                        <div className="expense-form">
                            <input
                                type="text"
                                placeholder="Description (e.g., Lunch at cafe)"
                                value={newExpense.description}
                                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                className="expense-input"
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                className="expense-input"
                                min="0"
                                step="0.01"
                            />
                            <select
                                value={newExpense.paidBy}
                                onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                                className="expense-select"
                            >
                                {peopleList.map(person => (
                                    <option key={person} value={person}>{person}</option>
                                ))}
                            </select>
                            <select
                                value={newExpense.category}
                                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                className="expense-select"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <button onClick={addExpense} className="btn btn-primary">
                                <Plus size={16} /> Add Expense
                            </button>
                        </div>
                    </div>

                    {/* Expenses List */}
                    <div className="expenses-list-card">
                        <h3>All Expenses</h3>
                        <div className="expenses-list">
                            {expenses.map(expense => (
                                <div key={expense.id} className="expense-item">
                                    <div className="expense-item-header">
                                        <div className="expense-description">
                                            <h4>{expense.description}</h4>
                                            <span className="expense-category">{expense.category}</span>
                                        </div>
                                        <button
                                            onClick={() => removeExpense(expense.id)}
                                            className="delete-btn"
                                            title="Remove expense"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="expense-item-details">
                                        <div className="expense-amount">₹{expense.amount.toLocaleString('en-IN')}</div>
                                        <div className="expense-paid-by">Paid by: {expense.paidBy}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Settlement Section */}
                <div className="settlement-card">
                    <h3>Settlement Summary</h3>
                    <div className="settlement-list">
                        {peopleList.map(person => {
                            const paid = paidByPerson[person] || 0;
                            const balance = paid - perPersonShare;
                            return (
                                <div key={person} className="settlement-item">
                                    <div className="settlement-person">{person}</div>
                                    <div className="settlement-details">
                                        <span className="settlement-paid">Paid: ₹{paid.toLocaleString('en-IN')}</span>
                                        <span className={`settlement-balance ${balance >= 0 ? 'positive' : 'negative'}`}>
                                            {balance >= 0 ? 'Receives' : 'Owes'}: ₹{Math.abs(balance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseSplitter;
