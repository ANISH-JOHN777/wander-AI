/**
 * Mock Weather Data Utility
 * Generates realistic-looking weather data when no API key is available
 */

export const getMockWeather = (location) => {
    // Generate static values based on location string so it looks consistent
    const seed = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Deterministic random-ish values
    const tempBase = (seed % 15) + 15; // 15-30 degrees
    const conditionIndex = seed % 4;
    const conditions = [
        { main: 'Sunny', desc: 'Clear sky and sunlight', icon: '01d' },
        { main: 'Cloudy', desc: 'Party cloudy with light breeze', icon: '03d' },
        { main: 'Rainy', desc: 'Light rain showers expected', icon: '10d' },
        { main: 'Mist', desc: 'Hazy with low visibility', icon: '50d' }
    ];

    const selected = conditions[conditionIndex];

    return {
        temperature: tempBase,
        feelsLike: tempBase - 2,
        condition: selected.main,
        description: selected.desc,
        humidity: 40 + (seed % 30),
        windSpeed: 5 + (seed % 10),
        icon: selected.icon,
        isMock: true
    };
};

export const getMockForecast = (location, days = 5) => {
    const forecast = [];
    const base = getMockWeather(location);

    for (let i = 0; i < days; i++) {
        const daySeed = i * 7;
        forecast.push({
            date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
            tempMax: base.temperature + (daySeed % 5) - 2,
            tempMin: base.temperature - 5 - (daySeed % 3),
            condition: base.condition,
            icon: base.icon,
            humidity: base.humidity,
            windSpeed: base.windSpeed
        });
    }

    return forecast;
};
