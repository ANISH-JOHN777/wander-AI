const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherService = {
    /**
     * Get current weather for a location
     */
    async getCurrentWeather(location) {
        try {
            const response = await fetch(
                `${WEATHER_API_URL}/weather?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=metric`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }

            const data = await response.json();

            return {
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                condition: data.weather[0].main,
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                icon: data.weather[0].icon,
            };
        } catch (error) {
            console.error('Error fetching weather:', error);
            return null;
        }
    },

    /**
     * Get weather forecast for a location
     */
    async getWeatherForecast(location, days = 5) {
        try {
            const response = await fetch(
                `${WEATHER_API_URL}/forecast?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=metric&cnt=${days * 8}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch forecast data');
            }

            const data = await response.json();

            // Group by day
            const dailyForecasts = [];
            const grouped = {};

            data.list.forEach(item => {
                const date = new Date(item.dt * 1000).toLocaleDateString();
                if (!grouped[date]) {
                    grouped[date] = [];
                }
                grouped[date].push(item);
            });

            Object.keys(grouped).forEach(date => {
                const dayData = grouped[date];
                const temps = dayData.map(d => d.main.temp);

                dailyForecasts.push({
                    date,
                    tempMax: Math.round(Math.max(...temps)),
                    tempMin: Math.round(Math.min(...temps)),
                    condition: dayData[0].weather[0].main,
                    description: dayData[0].weather[0].description,
                    icon: dayData[0].weather[0].icon,
                    humidity: dayData[0].main.humidity,
                    windSpeed: dayData[0].wind.speed,
                });
            });

            return dailyForecasts.slice(0, days);
        } catch (error) {
            console.error('Error fetching forecast:', error);
            return [];
        }
    },

    /**
     * Get weather icon URL
     */
    getWeatherIconUrl(iconCode) {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    },
};
