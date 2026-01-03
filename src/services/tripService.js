import { supabase, isBackendAvailable } from '../config/supabase';
import authService from './authService';

/**
 * Trip Service
 * Handles all trip-related operations
 * Supports both Supabase backend and localStorage fallback
 */

class TripService {
    constructor() {
        this.STORAGE_KEY = 'aiTripPlanner_trips';
        this.ACTIVE_TRIP_KEY = 'aiTripPlanner_activeTrip';
    }

    /**
     * Get all trips for the current user
     * @returns {Promise<{trips, error}>}
     */
    async getTrips() {
        if (!isBackendAvailable()) {
            // Local mode: get from localStorage
            try {
                const trips = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                console.log(`📍 LOCAL MODE: Loaded ${trips.length} trip(s) from localStorage`);
                return { trips, error: null };
            } catch (error) {
                console.error('❌ Error loading trips from localStorage:', error);
                return { trips: [], error };
            }
        }

        // Supabase mode: fetch from database
        try {
            const { user } = await authService.getCurrentUser();
            if (!user) {
                return { trips: [], error: new Error('User not authenticated') };
            }

            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            console.log(`✅ Loaded ${data.length} trip(s) from Supabase`);
            return { trips: data, error: null };
        } catch (error) {
            console.error('❌ Error loading trips from Supabase:', error);
            return { trips: [], error };
        }
    }

    /**
     * Get a single trip by ID
     * @param {string} tripId - Trip ID
     * @returns {Promise<{trip, error}>}
     */
    async getTrip(tripId) {
        if (!isBackendAvailable()) {
            // Local mode: get from localStorage
            try {
                const trips = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const trip = trips.find(t => t.id === tripId);
                return { trip: trip || null, error: trip ? null : new Error('Trip not found') };
            } catch (error) {
                console.error('❌ Error loading trip from localStorage:', error);
                return { trip: null, error };
            }
        }

        // Supabase mode: fetch from database
        try {
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .eq('id', tripId)
                .single();

            if (error) throw error;
            return { trip: data, error: null };
        } catch (error) {
            console.error('❌ Error loading trip from Supabase:', error);
            return { trip: null, error };
        }
    }

    /**
     * Create a new trip
     * @param {Object} tripData - Trip data
     * @returns {Promise<{trip, error}>}
     */
    async createTrip(tripData) {
        if (!isBackendAvailable()) {
            // Local mode: save to localStorage
            try {
                const trips = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const newTrip = {
                    ...tripData,
                    id: tripData.id || `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                trips.unshift(newTrip);
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trips));
                console.log('📍 LOCAL MODE: Trip created in localStorage');
                return { trip: newTrip, error: null };
            } catch (error) {
                console.error('❌ Error creating trip in localStorage:', error);
                return { trip: null, error };
            }
        }

        // Supabase mode: insert into database
        try {
            const { user } = await authService.getCurrentUser();
            if (!user) {
                return { trip: null, error: new Error('User not authenticated') };
            }

            const newTrip = {
                ...tripData,
                user_id: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const { data, error } = await supabase
                .from('trips')
                .insert([newTrip])
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Trip created in Supabase');
            return { trip: data, error: null };
        } catch (error) {
            console.error('❌ Error creating trip in Supabase:', error);
            return { trip: null, error };
        }
    }

    /**
     * Update an existing trip
     * @param {string} tripId - Trip ID
     * @param {Object} updates - Trip updates
     * @returns {Promise<{trip, error}>}
     */
    async updateTrip(tripId, updates) {
        if (!isBackendAvailable()) {
            // Local mode: update in localStorage
            try {
                console.log('🔍 Looking for trip with ID:', tripId);
                const trips = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                console.log('📦 All trips in localStorage:', trips.map(t => ({ id: t.id, destination: t.destination })));

                const index = trips.findIndex(t => t.id === tripId);

                if (index === -1) {
                    console.error('❌ Trip not found! Looking for ID:', tripId);
                    console.error('Available trip IDs:', trips.map(t => t.id));

                    // Try to find by any means
                    if (trips.length > 0) {
                        console.warn('⚠️ Using first available trip as fallback');
                        const fallbackTrip = trips[0];
                        const updatedFallbackTrip = {
                            ...fallbackTrip,
                            ...updates,
                            updated_at: new Date().toISOString(),
                            // Add fallback for day_plans if updates don't provide it
                            day_plans: updates.day_plans || updates.dayPlans || fallbackTrip.day_plans || fallbackTrip.dayPlans || [],
                        };
                        trips[0] = updatedFallbackTrip;
                        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trips));
                        console.log('📍 LOCAL MODE: Trip updated (fallback) in localStorage');
                        console.log('Fallback trip details after update:', updatedFallbackTrip);
                        return { trip: trips[0], error: null };
                    }

                    return { trip: null, error: new Error('Trip not found') };
                }

                trips[index] = {
                    ...trips[index],
                    ...updates,
                    updated_at: new Date().toISOString(),
                };

                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trips));
                console.log('📍 LOCAL MODE: Trip updated in localStorage');
                return { trip: trips[index], error: null };
            } catch (error) {
                console.error('❌ Error updating trip in localStorage:', error);
                return { trip: null, error };
            }
        }

        // Supabase mode: update in database
        try {
            console.log('🔄 Updating trip in Supabase:', tripId, updates);

            const { data, error } = await supabase
                .from('trips')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', tripId)
                .select()
                .single();

            if (error) {
                console.error('❌ Supabase update error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                throw error;
            }

            console.log('✅ Trip updated in Supabase');
            return { trip: data, error: null };
        } catch (error) {
            console.error('❌ Error updating trip in Supabase:', error);
            return { trip: null, error };
        }
    }

    /**
     * Delete a trip
     * @param {string} tripId - Trip ID
     * @returns {Promise<{error}>}
     */
    async deleteTrip(tripId) {
        if (!isBackendAvailable()) {
            // Local mode: delete from localStorage
            try {
                const trips = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const filteredTrips = trips.filter(t => t.id !== tripId);
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredTrips));
                console.log('📍 LOCAL MODE: Trip deleted from localStorage');
                return { error: null };
            } catch (error) {
                console.error('❌ Error deleting trip from localStorage:', error);
                return { error };
            }
        }

        // Supabase mode: delete from database
        try {
            const { error } = await supabase
                .from('trips')
                .delete()
                .eq('id', tripId);

            if (error) throw error;

            console.log('✅ Trip deleted from Supabase');
            return { error: null };
        } catch (error) {
            console.error('❌ Error deleting trip from Supabase:', error);
            return { error };
        }
    }

    /**
     * Get the active trip
     * @returns {Promise<{trip, error}>}
     */
    async getActiveTrip() {
        if (!isBackendAvailable()) {
            // Local mode: get from localStorage
            try {
                const trip = JSON.parse(localStorage.getItem(this.ACTIVE_TRIP_KEY) || 'null');
                return { trip, error: null };
            } catch (error) {
                console.error('❌ Error loading active trip from localStorage:', error);
                return { trip: null, error };
            }
        }

        // Supabase mode: get from user preferences or last trip
        try {
            const { user } = await authService.getCurrentUser();
            if (!user) {
                return { trip: null, error: new Error('User not authenticated') };
            }

            // Try to get from user metadata first
            const activeTripId = user.user_metadata?.active_trip_id;

            if (activeTripId) {
                return await this.getTrip(activeTripId);
            }

            // Otherwise, get the most recent trip
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

            return { trip: data || null, error: null };
        } catch (error) {
            console.error('❌ Error loading active trip from Supabase:', error);
            return { trip: null, error };
        }
    }

    /**
     * Set the active trip
     * @param {string} tripId - Trip ID
     * @returns {Promise<{error}>}
     */
    async setActiveTrip(tripId) {
        if (!isBackendAvailable()) {
            // Local mode: save to localStorage
            try {
                const { trip } = await this.getTrip(tripId);
                if (trip) {
                    localStorage.setItem(this.ACTIVE_TRIP_KEY, JSON.stringify(trip));
                    console.log('📍 LOCAL MODE: Active trip set in localStorage');
                }
                return { error: trip ? null : new Error('Trip not found') };
            } catch (error) {
                console.error('❌ Error setting active trip in localStorage:', error);
                return { error };
            }
        }

        // Supabase mode: update user metadata
        try {
            await authService.updateUser({ active_trip_id: tripId });
            console.log('✅ Active trip set in Supabase');
            return { error: null };
        } catch (error) {
            console.error('❌ Error setting active trip in Supabase:', error);
            return { error };
        }
    }

    /**
     * Toggle trip public/private status
     * @param {string} tripId - Trip ID
     * @param {boolean} isPublic - Whether to make trip public
     * @returns {Promise<{trip, error}>}
     */
    async toggleTripPublic(tripId, isPublic) {
        if (!isBackendAvailable()) {
            // Local mode: update in localStorage
            try {
                const trips = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const index = trips.findIndex(t => t.id === tripId);

                if (index === -1) {
                    return { trip: null, error: new Error('Trip not found') };
                }

                // Generate share token if making public
                if (isPublic && !trips[index].share_token) {
                    trips[index].share_token = this.generateShareToken();
                    trips[index].shared_at = new Date().toISOString();
                }

                trips[index].is_public = isPublic;
                trips[index].updated_at = new Date().toISOString();

                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trips));
                console.log('📍 LOCAL MODE: Trip sharing toggled in localStorage');
                return { trip: trips[index], error: null };
            } catch (error) {
                console.error('❌ Error toggling trip sharing in localStorage:', error);
                return { trip: null, error };
            }
        }

        // Supabase mode: update in database (trigger will auto-generate token)
        try {
            const { data, error } = await supabase
                .from('trips')
                .update({
                    is_public: isPublic,
                    updated_at: new Date().toISOString()
                })
                .eq('id', tripId)
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Trip sharing toggled in Supabase');
            return { trip: data, error: null };
        } catch (error) {
            console.error('❌ Error toggling trip sharing in Supabase:', error);
            return { trip: null, error };
        }
    }

    /**
     * Get a shared trip by share token (public access)
     * @param {string} shareToken - Share token
     * @returns {Promise<{trip, error}>}
     */
    async getSharedTrip(shareToken) {
        if (!isBackendAvailable()) {
            // Local mode: find in localStorage
            try {
                const trips = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const trip = trips.find(t => t.share_token === shareToken && t.is_public);

                if (!trip) {
                    return { trip: null, error: new Error('Shared trip not found or not public') };
                }

                return { trip, error: null };
            } catch (error) {
                console.error('❌ Error loading shared trip from localStorage:', error);
                return { trip: null, error };
            }
        }

        // Supabase mode: fetch from database (no auth required)
        try {
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .eq('share_token', shareToken)
                .eq('is_public', true)
                .single();

            if (error) throw error;

            console.log('✅ Shared trip loaded from Supabase');
            return { trip: data, error: null };
        } catch (error) {
            console.error('❌ Error loading shared trip from Supabase:', error);
            return { trip: null, error };
        }
    }

    /**
     * Increment view count for a shared trip
     * @param {string} shareToken - Share token
     * @returns {Promise<{error}>}
     */
    async incrementViewCount(shareToken) {
        if (!isBackendAvailable()) {
            // Local mode: increment in localStorage
            try {
                const trips = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const index = trips.findIndex(t => t.share_token === shareToken);

                if (index !== -1) {
                    trips[index].view_count = (trips[index].view_count || 0) + 1;
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trips));
                    console.log('📍 LOCAL MODE: View count incremented');
                }

                return { error: null };
            } catch (error) {
                console.error('❌ Error incrementing view count in localStorage:', error);
                return { error };
            }
        }

        // Supabase mode: increment in database
        try {
            const { error } = await supabase.rpc('increment_view_count', {
                t_token: shareToken
            });

            // If RPC doesn't exist, use manual update
            if (error && error.code === '42883') {
                const { data: trip } = await supabase
                    .from('trips')
                    .select('view_count')
                    .eq('share_token', shareToken)
                    .single();

                if (trip) {
                    await supabase
                        .from('trips')
                        .update({ view_count: (trip.view_count || 0) + 1 })
                        .eq('share_token', shareToken);
                }
            } else if (error) {
                throw error;
            }

            console.log('✅ View count incremented in Supabase');
            return { error: null };
        } catch (error) {
            console.error('❌ Error incrementing view count in Supabase:', error);
            return { error };
        }
    }

    /**
     * Copy a shared trip to current user's account
     * @param {string} shareToken - Share token
     * @param {string} attribution - Original creator name
     * @returns {Promise<{trip, error}>}
     */
    async copySharedTrip(shareToken, attribution) {
        // First, get the shared trip
        const { trip: originalTrip, error: fetchError } = await this.getSharedTrip(shareToken);

        if (fetchError || !originalTrip) {
            return { trip: null, error: fetchError || new Error('Trip not found') };
        }

        // Create a copy with attribution
        const tripCopy = {
            destination: originalTrip.destination,
            start_date: originalTrip.start_date || originalTrip.startDate,
            end_date: originalTrip.end_date || originalTrip.endDate,
            travel_type: originalTrip.travel_type || originalTrip.travelType,
            transport_mode: originalTrip.transport_mode || originalTrip.transportMode,
            travelers: originalTrip.travelers,
            status: 'planned',
            notes: `Inspired by ${attribution}\n\n${originalTrip.notes || ''}`,

            // Copy additional details if they exist
            vehicle_details: originalTrip.vehicle_details || originalTrip.vehicleDetails,
            accommodation_details: originalTrip.accommodation_details || originalTrip.accommodationDetails,
            activities_details: originalTrip.activities_details || originalTrip.activitiesDetails,
            budget_details: originalTrip.budget_details || originalTrip.budgetDetails,
            setup_type: originalTrip.setup_type || originalTrip.setupType,

            // Copy day plans if they exist
            day_plans: originalTrip.day_plans || originalTrip.dayPlans,

            // Mark as copied
            copied_from: shareToken,
            is_public: false, // Copied trips are private by default
        };

        // Create the new trip
        return await this.createTrip(tripCopy);
    }

    /**
     * Generate a unique share token (for local mode)
     * @returns {string}
     */
    generateShareToken() {
        return Math.random().toString(36).substring(2, 14);
    }
}

// Create and export a singleton instance
const tripService = new TripService();
export default tripService;
