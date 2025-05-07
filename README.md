# Chat2Doc 📄💬

Chat2Doc is a modern web application that allows users to chat with their documents. Upload PDFs, DOCXs, or text files and ask questions about their content using natural language.

## Features

- 🔒 **Authentication**: Secure login system using Auth0
- 📤 **Document Upload**: Support for PDF, DOCX, and TXT files
- 💬 **Interactive Chat**: Natural language conversations with your documents
- 🎨 **Modern UI**: Built with Next.js and Tailwind CSS
- 🔄 **Real-time Processing**: Instant document processing and responses
- 🆓 **Free Tier**: Try with up to 5 free questions for non-authenticated users

## Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Authentication**: Auth0
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS with class-variance-authority
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **AI Integration**: Google Gemini
- **Storage**: Vercel KV (for serverless storage)

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Auth0 account
- Google Gemini API key
- Vercel account (for deployment)

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
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_REDIRECT_URI=http://localhost:3000/api/auth/callback
AUTH0_BASE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
GEMINI_API_KEY=your-gemini-api-key
\`\`\`

4. Configure Auth0:
   - Create a new application in Auth0 dashboard
   - Set Application Type to "Regular Web Application"
   - Configure the following URLs in Auth0 dashboard:
     - Application Login URI: http://localhost:3000/api/auth/login
     - Allowed Callback URLs: http://localhost:3000/api/auth/callback
     - Allowed Logout URLs: http://localhost:3000
     - Allowed Web Origins: http://localhost:3000

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

### Development with HTTPS (Optional)

For local HTTPS development:

\`\`\`bash
npm run dev:https
\`\`\`

This will start the development server with HTTPS support on port 3001.

## Deployment to Vercel

### 1. Create a Vercel KV Database

1. Install Vercel CLI and login:
\`\`\`bash
npm i -g vercel
vercel login
\`\`\`

2. Create and link a KV database to your project:
\`\`\`bash
vercel link
vercel kv create
\`\`\`

3. Connect the KV database to your project:
\`\`\`bash
vercel env pull .env.local
\`\`\`

### 2. Configure Environment Variables in Vercel

When deploying to Vercel, make sure to set these environment variables:

- \`AUTH0_DOMAIN\`
- \`AUTH0_CLIENT_ID\`
- \`AUTH0_CLIENT_SECRET\`
- \`AUTH0_REDIRECT_URI\` (should be your production URL)
- \`AUTH0_BASE_URL\` (should be your production URL)
- \`GEMINI_API_KEY\`
- \`KV_URL\` (automatically set by Vercel KV)
- \`KV_REST_API_URL\` (automatically set by Vercel KV)
- \`KV_REST_API_TOKEN\` (automatically set by Vercel KV)
- \`KV_REST_API_READ_ONLY_TOKEN\` (automatically set by Vercel KV)

### 3. Deploy to Vercel

\`\`\`bash
vercel
\`\`\`

## Usage

1. Sign up or log in to your account
2. Upload your document (PDF, DOCX, or TXT)
3. Start asking questions about your document
4. Get AI-powered responses based on your document's content

## Features in Detail

### Authentication
- Secure login/signup with Auth0
- Guest mode with limited functionality (5 free questions)
- Session management and persistence

### Document Processing
- Support for multiple file formats
- Secure file upload and storage
- Efficient document parsing and processing

### Chat Interface
- Real-time responses
- Natural language processing
- Context-aware conversations
- History tracking

## Troubleshooting

### PDF Processing Issues
- Make sure the PDF is not password-protected or encrypted
- Ensure the PDF contains selectable text (not just scanned images)

### Deployment Issues
- Verify all environment variables are set correctly in Vercel
- Check that Vercel KV is properly configured and connected
- Ensure your Gemini API key has proper permissions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication by [Auth0](https://auth0.com/)
- UI Components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Storage by [Vercel KV](https://vercel.com/storage/kv)
- AI by [Google Gemini](https://deepmind.google/technologies/gemini/)
