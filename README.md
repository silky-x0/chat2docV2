# Chat2Doc 📄💬

Chat2Doc is a modern web application that allows users to chat with their PDF documents. Upload PDFs and ask questions about their content using natural language.

## Features(some dont works for now, fixing it)

- 🔒 **Authentication**: Secure login system using Auth0 with Firebase integration
- 📤 **PDF Upload**: Support for PDF file uploads with validation
- 💬 **Interactive Chat**: Natural language conversations with your documents
- 🎨 **Modern UI**: Built with Next.js and Tailwind CSS
- 🔄 **Real-time Processing**: Instant document processing and responses
- 🆓 **Free Tier**: Try with up to 5 free questions for non-authenticated users
- 🗄️ **Chat History**: Store and retrieve chat history with Firebase
- 👤 **User Profiles**: Display user information and authentication status
- 🔍 **Smart Chunking**: Efficient document chunking for better AI responses

## Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Authentication**: Auth0 + Firebase Auth
- **Database & Storage**: Firebase Firestore
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS with class-variance-authority
- **Animations**: Framer Motion
- **PDF Processing**: Custom PDF parser
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm, yarn, or bun
- Auth0 account
- Firebase project (for authentication, database, and storage)
- Google Gemini API key

### Firebase Setup

1. Create a new Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication and choose "Email/Password" provider
3. Enable Firestore Database
4. Create the following Firestore collections:
   - `pdfContents`: Stores uploaded PDF content
   - `chatHistory`: Stores user chat history
   - `users`: Stores user information
5. Set up Firebase security rules to protect your data (see Firestore Rules section)
6. Go to Project Settings > Service accounts
7. Click "Generate new private key" and save the JSON file
8. Create a Firebase web app in the Firebase console

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
```bash
git clone <repository-url>
cd chat2docV2
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Create a `.env.local` file in the root directory:
```env
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
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

### Development with HTTPS (Optional)

For local HTTPS development:

```bash
npm run dev:https
```

This will start the development server with HTTPS support on port 3001.

## Firestore Rules

Here's a sample of Firestore security rules you can use to secure your data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // PDF content access - only the owner can read/write
    match /pdfContents/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Chat history access 
    match /chatHistory/{docId} {
      // Allow create with proper user ID
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      // Allow read only for messages with matching userId
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Generic user data subcollections
    match /userData/{userId}/{documents=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anonymous users need access too (if supporting guest mode)
    match /pdfContents/anon_{anonId} {
      allow read, write: if true; // Anyone can access anonymous content
    }
    
    match /chatHistory/{docId} {
      // Also allow anonymous access with anon_ prefix
      allow read, write: if resource.data.userId.matches('^anon_.*');
    }
  }
}
```

## Deployment

### Setting up Environment Variables in Vercel

When deploying to Vercel:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add all the variables from your `.env.local` file
4. Make sure the `FIREBASE_PRIVATE_KEY` is properly formatted with quotes and newlines

### Private Key Formatting for Vercel

If you encounter issues with the Firebase private key in Vercel, use this format:
```
"-----BEGIN PRIVATE KEY-----\nXXXXXXXXXXXXXXXXXX\n-----END PRIVATE KEY-----\n"
```

Make sure to include the entire key with quotes and all newline characters.

## Project Structure

```
chat2docV2/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   │   ├── auth/           # Auth0 authentication endpoints
│   │   ├── chat/           # Chat API endpoints
│   │   └── process-pdf/    # PDF processing endpoints
│   ├── chat/               # Chat page
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── ui/                 # UI components
│   ├── auth-provider.tsx   # Auth0 authentication provider
│   ├── chat-interface.tsx  # Chat interface component
│   ├── file-uploader.tsx   # PDF file uploader
│   ├── login-button.tsx    # Login button component
│   └── logout-button.tsx   # Logout button component
├── lib/                    # Utility functions and services
│   ├── auth.ts             # Authentication utilities
│   ├── firebase.ts         # Firebase client configuration
│   ├── firebase-admin.ts   # Firebase admin configuration
│   ├── gemini.ts           # Gemini API integration
│   ├── pdf-parser.ts       # PDF parsing utilities
│   └── storage.ts          # Firestore storage utilities
└── public/                 # Static files
```

## Features in Detail

### Authentication
- Secure login/signup with Auth0
- Firebase integration for persistence
- Guest mode with limited functionality (5 free questions)
- Session management and persistence
- Seamless login/logout functionality

### Document Processing
- PDF file upload with validation
- Size and type checking
- Secure file storage in Firebase Firestore
- Efficient document parsing and text extraction

### Chat Interface
- Real-time responses from Google Gemini
- Context-aware conversations with uploaded documents
- History tracking with Firebase Firestore
- User-friendly message display

### User Profile
- Display authenticated user information
- Profile picture or initials avatar
- Email display
- Quick logout functionality

## Troubleshooting

### Firebase Authentication Issues
- Make sure your Firebase credentials are correctly set in environment variables
- Check Firebase console for any authentication or quota issues
- Ensure Firestore rules are properly configured for both authenticated and anonymous users

### PDF Processing Issues
- Make sure the PDF is not password-protected or encrypted
- Ensure the PDF contains selectable text (not just scanned images)
- Check that file size is under the 10MB limit

### Deployment Issues
- Verify all environment variables are set correctly in your hosting platform
- Ensure Firebase service account credentials are properly formatted
- Pay special attention to the `FIREBASE_PRIVATE_KEY` format in Vercel

### Auth0 Integration Issues
- Verify all Auth0 URLs are correctly configured
- Check Auth0 logs for authentication errors
- Ensure the Auth0 callback URL matches your deployment URL

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
