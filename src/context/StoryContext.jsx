import { createContext, useContext, useState, useEffect } from 'react';

const StoryContext = createContext();

export const useStoryContext = () => {
    const context = useContext(StoryContext);
    if (!context) {
        throw new Error('useStoryContext must be used within a StoryProvider');
    }
    return context;
};

// LocalStorage key
const STORIES_STORAGE_KEY = 'aiTripPlanner_stories';

export const StoryProvider = ({ children }) => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load saved stories on app initialization
    useEffect(() => {
        try {
            const savedStories = localStorage.getItem(STORIES_STORAGE_KEY);
            console.log('📖 StoryContext: Loading stories from localStorage...');
            if (savedStories) {
                const parsedStories = JSON.parse(savedStories);
                console.log(`📖 StoryContext: Found ${parsedStories.length} story/stories`, parsedStories);
                setStories(Array.isArray(parsedStories) ? parsedStories : []);
            } else {
                console.log('📖 StoryContext: No stories found in localStorage');
            }
        } catch (err) {
            console.error('❌ StoryContext: Error loading saved stories:', err);
            setStories([]);
        }
    }, []);

    // Persist stories to localStorage whenever they change
    useEffect(() => {
        try {
            console.log(`💾 StoryContext: Saving ${stories.length} story/stories to localStorage`, stories);
            localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(stories));
        } catch (err) {
            console.error('❌ StoryContext: Error saving stories:', err);
        }
    }, [stories]);

    /**
     * Create a new story and add it to the stories array
     * @param {Object} storyData - The story data to create
     * @returns {Object} The created story with generated ID and timestamp
     */
    const createStory = (storyData) => {
        const newStory = {
            ...storyData,
            id: `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setStories(prevStories => [newStory, ...prevStories]);
        return newStory;
    };

    /**
     * Update an existing story
     * @param {string} storyId - The ID of the story to update
     * @param {Object} updates - The updates to apply
     * @returns {Object|null} The updated story or null if not found
     */
    const updateStory = (storyId, updates) => {
        let updatedStory = null;

        setStories(prevStories =>
            prevStories.map(story => {
                if (story.id === storyId) {
                    updatedStory = {
                        ...story,
                        ...updates,
                        updatedAt: new Date().toISOString(),
                    };
                    return updatedStory;
                }
                return story;
            })
        );

        return updatedStory;
    };

    /**
     * Delete a story by ID
     * @param {string} storyId - The ID of the story to delete
     */
    const deleteStory = (storyId) => {
        setStories(prevStories => prevStories.filter(story => story.id !== storyId));
    };

    /**
     * Get a story by ID
     * @param {string} storyId - The ID of the story to get
     * @returns {Object|undefined} The story or undefined if not found
     */
    const getStoryById = (storyId) => {
        return stories.find(story => story.id === storyId);
    };

    /**
     * Get all stories for a specific trip
     * @param {string} tripId - The ID of the trip
     * @returns {Array} Array of stories for the trip
     */
    const getStoriesByTripId = (tripId) => {
        return stories.filter(story => story.tripId === tripId);
    };

    /**
     * Clear all stories (useful for testing or reset)
     */
    const clearAllStories = () => {
        setStories([]);
        localStorage.removeItem(STORIES_STORAGE_KEY);
    };

    const value = {
        // State
        stories,
        loading,
        setLoading,

        // Functions
        createStory,
        updateStory,
        deleteStory,
        getStoryById,
        getStoriesByTripId,
        clearAllStories,
    };

    return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
};
