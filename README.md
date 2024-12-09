# Food AR

An augmented reality web application that lets you place food images in your real-world environment using your device's camera. Built with Three.js and WebXR.

## Features

- Real-time AR visualization using device camera
- Surface detection and plane tracking
- Dynamic food image placement on detected surfaces
- Automatic image aspect ratio adjustment
- Google Custom Search integration for food images
- Image text extraction using Ollama AI
- Express.js backend for image processing

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A WebXR-compatible device and browser
- Google Custom Search API key (for food images)
- Ollama AI installed locally with llava-phi3 model

## Installation

1. Clone the repository:

```bash
git clone https://github.com/TimonStadelmann/FoodAR
cd foodar
npm i
```

2. Add Api key VITE_GOOGLE_SEARCH_API_KEY inside .env

## Ollama Setup

1. Install Ollama

2. Download and set up the llava-phi3 model:

```bash
ollama pull llava-phi3
```

## Development

Start the development server:

```bash
npm run dev
```

To start the Express.js server for image processing:

```bash
npm run server
```

To develop on mobile you need to tunnel the front and backend to a public url.

1. Tunnel the backend with ether `npm run tunnelbackend`, which is not very reliant, or use the cloudflare-tunnel vscode extension and create a tunnel for port 3000.

2. Add the public url of the backend to `scene.js:112` with the path `/upload-image`.

3. Tunnel the frontend with ether `npm run tunnel` or whith the help of the cloudflare-tunnel extension.

## Project Structure

```bash
foodar/
├── src/
│ ├── js/
│ │ ├── scene.js # Main Three.js scene setup
│ │ ├── xrApp.js # WebXR initialization
│ │ ├── planeMarker.js # AR plane marker visualization
│ │ ├── utils/ # Utility functions
│ │ ├── server.js # Express.js server for image processing
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
- `npm run server` - Start Express.js server for image processing
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run tunnel` - Create public URL with localtunnel for frontend (port 8080)
- `npm run tunnelbackend` - Create public URL with localtunnel for backend (port 3000)
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
