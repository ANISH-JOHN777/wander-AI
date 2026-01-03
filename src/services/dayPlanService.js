import { supabase, isBackendAvailable } from '../config/supabase';
import authService from './authService';

/**
 * Day Plan Service
 * Handles all day plan-related operations
 * Supports both Supabase backend and localStorage fallback
 */

class DayPlanService {
    constructor() {
        this.STORAGE_KEY = 'aiTripPlanner_dayPlans';
    }

    /**
     * Get all day plans for a trip
     * @param {string} tripId - Trip ID
     * @returns {Promise<{dayPlans, error}>}
     */
    async getDayPlans(tripId) {
        if (!isBackendAvailable()) {
            // Local mode: get from localStorage
            try {
                const allDayPlans = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const dayPlans = allDayPlans.filter(dp => dp.trip_id === tripId || dp.tripId === tripId);
                console.log(`📅 LOCAL MODE: Loaded ${dayPlans.length} day plan(s) for trip ${tripId}`);
                return { dayPlans, error: null };
            } catch (error) {
                console.error('❌ Error loading day plans from localStorage:', error);
                return { dayPlans: [], error };
            }
        }

        // Supabase mode: fetch from database
        try {
            const { data, error } = await supabase
                .from('day_plans')
                .select('*')
                .eq('trip_id', tripId)
                .order('day_number', { ascending: true });

            if (error) throw error;

            console.log(`✅ Loaded ${data.length} day plan(s) from Supabase`);
            return { dayPlans: data, error: null };
        } catch (error) {
            console.error('❌ Error loading day plans from Supabase:', error);
            return { dayPlans: [], error };
        }
    }

    /**
     * Get a single day plan by ID
     * @param {string} dayPlanId - Day plan ID
     * @returns {Promise<{dayPlan, error}>}
     */
    async getDayPlan(dayPlanId) {
        if (!isBackendAvailable()) {
            // Local mode: get from localStorage
            try {
                const dayPlans = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const dayPlan = dayPlans.find(dp => dp.id === dayPlanId);
                return { dayPlan: dayPlan || null, error: dayPlan ? null : new Error('Day plan not found') };
            } catch (error) {
                console.error('❌ Error loading day plan from localStorage:', error);
                return { dayPlan: null, error };
            }
        }

        // Supabase mode: fetch from database
        try {
            const { data, error } = await supabase
                .from('day_plans')
                .select('*')
                .eq('id', dayPlanId)
                .single();

            if (error) throw error;
            return { dayPlan: data, error: null };
        } catch (error) {
            console.error('❌ Error loading day plan from Supabase:', error);
            return { dayPlan: null, error };
        }
    }

    /**
     * Get day plan by trip ID and day number
     * @param {string} tripId - Trip ID
     * @param {number} dayNumber - Day number
     * @returns {Promise<{dayPlan, error}>}
     */
    async getDayPlanByNumber(tripId, dayNumber) {
        if (!isBackendAvailable()) {
            // Local mode: filter from localStorage
            try {
                const dayPlans = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const dayPlan = dayPlans.find(
                    dp => (dp.trip_id === tripId || dp.tripId === tripId) && dp.day_number === dayNumber
                );
                return { dayPlan: dayPlan || null, error: null };
            } catch (error) {
                console.error('❌ Error loading day plan from localStorage:', error);
                return { dayPlan: null, error };
            }
        }

        // Supabase mode: query database
        try {
            const { data, error } = await supabase
                .from('day_plans')
                .select('*')
                .eq('trip_id', tripId)
                .eq('day_number', dayNumber)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

            return { dayPlan: data || null, error: null };
        } catch (error) {
            console.error('❌ Error loading day plan from Supabase:', error);
            return { dayPlan: null, error };
        }
    }

    /**
     * Create a new day plan
     * @param {Object} dayPlanData - Day plan data
     * @returns {Promise<{dayPlan, error}>}
     */
    async createDayPlan(dayPlanData) {
        if (!isBackendAvailable()) {
            // Local mode: save to localStorage
            try {
                const dayPlans = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const newDayPlan = {
                    ...dayPlanData,
                    id: dayPlanData.id || `dayplan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    activities: dayPlanData.activities || [],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                dayPlans.push(newDayPlan);
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dayPlans));
                console.log('📅 LOCAL MODE: Day plan created in localStorage');
                return { dayPlan: newDayPlan, error: null };
            } catch (error) {
                console.error('❌ Error creating day plan in localStorage:', error);
                return { dayPlan: null, error };
            }
        }

        // Supabase mode: insert into database
        try {
            const newDayPlan = {
                trip_id: dayPlanData.tripId || dayPlanData.trip_id,
                day_number: dayPlanData.day_number || dayPlanData.dayNumber,
                day_date: dayPlanData.day_date || dayPlanData.dayDate,
                activities: dayPlanData.activities || [],
                notes: dayPlanData.notes,
                budget: dayPlanData.budget,
            };

            const { data, error } = await supabase
                .from('day_plans')
                .insert([newDayPlan])
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Day plan created in Supabase');
            return { dayPlan: data, error: null };
        } catch (error) {
            console.error('❌ Error creating day plan in Supabase:', error);
            return { dayPlan: null, error };
        }
    }

    /**
     * Update an existing day plan
     * @param {string} dayPlanId - Day plan ID
     * @param {Object} updates - Day plan updates
     * @returns {Promise<{dayPlan, error}>}
     */
    async updateDayPlan(dayPlanId, updates) {
        if (!isBackendAvailable()) {
            // Local mode: update in localStorage
            try {
                const dayPlans = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const index = dayPlans.findIndex(dp => dp.id === dayPlanId);

                if (index === -1) {
                    return { dayPlan: null, error: new Error('Day plan not found') };
                }

                dayPlans[index] = {
                    ...dayPlans[index],
                    ...updates,
                    updated_at: new Date().toISOString(),
                };

                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dayPlans));
                console.log('📅 LOCAL MODE: Day plan updated in localStorage');
                return { dayPlan: dayPlans[index], error: null };
            } catch (error) {
                console.error('❌ Error updating day plan in localStorage:', error);
                return { dayPlan: null, error };
            }
        }

        // Supabase mode: update in database
        try {
            const { data, error } = await supabase
                .from('day_plans')
                .update(updates)
                .eq('id', dayPlanId)
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Day plan updated in Supabase');
            return { dayPlan: data, error: null };
        } catch (error) {
            console.error('❌ Error updating day plan in Supabase:', error);
            return { dayPlan: null, error };
        }
    }

    /**
     * Delete a day plan
     * @param {string} dayPlanId - Day plan ID
     * @returns {Promise<{error}>}
     */
    async deleteDayPlan(dayPlanId) {
        if (!isBackendAvailable()) {
            // Local mode: delete from localStorage
            try {
                const dayPlans = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const filteredDayPlans = dayPlans.filter(dp => dp.id !== dayPlanId);
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredDayPlans));
                console.log('📅 LOCAL MODE: Day plan deleted from localStorage');
                return { error: null };
            } catch (error) {
                console.error('❌ Error deleting day plan from localStorage:', error);
                return { error };
            }
        }

        // Supabase mode: delete from database
        try {
            const { error } = await supabase
                .from('day_plans')
                .delete()
                .eq('id', dayPlanId);

            if (error) throw error;

            console.log('✅ Day plan deleted from Supabase');
            return { error: null };
        } catch (error) {
            console.error('❌ Error deleting day plan from Supabase:', error);
            return { error };
        }
    }

    /**
     * Delete all day plans for a trip
     * @param {string} tripId - Trip ID
     * @returns {Promise<{error}>}
     */
    async deleteDayPlansByTrip(tripId) {
        if (!isBackendAvailable()) {
            // Local mode: filter from localStorage
            try {
                const dayPlans = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const filteredDayPlans = dayPlans.filter(
                    dp => dp.trip_id !== tripId && dp.tripId !== tripId
                );
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredDayPlans));
                console.log('📅 LOCAL MODE: Day plans deleted from localStorage');
                return { error: null };
            } catch (error) {
                console.error('❌ Error deleting day plans from localStorage:', error);
                return { error };
            }
        }

        // Supabase mode: delete from database
        try {
            const { error } = await supabase
                .from('day_plans')
                .delete()
                .eq('trip_id', tripId);

            if (error) throw error;

            console.log('✅ Day plans deleted from Supabase');
            return { error: null };
        } catch (error) {
            console.error('❌ Error deleting day plans from Supabase:', error);
            return { error };
        }
    }

    /**
     * Add activity to a day plan
     * @param {string} dayPlanId - Day plan ID
     * @param {Object} activity - Activity to add
     * @returns {Promise<{dayPlan, error}>}
     */
    async addActivity(dayPlanId, activity) {
        const { dayPlan, error: fetchError } = await this.getDayPlan(dayPlanId);

        if (fetchError || !dayPlan) {
            return { dayPlan: null, error: fetchError || new Error('Day plan not found') };
        }

        const activities = dayPlan.activities || [];
        const newActivity = {
            ...activity,
            id: activity.id || activities.length + 1,
        };

        activities.push(newActivity);

        return await this.updateDayPlan(dayPlanId, { activities });
    }

    /**
     * Update activity in a day plan
     * @param {string} dayPlanId - Day plan ID
     * @param {number} activityId - Activity ID
     * @param {Object} updates - Activity updates
     * @returns {Promise<{dayPlan, error}>}
     */
    async updateActivity(dayPlanId, activityId, updates) {
        const { dayPlan, error: fetchError } = await this.getDayPlan(dayPlanId);

        if (fetchError || !dayPlan) {
            return { dayPlan: null, error: fetchError || new Error('Day plan not found') };
        }

        const activities = dayPlan.activities || [];
        const index = activities.findIndex(a => a.id === activityId);

        if (index === -1) {
            return { dayPlan: null, error: new Error('Activity not found') };
        }

        activities[index] = { ...activities[index], ...updates };

        return await this.updateDayPlan(dayPlanId, { activities });
    }

    /**
     * Delete activity from a day plan
     * @param {string} dayPlanId - Day plan ID
     * @param {number} activityId - Activity ID
     * @returns {Promise<{dayPlan, error}>}
     */
    async deleteActivity(dayPlanId, activityId) {
        const { dayPlan, error: fetchError } = await this.getDayPlan(dayPlanId);

        if (fetchError || !dayPlan) {
            return { dayPlan: null, error: fetchError || new Error('Day plan not found') };
        }

        const activities = (dayPlan.activities || []).filter(a => a.id !== activityId);

        return await this.updateDayPlan(dayPlanId, { activities });
    }
}

// Create and export a singleton instance
const dayPlanService = new DayPlanService();
export default dayPlanService;
