export const storageService = {
    /**
     * Save data to localStorage
     */
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    /**
     * Load data from localStorage
     */
    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    },

    /**
     * Remove data from localStorage
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    /**
     * Clear all data from localStorage
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    /**
     * Export all trips as JSON file
     */
    exportTrips(trips) {
        try {
            const dataStr = JSON.stringify(trips, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `trip-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error('Error exporting trips:', error);
            return false;
        }
    },

    /**
     * Import trips from JSON file
     */
    async importTrips(file) {
        try {
            const text = await file.text();
            const trips = JSON.parse(text);
            return Array.isArray(trips) ? trips : null;
        } catch (error) {
            console.error('Error importing trips:', error);
            return null;
        }
    },
};
