# 🌍 WanderAI - AI-Powered Trip Planner

> **Smart, stress-free trip planning powered by AI. Create personalized itineraries, manage bookings, and organize every detail of your journey—all in one place.**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://trip-planner-git-main-anish-john777s-projects.vercel.app/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-purple)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Tech Stack](#tech-stack)
- [Live Demo](#live-demo)
- [Features Implemented](#features-implemented)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**WanderAI** is a comprehensive, AI-powered trip planning application designed to make travel planning effortless and enjoyable. Whether you're planning a solo adventure, a romantic getaway, or a group expedition, WanderAI provides intelligent tools to help you create, customize, and manage every aspect of your journey.

### Key Highlights

- 🤖 **AI-Powered Planning**: Leverage Google Gemini AI to generate personalized itineraries
- 📅 **Day-wise Itineraries**: Organize your trip with detailed day-by-day plans
- 🏨 **Integrated Bookings**: Find hotels, Airbnb, resorts, transport, and restaurants
- 💰 **Smart Tools**: Currency converter, expense splitter, packing lists, and more
- 📖 **Trip Stories**: Create and share beautiful travel memories
- 🔐 **Secure Authentication**: User accounts with Supabase integration
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices

---

## 🚨 Problem Statement

### The Challenge

Modern travelers face several pain points when planning trips:

1. **Fragmented Planning**: Information scattered across multiple apps and websites
2. **Time-Consuming Research**: Hours spent researching destinations, activities, and logistics
3. **Budget Management**: Difficulty tracking expenses and splitting costs with travel companions
4. **Lack of Personalization**: Generic travel recommendations that don't match individual preferences
5. **Poor Organization**: Lost bookings, forgotten activities, and chaotic itineraries
6. **Group Coordination**: Challenges in coordinating plans with multiple travelers

### Our Solution

WanderAI addresses these challenges by providing:

- **Unified Platform**: All trip planning tools in one place
- **AI Intelligence**: Instant, personalized itinerary generation based on preferences
- **Smart Organization**: Day-wise planning with automatic scheduling and reminders
- **Financial Tools**: Built-in expense tracking and splitting capabilities
- **Collaboration**: Easy sharing and coordination for group trips
- **Memory Preservation**: Trip story creator to document and share experiences

---

## 🛠️ Tech Stack

### Frontend

- **React 19.2.0** - Modern UI library with latest features
- **React Router DOM 7.10.1** - Client-side routing
- **Vite 7.2.4** - Lightning-fast build tool and dev server
- **Lucide React 0.561.0** - Beautiful, consistent icon library
- **Leaflet & React Leaflet** - Interactive maps integration
- **CSS3 & Vanilla CSS** - Custom styling with modern CSS features and glassmorphism

### Backend & Services

- **Supabase 2.87.1** - Backend-as-a-Service (authentication, database, storage)
- **Google Gemini AI 0.24.1** - AI-powered trip planning and recommendations
- **LocalStorage** - Client-side data persistence (fallback mode)

### Additional Libraries

- **jsPDF 3.0.4** - PDF generation for trip itineraries
- **OpenWeatherMap API** - Weather forecasts for destinations
- **Google Maps API** - Maps, places, and directions (optional)

### Development Tools

- **ESLint** - Code quality and consistency
- **Vite Plugin React** - Fast refresh and optimizations
- **Git** - Version control

---

## 🌐 Live Demo

🚀 **[View Live Demo](https://trip-planner-git-main-anish-john777s-projects.vercel.app/)**

> **Experience WanderAI**: The application is deployed on Vercel with full functionality

### Demo Credentials

```
Email: demo@wanderai.com
Password: demo123
```

### Community Features 🚀
- **Explore Community**: Browse and discover public itineraries shared by other travelers.
- **Trip Sharing**: Toggle trips as public to share your planning genius with the world!
- **Interactive Maps**: Real-time Leaflet maps for all trip destinations.
- **Smart Weather**: Live weather insights integrated into your trip overview.

---

## ✨ Features Implemented

### 🎨 Core Features

#### 1. **AI Trip Creator**
- 🤖 Powered by Google Gemini AI
- 📝 Generates complete itineraries based on:
  - Destination
  - Travel dates
  - Number of travelers
  - Trip type (solo, couple, group)
  - Budget preferences
- 📄 Download itinerary as PDF
- ✏️ Edit and customize AI-generated plans

#### 2. **Manual Trip Creator**
- 🖊️ Step-by-step trip creation wizard
- 📍 Multi-city planning support
- 🗓️ Custom date range selection
- 👥 Traveler management
- 💵 Budget allocation

#### 3. **Complete Trip Setup**
- 🎯 All-in-one trip configuration
- 📋 Comprehensive trip details in one page
- ⚡ Quick setup for experienced users

#### 4. **Day Planner**
- 📅 Visual day-by-day itinerary
- ⏰ Time-based activity scheduling
- 🏷️ Activity categorization
- ✅ Task completion tracking
- 📝 Notes and reminders

#### 5. **Trip Details & Confirmation**
- 📊 Complete trip overview
- 💰 Budget breakdown
- 🗺️ Destination information
- ✈️ Travel logistics
- 📸 Photo gallery

### 🏨 Booking Features

#### 6. **Hotel Finder**
- 🏨 Search and compare hotels
- ⭐ Ratings and reviews
- 💵 Price comparison
- 📍 Location-based search
- 🔖 Save favorites

#### 7. **Airbnb Finder**
- 🏠 Vacation rental search
- 🛏️ Property details and amenities
- 📅 Availability calendar
- 💬 Host information

#### 8. **Resort Finder**
- 🏖️ Luxury resort search
- 🌴 All-inclusive packages
- 🏊 Amenities and facilities
- 🎯 Special offers

#### 9. **Transport Booking**
- ✈️ Flight search
- 🚂 Train booking
- 🚌 Bus options
- 🚗 Car rentals
- 🚕 Local transport

#### 10. **Restaurant Finder**
- 🍽️ Cuisine-based search
- ⭐ Reviews and ratings
- 📍 Location mapping
- 💰 Price range filtering
- 🕒 Operating hours

#### 11. **Tour Packages**
- 🎫 Pre-planned tour packages
- 🗺️ Guided tours
- 🎭 Cultural experiences
- 🏞️ Adventure activities

### 🧰 Smart Tools

#### 12. **Currency Converter**
- 💱 Real-time exchange rates
- 🌍 Multiple currency support
- 📊 Conversion history
- 💹 Rate trends

#### 13. **Expense Splitter**
- 💰 Track shared expenses
- 👥 Multi-person splitting
- 📊 Expense categories
- 🧾 Settlement calculations
- 📈 Expense analytics

#### 14. **Packing List**
- 🎒 Smart packing suggestions
- ✅ Checklist functionality
- 📦 Category-based organization
- 🌡️ Weather-based recommendations

#### 15. **Safety Alerts**
- ⚠️ Destination safety information
- 🚨 Travel advisories
- 📞 Emergency contacts
- 🏥 Health precautions

#### 16. **Emergency Help**
- 🆘 Quick access to emergency services
- 📞 Local emergency numbers
- 🏥 Nearby hospitals
- 👮 Police stations
- 🏛️ Embassy contacts

#### 17. **AI Chat Planner**
- 💬 Conversational trip planning
- 🤖 AI-powered recommendations
- ❓ Travel Q&A
- 💡 Smart suggestions

#### 18. **Trip Story Creator**
- 📖 Create travel blogs
- 📸 Photo integration
- ✍️ Rich text editor
- 🌟 AI-assisted writing
- 🔗 Share stories

### 👤 User Management

#### 19. **Authentication System**
- 🔐 Secure login/signup
- 📧 Email verification
- 🔑 Password reset
- 👤 User profiles
- 🔒 Session management

#### 20. **Saved Trips**
- 💾 Save unlimited trips
- 📂 Trip organization
- 🔍 Search and filter
- 📊 Trip statistics
- 🗑️ Archive/delete trips

#### 21. **Settings**
- ⚙️ User preferences
- 🌐 Language settings
- 🎨 Theme customization
- 🔔 Notification preferences
- 📱 Account management

### 🎨 UI/UX Features

#### 22. **Modern Design System**
- 🎨 Clean, intuitive interface
- 🌈 Vibrant color palette
- ✨ Smooth animations
- 📱 Fully responsive
- ♿ Accessibility features

#### 23. **Navigation**
- 🧭 Intuitive navbar
- 🔗 Breadcrumb navigation
- 📜 Scroll-to-top functionality
- 🔍 Quick search

#### 24. **Performance**
- ⚡ Fast page loads
- 🚀 Optimized bundle size
- 💾 Efficient caching
- 📊 Lazy loading

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ANISH-JOHN777/wander-AI.git
cd wander-AI
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys (see [Environment Variables](#environment-variables))

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
FinalTrip/
├── public/                  # Static assets
├── src/
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable React components
│   │   ├── Navbar.jsx
│   │   ├── ScrollToTop.jsx
│   │   └── ...
│   ├── config/             # Configuration files
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── TripContext.jsx
│   │   ├── UserContext.jsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── bookings/       # Booking-related pages
│   │   ├── smart-tools/    # Smart tool pages
│   │   ├── Home.jsx
│   │   ├── Auth.jsx
│   │   └── ...
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main app component
│   ├── App.css             # App styles
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

---

## 🔐 Environment Variables

### Required Variables

```env
# Backend Mode: 'local' or 'supabase'
VITE_BACKEND_MODE=local

# Supabase (if using supabase mode)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini AI (for AI features)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Optional Variables

```env
# Weather API
VITE_WEATHER_API_KEY=your_openweathermap_api_key

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Currency Exchange
VITE_EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key

# Unsplash (for images)
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

### Getting API Keys

1. **Gemini AI**: [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Supabase**: [Supabase Dashboard](https://app.supabase.com)
3. **OpenWeatherMap**: [OpenWeatherMap API](https://openweathermap.org/api)
4. **Google Maps**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

See `.env.example` for detailed instructions.

---

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)

### AI Trip Creator
![AI Trip Creator](screenshots/ai-trip-creator.png)

### Day Planner
![Day Planner](screenshots/day-planner.png)

### Bookings
![Bookings](screenshots/bookings.png)

### Smart Tools
![Smart Tools](screenshots/smart-tools.png)

> **Note**: Add screenshots to a `screenshots/` folder in your repository

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Anish John**

- GitHub: [@ANISH-JOHN777](https://github.com/ANISH-JOHN777)
- Project Repository: [wander-AI](https://github.com/ANISH-JOHN777/wander-AI)
- Live Demo: [WanderAI on Vercel](https://trip-planner-git-main-anish-john777s-projects.vercel.app/)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [Supabase](https://supabase.com/) - Backend Services
- [Google Gemini AI](https://ai.google.dev/) - AI Capabilities
- [Lucide Icons](https://lucide.dev/) - Icon Library
- [OpenWeatherMap](https://openweathermap.org/) - Weather Data

---

## 📊 Project Stats

- **Total Pages**: 20+
- **Components**: 15+
- **Smart Tools**: 7
- **Booking Features**: 6
- **Lines of Code**: 10,000+
- **Development Time**: [Your timeframe]

---

## 🗺️ Roadmap

- [x] Social features (trip sharing, public explore page)
- [x] Interactive mapping (Leaflet integration)
- [x] Smarter weather integration
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Integration with booking platforms
- [ ] Integration with booking platforms
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced analytics
- [ ] Collaborative trip planning

---

## 📞 Support

For support, email support@wanderai.com or join our [Discord community](https://discord.gg/YOUR_INVITE).

---

<div align="center">

**Made with ❤️ by travelers, for travelers**

⭐ Star this repo if you find it helpful!

</div>
