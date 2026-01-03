import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { tripService, dayPlanService, storyService } from '../services';
import { getBackendMode } from '../config/supabase';

const TripContext = createContext();

export const useTripContext = () => {
    const context = useContext(TripContext);
    if (!context) {
        throw new Error('useTripContext must be used within a TripProvider');
    }
    return context;
};

export const TripProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [trips, setTrips] = useState([]);
    const [activeTrip, setActiveTrip] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [syncing, setSyncing] = useState(false);

    // Load trips on mount and when auth state changes
    useEffect(() => {
        loadTrips();
    }, [isAuthenticated, user]);

    /**
     * Load trips from backend or localStorage
     */
    const loadTrips = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔄 TripContext: Loading trips...');
            const { trips: loadedTrips, error: loadError } = await tripService.getTrips();

            if (loadError) {
                console.error('❌ TripContext: Error loading trips:', loadError);
                setError(loadError);
                setTrips([]);
                return;
            }

            console.log(`✅ TripContext: Loaded ${loadedTrips.length} trip(s)`);
            setTrips(loadedTrips);

            // Load active trip
            await loadActiveTrip();
        } catch (err) {
            console.error('❌ TripContext: Exception loading trips:', err);
            setError(err);
            setTrips([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Load active trip from backend or localStorage
     */
    const loadActiveTrip = async () => {
        try {
            const { trip: activeTrip, error: activeError } = await tripService.getActiveTrip();

            if (activeError) {
                console.warn('⚠️ TripContext: No active trip found');
                setActiveTrip(null);
                return;
            }

            if (activeTrip) {
                console.log('✈️ TripContext: Active trip loaded', activeTrip);
                setActiveTrip(activeTrip);
            }
        } catch (err) {
            console.error('❌ TripContext: Error loading active trip:', err);
            setActiveTrip(null);
        }
    };

    /**
     * Create a new trip and save to backend
     * @param {Object} tripData - The trip data to create
     * @returns {Object} The created trip
     */
    const createTrip = async (tripData) => {
        try {
            setLoading(true);
            setError(null);

            console.log('➕ TripContext: Creating trip...', tripData);
            const { trip: newTrip, error: createError } = await tripService.createTrip(tripData);

            if (createError) {
                console.error('❌ TripContext: Error creating trip:', createError);
                setError(createError);
                throw createError;
            }

            console.log('✅ TripContext: Trip created', newTrip);

            // Update local state
            setTrips(prevTrips => [newTrip, ...prevTrips]);

            // Set as active trip
            setActiveTrip(newTrip);
            await tripService.setActiveTrip(newTrip.id);

            return newTrip;
        } catch (err) {
            console.error('❌ TripContext: Exception creating trip:', err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Select a trip by ID and set it as the active trip
     * @param {string} tripId - The ID of the trip to select
     * @returns {Object|null} The selected trip or null if not found
     */
    const selectTrip = async (tripId) => {
        try {
            if (!tripId) {
                setActiveTrip(null);
                return null;
            }

            console.log('🎯 TripContext: Selecting trip', tripId);

            // Find trip in local state first
            let trip = trips.find(t => t.id === tripId);

            // If not in local state, fetch from backend
            if (!trip) {
                const { trip: fetchedTrip, error: fetchError } = await tripService.getTrip(tripId);

                if (fetchError || !fetchedTrip) {
                    console.warn(`⚠️ TripContext: Trip ${tripId} not found`);
                    return null;
                }

                trip = fetchedTrip;
                // Add to local state
                setTrips(prevTrips => [trip, ...prevTrips]);
            }

            // Set as active trip
            setActiveTrip(trip);
            await tripService.setActiveTrip(tripId);

            console.log('✅ TripContext: Trip selected', trip);
            return trip;
        } catch (err) {
            console.error('❌ TripContext: Error selecting trip:', err);
            return null;
        }
    };

    /**
     * Update the active trip with new data
     * @param {Object} updates - The updates to apply to the active trip
     * @returns {Object|null} The updated trip or null if no active trip
     */
    const updateActiveTrip = async (updates) => {
        try {
            if (!activeTrip) {
                console.warn('⚠️ TripContext: No active trip to update');
                return null;
            }

            console.log('📝 TripContext: Updating active trip...', updates);

            const { trip: updatedTrip, error: updateError } = await tripService.updateTrip(
                activeTrip.id,
                updates
            );

            if (updateError) {
                console.error('❌ TripContext: Error updating trip:', updateError);
                setError(updateError);
                throw updateError;
            }

            console.log('✅ TripContext: Trip updated', updatedTrip);

            // Update in trips array
            setTrips(prevTrips =>
                prevTrips.map(trip =>
                    trip.id === activeTrip.id ? updatedTrip : trip
                )
            );

            // Update active trip
            setActiveTrip(updatedTrip);

            return updatedTrip;
        } catch (err) {
            console.error('❌ TripContext: Exception updating trip:', err);
            setError(err);
            throw err;
        }
    };

    /**
     * Update a specific trip by ID
     * @param {string} tripId - The ID of the trip to update
     * @param {Object} updates - The updates to apply
     * @returns {Object|null} The updated trip
     */
    const updateTrip = async (tripId, updates) => {
        try {
            console.log('📝 TripContext: Updating trip', tripId, updates);

            const { trip: updatedTrip, error: updateError } = await tripService.updateTrip(
                tripId,
                updates
            );

            if (updateError) {
                console.error('❌ TripContext: Error updating trip:', updateError);
                setError(updateError);
                throw updateError;
            }

            console.log('✅ TripContext: Trip updated', updatedTrip);

            // Update in trips array
            setTrips(prevTrips =>
                prevTrips.map(trip =>
                    trip.id === tripId ? updatedTrip : trip
                )
            );

            // Update active trip if it's the one being updated
            if (activeTrip?.id === tripId) {
                setActiveTrip(updatedTrip);
            }

            return updatedTrip;
        } catch (err) {
            console.error('❌ TripContext: Exception updating trip:', err);
            setError(err);
            throw err;
        }
    };

    /**
     * Delete a trip by ID
     * @param {string} tripId - The ID of the trip to delete
     */
    const deleteTrip = async (tripId) => {
        try {
            console.log('🗑️ TripContext: Deleting trip', tripId);

            const { error: deleteError } = await tripService.deleteTrip(tripId);

            if (deleteError) {
                console.error('❌ TripContext: Error deleting trip:', deleteError);
                setError(deleteError);
                throw deleteError;
            }

            console.log('✅ TripContext: Trip deleted');

            // Remove from trips array
            setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));

            // Clear active trip if it's the one being deleted
            if (activeTrip?.id === tripId) {
                setActiveTrip(null);
            }
        } catch (err) {
            console.error('❌ TripContext: Exception deleting trip:', err);
            setError(err);
            throw err;
        }
    };

    /**
     * Get a trip by ID
     * @param {string} tripId - The ID of the trip to get
     * @returns {Object|undefined} The trip or undefined if not found
     */
    const getTripById = (tripId) => {
        return trips.find(trip => trip.id === tripId);
    };

    /**
     * Clear the active trip
     */
    const clearActiveTrip = () => {
        setActiveTrip(null);
    };

    /**
     * Sync trip data with backend
     * Useful for refreshing data after external changes
     */
    const syncTrips = async () => {
        try {
            setSyncing(true);
            console.log('🔄 TripContext: Syncing trips with backend...');
            await loadTrips();
            console.log('✅ TripContext: Sync complete');
        } catch (err) {
            console.error('❌ TripContext: Sync failed:', err);
        } finally {
            setSyncing(false);
        }
    };

    /**
     * Get day plans for a trip
     * @param {string} tripId - The trip ID
     * @returns {Array} Day plans
     */
    const getDayPlans = async (tripId) => {
        try {
            const { dayPlans, error } = await dayPlanService.getDayPlans(tripId);

            if (error) {
                console.error('❌ TripContext: Error loading day plans:', error);
                return [];
            }

            return dayPlans;
        } catch (err) {
            console.error('❌ TripContext: Exception loading day plans:', err);
            return [];
        }
    };

    /**
     * Get stories for a trip
     * @param {string} tripId - The trip ID
     * @returns {Array} Stories
     */
    const getStories = async (tripId) => {
        try {
            const { stories, error } = await storyService.getStoriesByTripId(tripId);

            if (error) {
                console.error('❌ TripContext: Error loading stories:', error);
                return [];
            }

            return stories;
        } catch (err) {
            console.error('❌ TripContext: Exception loading stories:', err);
            return [];
        }
    };

    const value = {
        // State
        trips,
        activeTrip,
        loading,
        error,
        syncing,
        setLoading,

        // Trip operations
        createTrip,
        selectTrip,
        updateActiveTrip,
        updateTrip,
        deleteTrip,
        getTripById,
        clearActiveTrip,

        // Data operations
        loadTrips,
        syncTrips,
        getDayPlans,
        getStories,

        // Utility
        backendMode: getBackendMode(),
        isAuthenticated,
    };

    return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};
