# Creo.ai Studio✍🏻

Creo.ai Studio is a full-stack AI-powered content creation platform that lets users generate, edit, and manage AI-generated content through a fast, modern web interface. Built with a security-first architecture, all AI API calls are handled server-side to keep credentials safe.

## Features

- 🎨 AI-powered content generation using the Google Gemini API
- 🔐 Secure authentication and user management via Clerk
- ⚡ Lightning-fast frontend built with React 19, TypeScript, and Vite
- 🛡️ Server-side API key handling — no credentials ever exposed to the client
- 📱 Responsive, modern UI

## Tech Stack

**Frontend**
- React 19
- TypeScript
- Vite

**Backend**
- Node.js
- Express

**AI & Auth**
- Google Gemini API
- Clerk (Authentication)

## Architecture

The application follows a client-server model where the Express backend acts as a secure proxy between the frontend and the Gemini API. This ensures the Gemini API key is never bundled into the client build or exposed in network requests from the browser.

```
Client (React + Vite) → Express Server → Gemini API
                              ↑
                        Clerk Auth
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Gemini API key
- A Clerk account and API keys

### Installation

```bash
# Clone the repository
git clone https://github.com/Kishore2005-Tech/creo_ai.git
cd creo_ai

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```
GEMINI_API_KEY=your_gemini_api_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Running Locally

```bash
npm run dev
```

The app should now be running at `http://localhost:5173` (frontend) with the Express server on its configured port.

## Project Structure

```
creo_ai/
├── src/            # Frontend source (React + TypeScript)
├── server/         # Express backend
├── public/         # Static assets
└── .env            # Environment variables (not committed)
```

## Security

- API keys are never exposed to the client
- All AI requests are proxied through the backend
- Authentication handled via Clerk's secure session management

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/Kishore2005-Tech/creo_ai/issues).

## License

This project is licensed under the MIT License.

## Author

**Kishore**
Full-Stack Developer | GitHub [https://github.com/Kishore2005-Tech]