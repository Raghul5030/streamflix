# StreamFlix - Netflix-like Streaming Platform

A modern, production-ready streaming platform built with React, TypeScript, and TailwindCSS. Features user authentication, movie/TV show browsing, search functionality, and a beautiful Netflix-inspired dark theme.

## 🎬 Features

### Authentication

- **Sign Up/Sign In**: Complete user registration and login system
- **Protected Routes**: Secure access to authenticated content
- **Demo User**: Pre-seeded demo account for easy testing
- **Persistent Sessions**: Stay logged in across browser sessions

### Content Discovery

- **TMDB Integration**: Real movie and TV show data from The Movie Database
- **Trending Content**: Latest trending movies and shows
- **Multiple Categories**: Popular, top-rated, upcoming content
- **Search Functionality**: Advanced search with filters
- **Movie Details**: Comprehensive information with ratings, overview, and metadata

### User Interface

- **Netflix-inspired Design**: Modern dark theme with red accents
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Interactive Components**: Hover effects, animations, and smooth transitions
- **Video Player**: Full-featured player with controls (demo)
- **Modal System**: Detailed movie/show information modals

### Real-time Features

- **Live Search**: Instant search results as you type
- **Dynamic Content**: Real-time data fetching with React Query
- **Interactive Cards**: Like, add to list, and play functionality
- **User Preferences**: Personal watchlist and ratings

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm, yarn, or pnpm
- TMDB API Key (free from [The Movie Database](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd streamflix
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up TMDB API Key**

   - Get a free API key from [TMDB](https://www.themoviedb.org/settings/api)
   - Open `src/lib/tmdb.ts`
   - Replace the empty `TMDB_API_KEY` with your API key:

   ```typescript
   const TMDB_API_KEY = "your_api_key_here";
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Use the demo credentials or create a new account

## 🎭 Demo Credentials

For quick testing, use these demo credentials:

- **Email**: `demo@streamflix.com`
- **Password**: Any password (demo purposes)

## 🛠 Tech Stack

### Core Technologies

- **React 18**: Modern React with hooks and context
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **React Router 6**: Client-side routing

### Styling & UI

- **TailwindCSS 3**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icons
- **Class Variance Authority**: Component variant management
- **Custom Design System**: Netflix-inspired dark theme

### State Management & Data

- **React Query**: Server state management and caching
- **Context API**: Global authentication state
- **LocalStorage**: Persistent user data (demo purposes)

### API Integration

- **TMDB API**: Real movie and TV show data
- **Fetch API**: HTTP client for API calls
- **Custom API Client**: Typed TMDB integration

## 📱 Features Overview

### Authentication System

- Secure sign-up and sign-in flows
- Form validation with error handling
- Protected route component
- Persistent authentication state
- User profile management

### Content Management

- **Dashboard**: Hero section with featured content
- **Movie Rows**: Horizontal scrollable content sections
- **Search**: Advanced search with filtering
- **Detail Modals**: Comprehensive movie/show information
- **Video Player**: Full-featured player component (demo)

### User Experience

- **Responsive Design**: Works on all screen sizes
- **Loading States**: Skeleton loading and spinners
- **Error Handling**: Graceful error messages
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: ARIA labels and keyboard navigation

## 🎨 Design System

### Color Palette

- **Primary**: Netflix red (`#e50914`)
- **Background**: Deep dark (`#0f0f0f`)
- **Cards**: Dark gray (`#181818`)
- **Text**: White and gray variants
- **Accents**: Red gradient highlights

### Typography

- **Font Family**: Inter (Google Fonts)
- **Weights**: 300-800 range
- **Responsive sizing**: Scales with screen size

### Components

- Consistent spacing and sizing
- Hover and focus states
- Modern card designs
- Interactive buttons and forms

## 🔧 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Header, etc.)
│   ├── movie/          # Movie-related components
│   ├── player/         # Video player components
│   └── ui/             # Base UI components (Radix-based)
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API clients
├── pages/              # Page components
│   └── Auth/           # Authentication pages
└── App.tsx             # Main application component
```

## 🚦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run typecheck` - Type checking
- `npm run format.fix` - Format code with Prettier

## 🌟 Key Features Deep Dive

### Movie Discovery

- **Trending**: Real-time trending content
- **Categories**: Multiple content categories
- **Search**: Full-text search with type-ahead
- **Filters**: Filter by movies, TV shows, or all content
- **Recommendations**: Similar content suggestions

### Interactive Elements

- **Play Buttons**: Video playback (demo implementation)
- **Add to List**: Personal watchlist management
- **Like/Dislike**: Content rating system
- **Share**: Social sharing capabilities
- **Download**: Offline viewing options (demo)

### Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Tablet**: Perfect tablet experience
- **Desktop**: Full desktop functionality
- **Touch-friendly**: Large touch targets
- **Gesture support**: Swipe and scroll interactions

## 🔐 Security Features

- **Form Validation**: Client-side input validation
- **XSS Protection**: Safe content rendering
- **Route Protection**: Authentication-required routes
- **Data Sanitization**: Clean user inputs
- **Error Boundaries**: Graceful error handling

## 🚀 Production Deployment

The application is production-ready with:

- **Build Optimization**: Minified and optimized bundles
- **Code Splitting**: Lazy loading for better performance
- **Caching Strategy**: Proper cache headers
- **Error Monitoring**: Error boundary implementation
- **Performance**: Optimized images and assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [Netflix](https://netflix.com) for design inspiration
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

For support, email support@streamflix.com or create an issue in this repository.

---

Built with ❤️ using React, TypeScript, and TailwindCSS
