import { supabase, isBackendAvailable } from '../config/supabase';
import authService from './authService';

/**
 * Story Service
 * Handles all story-related operations
 * Supports both Supabase backend and localStorage fallback
 */

class StoryService {
    constructor() {
        this.STORAGE_KEY = 'aiTripPlanner_stories';
    }

    /**
     * Get all stories for the current user
     * @returns {Promise<{stories, error}>}
     */
    async getStories() {
        if (!isBackendAvailable()) {
            // Local mode: get from localStorage
            try {
                const stories = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                console.log(`📖 LOCAL MODE: Loaded ${stories.length} story/stories from localStorage`);
                return { stories, error: null };
            } catch (error) {
                console.error('❌ Error loading stories from localStorage:', error);
                return { stories: [], error };
            }
        }

        // Supabase mode: fetch from database
        try {
            const { user } = await authService.getCurrentUser();
            if (!user) {
                return { stories: [], error: new Error('User not authenticated') };
            }

            const { data, error } = await supabase
                .from('stories')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            console.log(`✅ Loaded ${data.length} story/stories from Supabase`);
            return { stories: data, error: null };
        } catch (error) {
            console.error('❌ Error loading stories from Supabase:', error);
            return { stories: [], error };
        }
    }

    /**
     * Get stories for a specific trip
     * @param {string} tripId - Trip ID
     * @returns {Promise<{stories, error}>}
     */
    async getStoriesByTripId(tripId) {
        if (!isBackendAvailable()) {
            // Local mode: filter from localStorage
            try {
                const stories = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const tripStories = stories.filter(s => s.trip_id === tripId || s.tripId === tripId);
                return { stories: tripStories, error: null };
            } catch (error) {
                console.error('❌ Error loading trip stories from localStorage:', error);
                return { stories: [], error };
            }
        }

        // Supabase mode: query database
        try {
            const { data, error } = await supabase
                .from('stories')
                .select('*')
                .eq('trip_id', tripId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { stories: data, error: null };
        } catch (error) {
            console.error('❌ Error loading trip stories from Supabase:', error);
            return { stories: [], error };
        }
    }

    /**
     * Get a single story by ID
     * @param {string} storyId - Story ID
     * @returns {Promise<{story, error}>}
     */
    async getStory(storyId) {
        if (!isBackendAvailable()) {
            // Local mode: get from localStorage
            try {
                const stories = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const story = stories.find(s => s.id === storyId);
                return { story: story || null, error: story ? null : new Error('Story not found') };
            } catch (error) {
                console.error('❌ Error loading story from localStorage:', error);
                return { story: null, error };
            }
        }

        // Supabase mode: fetch from database
        try {
            const { data, error } = await supabase
                .from('stories')
                .select('*')
                .eq('id', storyId)
                .single();

            if (error) throw error;
            return { story: data, error: null };
        } catch (error) {
            console.error('❌ Error loading story from Supabase:', error);
            return { story: null, error };
        }
    }

    /**
     * Create a new story
     * @param {Object} storyData - Story data
     * @returns {Promise<{story, error}>}
     */
    async createStory(storyData) {
        if (!isBackendAvailable()) {
            // Local mode: save to localStorage
            try {
                const stories = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const newStory = {
                    ...storyData,
                    id: storyData.id || `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                stories.unshift(newStory);
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
                console.log('📖 LOCAL MODE: Story created in localStorage');
                return { story: newStory, error: null };
            } catch (error) {
                console.error('❌ Error creating story in localStorage:', error);
                return { story: null, error };
            }
        }

        // Supabase mode: insert into database
        try {
            const { user } = await authService.getCurrentUser();
            if (!user) {
                return { story: null, error: new Error('User not authenticated') };
            }

            // Handle image upload if present
            let imageUrl = null;
            if (storyData.image && storyData.image.startsWith('data:')) {
                const { url, error: uploadError } = await this.uploadImage(storyData.image);
                if (uploadError) {
                    console.warn('⚠️ Image upload failed, storing base64 instead');
                    imageUrl = storyData.image; // Fallback to base64
                } else {
                    imageUrl = url;
                }
            } else {
                imageUrl = storyData.image;
            }

            const newStory = {
                ...storyData,
                image: imageUrl,
                user_id: user.id,
                trip_id: storyData.tripId || storyData.trip_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            // Remove local-only fields
            delete newStory.tripId;
            delete newStory.tripDates;

            const { data, error } = await supabase
                .from('stories')
                .insert([newStory])
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Story created in Supabase');
            return { story: data, error: null };
        } catch (error) {
            console.error('❌ Error creating story in Supabase:', error);
            return { story: null, error };
        }
    }

    /**
     * Update an existing story
     * @param {string} storyId - Story ID
     * @param {Object} updates - Story updates
     * @returns {Promise<{story, error}>}
     */
    async updateStory(storyId, updates) {
        if (!isBackendAvailable()) {
            // Local mode: update in localStorage
            try {
                const stories = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const index = stories.findIndex(s => s.id === storyId);

                if (index === -1) {
                    return { story: null, error: new Error('Story not found') };
                }

                stories[index] = {
                    ...stories[index],
                    ...updates,
                    updated_at: new Date().toISOString(),
                };

                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
                console.log('📖 LOCAL MODE: Story updated in localStorage');
                return { story: stories[index], error: null };
            } catch (error) {
                console.error('❌ Error updating story in localStorage:', error);
                return { story: null, error };
            }
        }

        // Supabase mode: update in database
        try {
            // Handle image upload if updated
            let imageUrl = updates.image;
            if (updates.image && updates.image.startsWith('data:')) {
                const { url, error: uploadError } = await this.uploadImage(updates.image);
                if (!uploadError) {
                    imageUrl = url;
                }
            }

            const { data, error } = await supabase
                .from('stories')
                .update({
                    ...updates,
                    image: imageUrl,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', storyId)
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Story updated in Supabase');
            return { story: data, error: null };
        } catch (error) {
            console.error('❌ Error updating story in Supabase:', error);
            return { story: null, error };
        }
    }

    /**
     * Delete a story
     * @param {string} storyId - Story ID
     * @returns {Promise<{error}>}
     */
    async deleteStory(storyId) {
        if (!isBackendAvailable()) {
            // Local mode: delete from localStorage
            try {
                const stories = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
                const filteredStories = stories.filter(s => s.id !== storyId);
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredStories));
                console.log('📖 LOCAL MODE: Story deleted from localStorage');
                return { error: null };
            } catch (error) {
                console.error('❌ Error deleting story from localStorage:', error);
                return { error };
            }
        }

        // Supabase mode: delete from database
        try {
            // Get story to delete associated image
            const { story } = await this.getStory(storyId);

            const { error } = await supabase
                .from('stories')
                .delete()
                .eq('id', storyId);

            if (error) throw error;

            // Delete associated image if it's a Supabase URL
            if (story?.image && story.image.includes('supabase')) {
                await this.deleteImage(story.image);
            }

            console.log('✅ Story deleted from Supabase');
            return { error: null };
        } catch (error) {
            console.error('❌ Error deleting story from Supabase:', error);
            return { error };
        }
    }

    /**
     * Upload an image to Supabase Storage
     * @param {string} base64Image - Base64 encoded image
     * @returns {Promise<{url, error}>}
     */
    async uploadImage(base64Image) {
        if (!isBackendAvailable()) {
            return { url: base64Image, error: null }; // Return base64 in local mode
        }

        try {
            // Convert base64 to blob
            const response = await fetch(base64Image);
            const blob = await response.blob();

            // Generate unique filename
            const filename = `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
            const { user } = await authService.getCurrentUser();
            const filepath = `${user.id}/${filename}`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('story-images')
                .upload(filepath, blob, {
                    contentType: 'image/jpeg',
                    upsert: false,
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('story-images')
                .getPublicUrl(filepath);

            console.log('✅ Image uploaded to Supabase Storage');
            return { url: publicUrl, error: null };
        } catch (error) {
            console.error('❌ Error uploading image:', error);
            return { url: null, error };
        }
    }

    /**
     * Delete an image from Supabase Storage
     * @param {string} imageUrl - Image URL
     * @returns {Promise<{error}>}
     */
    async deleteImage(imageUrl) {
        if (!isBackendAvailable()) {
            return { error: null };
        }

        try {
            // Extract filepath from URL
            const url = new URL(imageUrl);
            const filepath = url.pathname.split('/story-images/')[1];

            if (!filepath) return { error: null };

            const { error } = await supabase.storage
                .from('story-images')
                .remove([filepath]);

            if (error) throw error;

            console.log('✅ Image deleted from Supabase Storage');
            return { error: null };
        } catch (error) {
            console.error('❌ Error deleting image:', error);
            return { error };
        }
    }
}

// Create and export a singleton instance
const storyService = new StoryService();
export default storyService;
