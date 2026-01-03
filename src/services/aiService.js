const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const aiService = {
    /**
     * Generate trip itinerary using Gemini AI
     */
    async generateTripItinerary(tripData) {
        const { destination, startDate, endDate, budget, travelers, interests } = tripData;

        const prompt = `Create a detailed travel itinerary for a trip with the following details:
    
Destination: ${destination}
Duration: ${startDate} to ${endDate}
Budget: ${budget}
Number of Travelers: ${travelers}
Interests: ${interests.join(', ')}

Please provide:
1. Day-by-day itinerary with activities
2. Recommended hotels (3 options with price ranges)
3. Must-visit attractions
4. Local food recommendations
5. Transportation tips
6. Estimated daily budget breakdown
7. Best time to visit each attraction
8. Safety tips and cultural considerations

Format the response as a structured JSON object with the following structure:
{
  "summary": "Brief trip overview",
  "dailyItinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Activity name",
          "description": "Activity details",
          "duration": "2 hours",
          "cost": "$50"
        }
      ]
    }
  ],
  "hotels": [
    {
      "name": "Hotel name",
      "rating": 4.5,
      "pricePerNight": "$150",
      "amenities": ["WiFi", "Pool"],
      "location": "Area name"
    }
  ],
  "attractions": [
    {
      "name": "Attraction name",
      "description": "Details",
      "bestTime": "Morning",
      "estimatedCost": "$20",
      "duration": "2-3 hours"
    }
  ],
  "foodRecommendations": [
    {
      "name": "Restaurant/Dish",
      "type": "Cuisine type",
      "priceRange": "$$",
      "mustTry": true
    }
  ],
  "transportation": {
    "gettingThere": "Flight/Train details",
    "localTransport": "Best options",
    "estimatedCost": "$100"
  },
  "budgetBreakdown": {
    "accommodation": "$500",
    "food": "$300",
    "activities": "$400",
    "transportation": "$200",
    "miscellaneous": "$100",
    "total": "$1500"
  },
  "tips": [
    "Safety tip 1",
    "Cultural consideration 1"
  ]
}`;

        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            const data = await response.json();
            const generatedText = data.candidates[0]?.content?.parts[0]?.text || '';

            // Extract JSON from the response
            const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            throw new Error('Failed to parse AI response');
        } catch (error) {
            console.error('Error generating itinerary:', error);
            throw error;
        }
    },

    /**
     * Get AI recommendations for a destination
     */
    async getDestinationRecommendations(preferences) {
        const { budget, interests, duration, climate } = preferences;

        const prompt = `Recommend 5 travel destinations based on these preferences:
    
Budget: ${budget}
Interests: ${interests.join(', ')}
Trip Duration: ${duration} days
Preferred Climate: ${climate}

For each destination, provide:
- Name and country
- Why it matches the preferences
- Best time to visit
- Estimated budget needed
- Top 3 attractions
- Unique experiences

Return as JSON array with this structure:
[
  {
    "destination": "City, Country",
    "country": "Country",
    "matchScore": 95,
    "reason": "Why it's recommended",
    "bestTime": "Month-Month",
    "estimatedBudget": "$2000-$3000",
    "topAttractions": ["Attraction 1", "Attraction 2", "Attraction 3"],
    "uniqueExperiences": ["Experience 1", "Experience 2"],
    "climate": "Tropical/Temperate/etc",
    "imageUrl": "placeholder"
  }
]`;

        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            const data = await response.json();
            const generatedText = data.candidates[0]?.content?.parts[0]?.text || '';

            const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            throw new Error('Failed to parse AI response');
        } catch (error) {
            console.error('Error getting recommendations:', error);
            throw error;
        }
    },

    /**
     * Get packing list suggestions
     */
    async getPackingList(tripData) {
        const { destination, duration, activities, climate } = tripData;

        const prompt = `Create a comprehensive packing list for:
    
Destination: ${destination}
Duration: ${duration} days
Activities: ${activities.join(', ')}
Climate: ${climate}

Categorize items into:
- Clothing
- Toiletries
- Electronics
- Documents
- Medications
- Accessories
- Activity-specific items

Return as JSON with this structure:
{
  "categories": [
    {
      "name": "Clothing",
      "items": [
        {
          "item": "T-shirts",
          "quantity": 5,
          "priority": "essential",
          "notes": "Lightweight, quick-dry"
        }
      ]
    }
  ],
  "tips": ["Packing tip 1", "Packing tip 2"]
}`;

        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            const data = await response.json();
            const generatedText = data.candidates[0]?.content?.parts[0]?.text || '';

            const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            throw new Error('Failed to parse AI response');
        } catch (error) {
            console.error('Error generating packing list:', error);
            throw error;
        }
    }
};
