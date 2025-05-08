# Chat2Doc 📄💬

Chat2Doc is a modern web application that allows users to chat with their documents. Upload PDFs, DOCXs, or text files and ask questions about their content using natural language.

## Features

- 🔒 **Authentication**: Secure login system using Auth0 with Firebase integration
- 📤 **Document Upload**: Support for PDF, DOCX, and TXT files
- 💬 **Interactive Chat**: Natural language conversations with your documents
- 🎨 **Modern UI**: Built with Next.js and Tailwind CSS
- 🔄 **Real-time Processing**: Instant document processing and responses
- 🆓 **Free Tier**: Try with up to 5 free questions for non-authenticated users
- 🗄️ **Chat History**: Store and retrieve chat history with Firebase

## Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Authentication**: Auth0 + Firebase Auth
- **Database & Storage**: Firebase Firestore
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS with class-variance-authority
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **AI Integration**: Google Gemini

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Auth0 account
- Firebase project (for authentication, database, and storage)
- Google Gemini API key

### Firebase Setup

1. Create a new Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication and choose "Email/Password" provider
3. Enable Firestore Database
4. Go to Project Settings > Service accounts
5. Click "Generate new private key" and save the JSON file
6. Create a Firebase web app in the Firebase console

### Auth0 Setup

1. Create a new Auth0 Application
2. Set Application Type to "Regular Web Application"
3. Configure the following URLs in Auth0 dashboard:
   - Application Login URI: http://localhost:3000/api/auth/login
   - Allowed Callback URLs: http://localhost:3000/api/auth/callback
   - Allowed Logout URLs: http://localhost:3000
   - Allowed Web Origins: http://localhost:3000
4. Note down your Auth0 Domain, Client ID, and Client Secret

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd chat2docV2
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a .env.local file in the root directory:
\`\`\`env
# Auth0 Configuration
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_REDIRECT_URI=http://localhost:3000/api/auth/callback
AUTH0_BASE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
FIREBASE_DATABASE_URL=https://your-firebase-project-id.firebaseio.com

# Gemini API
GEMINI_API_KEY=your-gemini-api-key
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

### Development with HTTPS (Optional)

For local HTTPS development:

\`\`\`bash
npm run dev:https
\`\`\`

This will start the development server with HTTPS support on port 3001.

## Deployment

### Setting up Environment Variables

When deploying to Vercel or another platform, make sure to set all environment variables from `.env.local` in your hosting provider.

## Usage

1. Sign up or log in to your account (which will use Auth0 + Firebase)
2. Upload your document (PDF, DOCX, or TXT)
3. Start asking questions about your document
4. Get AI-powered responses based on your document's content
5. View your chat history anytime

## Features in Detail

### Authentication
- Secure login/signup with Auth0
- Firebase integration for persistence
- Guest mode with limited functionality (5 free questions)
- Session management and persistence

### Document Processing
- Support for multiple file formats
- Secure file upload and storage in Firebase
- Efficient document parsing and processing

### Chat Interface
- Real-time responses
- Natural language processing
- Context-aware conversations
- History tracking with Firebase Firestore

## Troubleshooting

### Firebase Issues
- Make sure your Firebase credentials are correctly set in environment variables
- Check Firebase console for any authentication or quota issues
- Ensure Firestore rules are properly configured

### PDF Processing Issues
- Make sure the PDF is not password-protected or encrypted
- Ensure the PDF contains selectable text (not just scanned images)

### Deployment Issues
- Verify all environment variables are set correctly in your hosting platform
- Ensure Firebase service account credentials are properly formatted

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication by [Auth0](https://auth0.com/) and [Firebase](https://firebase.google.com/)
- Database and Storage by [Firebase](https://firebase.google.com/)
- UI Components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- AI by [Google Gemini](https://deepmind.google/technologies/gemini/)
