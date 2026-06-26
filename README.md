# Aura News: AI-Native Business Intelligence

Aura News is a next-generation business intelligence and news aggregator platform designed for modern professionals, financial analysts, venture capitalists, and tech founders. Utilizing advanced AI modeling, Aura News transforms standard news aggregation into an active intelligence feed featuring custom newsrooms, story arc tracing, interactive briefings, and localized multilingual summaries.

---

## 🚀 Key Features

- **Personalized Newsrooms**: Tailor your newsfeed according to specific professional personas (e.g., Venture Capitalist, Analyst, Tech Founder) and granular business topics.
- **Interactive Briefings**: Generate structured briefs instantly based on user-provided topics, keywords, or source URLs.
- **Story Arc & Trend Analytics**: Visualizes comprehensive timelines tracing market sentiment trends, stock valuations, key players, and business predictions using interactive charts.
- **Multi-angle Translation & Text-to-Speech**: Seamlessly translate briefings and articles into multiple languages and listen to the audio output using built-in high-quality vernacular speech synthesis.
- **AI Story Mode**: Convert highly complex, data-heavy reports into simple narratives, complete with custom image generations.
- **AI Business Analyst Chat**: A persistent conversational assistant designed to help you deep-dive into market trends, corporate decisions, and industry shifts.
- **Interactive Entity Insights**: Expandable cards offering structured insights, history, and key metrics for critical business entities mentioned in articles.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **Data Visualizations**: [Recharts](https://recharts.org/) (for interactive timelines and trends)
- **Markdown Processing**: [React Markdown](https://github.com/remarkjs/react-markdown)

### AI & Services
- **AI Model Integration**: [Google GenAI SDK](https://github.com/googleapis/google-genai-js) (`@google/genai`) for real-time analysis, briefings, translations, and story creation.
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore for document management and persistence, Firebase Authentication for user profiling and personalized setups).

---

## ⚙️ Setup & Installation

To run Aura News locally, follow these steps:

### 1. Prerequisites
- Ensure you have **Node.js** (v18.0.0 or higher) and **npm** installed on your machine.

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/aura-news-ai.git
cd aura-news-ai
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Variables
Create a `.env` file in the root directory and add your Google Gemini API Key:
```env
VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

### 5. Firebase Configuration
Ensure your `firebase-applet-config.json` contains valid credentials for your Firebase project:
```json
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_AUTH_DOMAIN",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_STORAGE_BUCKET",
  "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
  "appId": "YOUR_APP_ID",
  "measurementId": "YOUR_MEASUREMENT_ID",
  "firestoreDatabaseId": "YOUR_FIRESTORE_DATABASE_ID"
}
```

### 6. Start the Development Server
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000` (or the port shown in your terminal).

---

## 📦 Production Build

To compile the application for production deployment:
```bash
npm run build
```
The optimized production bundle will be located in the `dist/` directory.

---
