# Frontend Application

A modern Next.js application for medical case management and file processing.

## Tech Stack

- **Next.js**: React framework with server-side rendering
- **React**: UI component library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework

## Features

- Medical case status tracking
- File upload system
- Real-time status updates
- Responsive design
- Dynamic status progression

## Setup Instructions

1. Install Dependencies
   ```bash
   npm install
   ```

2. Start Development Server
   ```bash
   npm run dev
   ```

The application will start at `http://localhost:3000`

## Project Structure

```
frontend/
├── app/              # Next.js app router pages
├── components/       # Reusable React components
├── services/        # API and external service integrations
├── types/           # TypeScript type definitions
└── styles/          # Global styles and Tailwind config
```

## Tasks

Add a spinner to the upload button components/guidelines-upload/index.tsx

Don't allow user to upload a guidelines file until a medical record has been uploaded. Show a <Toast />

Enable Continue button only when both files have been uploaded

## Future Work

- **UI Improvements**:
  - Convert to FastUI/FastHTML for improved performance
  - Add animations and transitions
  - Implement dark mode
  - Add accessibility features

- **Features**:
  - Real-time notifications
  - Case history tracking
  - Advanced search and filtering
  - Batch file processing

- **Performance**:
  - Implement caching
  - Add lazy loading
  - Optimize bundle size