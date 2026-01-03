import { createContext, useContext, useState } from 'react';

const TripConfirmationContext = createContext();

export const useTripConfirmation = () => {
    const context = useContext(TripConfirmationContext);
    if (!context) {
        throw new Error('useTripConfirmation must be used within TripConfirmationProvider');
    }
    return context;
};

export const TripConfirmationProvider = ({ children }) => {
    const [confirmationData, setConfirmationData] = useState({
        // Vehicle selection
        selectedVehicle: null,
        vehicleType: null, // 'flight', 'train', 'bus', 'rentCar', 'rentBike'

        // Accommodation selection
        selectedHotel: null,
        accommodationType: null, // 'hotel', 'airbnb', 'resort'

        // Additional bookings
        selectedRestaurants: [],
        selectedTourPackage: null,

        // Day planning
        customDayPlan: null,

        // Trip basic info
        tripInfo: null,
    });

    const setVehicleSelection = (vehicle, type) => {
        setConfirmationData(prev => ({
            ...prev,
            selectedVehicle: vehicle,
            vehicleType: type
        }));
    };

    const setAccommodationSelection = (accommodation, type) => {
        setConfirmationData(prev => ({
            ...prev,
            selectedHotel: accommodation,
            accommodationType: type
        }));
    };

    const setTourPackageSelection = (tourPackage) => {
        setConfirmationData(prev => ({
            ...prev,
            selectedTourPackage: tourPackage
        }));
    };

    const addRestaurant = (restaurant) => {
        setConfirmationData(prev => ({
            ...prev,
            selectedRestaurants: [...prev.selectedRestaurants, restaurant]
        }));
    };

    const removeRestaurant = (restaurantId) => {
        setConfirmationData(prev => ({
            ...prev,
            selectedRestaurants: prev.selectedRestaurants.filter(r => r.id !== restaurantId)
        }));
    };

    const setDayPlan = (dayPlan) => {
        setConfirmationData(prev => ({
            ...prev,
            customDayPlan: dayPlan
        }));
    };

    const setTripInfo = (tripInfo) => {
        setConfirmationData(prev => ({
            ...prev,
            tripInfo: tripInfo
        }));
    };

    const clearConfirmationData = () => {
        setConfirmationData({
            selectedVehicle: null,
            vehicleType: null,
            selectedHotel: null,
            accommodationType: null,
            selectedRestaurants: [],
            selectedTourPackage: null,
            customDayPlan: null,
            tripInfo: null,
        });
    };

    const isComplete = () => {
        return !!(
            confirmationData.tripInfo &&
            (confirmationData.selectedVehicle || confirmationData.vehicleType) &&
            (confirmationData.selectedHotel || confirmationData.accommodationType)
        );
    };

    const value = {
        confirmationData,
        setVehicleSelection,
        setAccommodationSelection,
        setTourPackageSelection,
        addRestaurant,
        removeRestaurant,
        setDayPlan,
        setTripInfo,
        clearConfirmationData,
        isComplete,
    };

    return (
        <TripConfirmationContext.Provider value={value}>
            {children}
        </TripConfirmationContext.Provider>
    );
};
