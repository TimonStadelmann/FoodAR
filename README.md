# Food AR

An augmented reality web application that lets you place food images in your real-world environment using your device's camera. Built with Three.js and WebXR.

## Features

- Real-time AR visualization using device camera
- Surface detection and plane tracking
- Dynamic food image placement on detected surfaces
- Automatic image aspect ratio adjustment
- Google Custom Search integration for food images
- Responsive design with mobile-first approach

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A WebXR-compatible device and browser
- Google Custom Search API key (for food images)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/TimonStadelmann/FoodAR
cd foodar
npm i
```

2. Add Api key under VITE_GOOGLE_SEARCH_API_KEY

## Development

Start the development server:

```bash
npm run dev
```

To make your local development server accessible via a public URL:

```bash
npm run tunnel
```

## Project Structure

```bash
foodar/
├── src/
│ ├── js/
│ │ ├── scene.js # Main Three.js scene setup
│ │ ├── xrApp.js # WebXR initialization
│ │ ├── planeMarker.js # AR plane marker visualization
│ │ ├── utils/ # Utility functions
│ │ └── index.js # Entry point
│ ├── css/
│ │ ├── index.css # CSS entry point
│ │ ├── main.css # Main styles
│ │ ├── reset.css # CSS reset
│ │ └── variables.css # CSS variables
│ └── index.html # Main HTML file
├── public/ # Static assets
└── vite.config.js # Vite configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run tunnel` - Create public URL with localtunnel
- `npm run lint` - Run ESLint and Stylelint
- `npm run format` - Format code with Prettier

## Development Tools

- Vite for fast development and building
- ESLint for JavaScript linting
- Stylelint for CSS linting
- Prettier for code formatting
- Husky for Git hooks
- Autoprefixer for CSS compatibility

## License

All rights reserved © FoodAR 2024
