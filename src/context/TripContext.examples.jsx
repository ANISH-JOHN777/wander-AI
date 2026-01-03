/**
 * TripContext Usage Examples
 * 
 * This file demonstrates how to use the TripContext API
 */

import { useTripContext } from './TripContext';

// ============================================
// Example 1: Creating a New Trip
// ============================================

function CreateTripExample() {
    const { createTrip } = useTripContext();

    const handleCreateTrip = () => {
        const tripData = {
            destination: 'Paris, France',
            startDate: '2024-06-01',
            endDate: '2024-06-07',
            budget: 'moderate',
            travelers: 2,
            interests: ['Culture', 'Food', 'History'],
            accommodation: 'hotel',
            transportation: 'flight',
            itinerary: {
                summary: 'A wonderful week in Paris...',
                dailyItinerary: [],
                hotels: [],
            },
            status: 'planned',
        };

        // Create the trip - it will automatically:
        // 1. Generate a unique ID
        // 2. Add createdAt and updatedAt timestamps
        // 3. Add to trips array
        // 4. Set as activeTrip
        // 5. Save to localStorage
        const newTrip = createTrip(tripData);

        console.log('Created trip:', newTrip);
        // Returns: { ...tripData, id: 'trip_123...', createdAt: '...', updatedAt: '...' }
    };

    return (
        <button onClick={handleCreateTrip}>
            Create Trip
        </button>
    );
}

// ============================================
// Example 2: Selecting an Active Trip
// ============================================

function SelectTripExample() {
    const { trips, activeTrip, selectTrip } = useTripContext();

    const handleSelectTrip = (tripId) => {
        // Select a trip by ID
        const selected = selectTrip(tripId);

        if (selected) {
            console.log('Selected trip:', selected);
        } else {
            console.log('Trip not found');
        }
    };

    const handleClearSelection = () => {
        // Clear active trip by passing null
        selectTrip(null);
    };

    return (
        <div>
            <h3>All Trips:</h3>
            {trips.map(trip => (
                <div key={trip.id}>
                    <button onClick={() => handleSelectTrip(trip.id)}>
                        {trip.destination}
                        {activeTrip?.id === trip.id && ' ✓ (Active)'}
                    </button>
                </div>
            ))}
            <button onClick={handleClearSelection}>Clear Selection</button>
        </div>
    );
}

// ============================================
// Example 3: Updating the Active Trip
// ============================================

function UpdateActiveTripExample() {
    const { activeTrip, updateActiveTrip } = useTripContext();

    const handleUpdateStatus = () => {
        if (!activeTrip) {
            console.warn('No active trip to update');
            return;
        }

        // Update the active trip
        const updated = updateActiveTrip({
            status: 'ongoing',
        });

        console.log('Updated trip:', updated);
    };

    const handleAddNote = () => {
        if (!activeTrip) return;

        updateActiveTrip({
            notes: 'Remember to book restaurant reservations!',
        });
    };

    const handleUpdateItinerary = () => {
        if (!activeTrip) return;

        updateActiveTrip({
            itinerary: {
                ...activeTrip.itinerary,
                summary: 'Updated summary...',
            },
        });
    };

    if (!activeTrip) {
        return <p>No active trip selected</p>;
    }

    return (
        <div>
            <h3>Active Trip: {activeTrip.destination}</h3>
            <p>Status: {activeTrip.status}</p>
            <button onClick={handleUpdateStatus}>Mark as Ongoing</button>
            <button onClick={handleAddNote}>Add Note</button>
            <button onClick={handleUpdateItinerary}>Update Itinerary</button>
        </div>
    );
}

// ============================================
// Example 4: Complete Trip Management Component
// ============================================

function TripManagerExample() {
    const {
        trips,
        activeTrip,
        createTrip,
        selectTrip,
        updateActiveTrip,
        deleteTrip,
        getTripById,
        clearActiveTrip,
        clearAllTrips,
    } = useTripContext();

    // Create a new trip
    const handleCreate = () => {
        const newTrip = createTrip({
            destination: 'Tokyo, Japan',
            startDate: '2024-09-15',
            endDate: '2024-09-22',
            budget: 'luxury',
            travelers: 1,
            interests: ['Culture', 'Food', 'Technology'],
            status: 'planned',
        });
        console.log('Created:', newTrip);
    };

    // Select a trip
    const handleSelect = (id) => {
        const trip = selectTrip(id);
        console.log('Selected:', trip);
    };

    // Update active trip
    const handleUpdate = () => {
        if (activeTrip) {
            updateActiveTrip({ status: 'completed' });
        }
    };

    // Delete a trip
    const handleDelete = (id) => {
        if (window.confirm('Delete this trip?')) {
            deleteTrip(id);
        }
    };

    // Get trip by ID
    const handleGetById = (id) => {
        const trip = getTripById(id);
        console.log('Found trip:', trip);
    };

    return (
        <div>
            <h2>Trip Manager</h2>

            <div>
                <button onClick={handleCreate}>Create New Trip</button>
                <button onClick={clearActiveTrip}>Clear Active Trip</button>
                <button onClick={clearAllTrips}>Clear All Trips</button>
            </div>

            <div>
                <h3>Active Trip:</h3>
                {activeTrip ? (
                    <div>
                        <p>{activeTrip.destination}</p>
                        <p>Status: {activeTrip.status}</p>
                        <button onClick={handleUpdate}>Mark Completed</button>
                    </div>
                ) : (
                    <p>No active trip</p>
                )}
            </div>

            <div>
                <h3>All Trips ({trips.length}):</h3>
                {trips.map(trip => (
                    <div key={trip.id}>
                        <span>{trip.destination}</span>
                        <button onClick={() => handleSelect(trip.id)}>Select</button>
                        <button onClick={() => handleDelete(trip.id)}>Delete</button>
                        <button onClick={() => handleGetById(trip.id)}>Get Info</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================
// Example 5: Safe Usage (Handling No Active Trip)
// ============================================

function SafeUsageExample() {
    const { activeTrip, updateActiveTrip } = useTripContext();

    const handleSafeUpdate = () => {
        // Always check if activeTrip exists before updating
        if (!activeTrip) {
            console.log('No trip to update');
            return;
        }

        // Safe to update now
        updateActiveTrip({ status: 'ongoing' });
    };

    return (
        <div>
            {activeTrip ? (
                <div>
                    <h3>{activeTrip.destination}</h3>
                    <button onClick={handleSafeUpdate}>Update</button>
                </div>
            ) : (
                <div>
                    <p>No active trip. Create one first!</p>
                </div>
            )}
        </div>
    );
}

// ============================================
// API Reference
// ============================================

/*

TripContext API Reference:

STATE:
------
- trips: Array<Trip>          - Array of all trips
- activeTrip: Trip | null     - Currently selected trip
- loading: boolean            - Loading state for async operations

FUNCTIONS:
----------
1. createTrip(tripData: Object): Trip
   - Creates a new trip with auto-generated ID and timestamps
   - Adds to trips array
   - Automatically sets as activeTrip
   - Persists to localStorage
   - Returns the created trip

2. selectTrip(tripId: string | null): Trip | null
   - Selects a trip by ID and sets as activeTrip
   - Pass null to clear selection
   - Returns the selected trip or null if not found
   - Persists to localStorage

3. updateActiveTrip(updates: Object): Trip | null
   - Updates the active trip with new data
   - Updates both activeTrip and the trip in trips array
   - Auto-updates the updatedAt timestamp
   - Returns the updated trip or null if no active trip
   - Persists to localStorage

UTILITY FUNCTIONS:
------------------
- deleteTrip(tripId: string): void
- getTripById(tripId: string): Trip | undefined
- clearActiveTrip(): void
- clearAllTrips(): void
- setLoading(loading: boolean): void

TRIP OBJECT STRUCTURE:
----------------------
{
  id: string,                    // Auto-generated: 'trip_timestamp_random'
  destination: string,
  startDate: string,             // ISO date string
  endDate: string,               // ISO date string
  budget: string,                // 'budget' | 'moderate' | 'luxury'
  travelers: number,
  interests: string[],
  accommodation: string,
  transportation: string,
  itinerary: Object,             // AI-generated itinerary
  status: string,                // 'planned' | 'ongoing' | 'completed'
  createdAt: string,             // Auto-generated ISO timestamp
  updatedAt: string,             // Auto-updated ISO timestamp
  ...any other custom fields
}

LOCALSTORAGE KEYS:
------------------
- 'aiTripPlanner_trips'        - Stores trips array
- 'aiTripPlanner_activeTrip'   - Stores active trip

ERROR HANDLING:
---------------
- All localStorage operations are wrapped in try-catch
- App initializes with empty state if loading fails
- Functions check for null/undefined before operations
- Console warnings for invalid operations

*/

export {
    CreateTripExample,
    SelectTripExample,
    UpdateActiveTripExample,
    TripManagerExample,
    SafeUsageExample,
};
