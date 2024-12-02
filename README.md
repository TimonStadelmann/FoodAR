# Food AR

[TODO: Description]

## Features

[TODO: List of features]

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/TimonStadelmann/FoodAR
cd foodar
npm i
```

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
│ │ ├── app.js # Main Three.js scene setup
│ │ └── index.js # Entry point
│ └── styles/
│ ├── index.css # CSS entry point
│ └── main.css # Main styles
├── public/ # Built Website
│ └── assets/ # Built assets
└── vite.config.js # Vite configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run tunnel` - Create public URL with localtunnel

## License

All rights reserved © FoodAR 2024
