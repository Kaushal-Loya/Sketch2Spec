# Sketch2Spec

Sketch2Spec is an AI-powered design-to-code assistant that helps developers and designers transform hand-drawn wireframes and UI sketches into production-ready React components. It handles everything from real-time image analysis using vision AI, generating clean JSX code with Tailwind CSS, providing live component previews, and offering instant code regeneration for iterative refinement.

![Sketch2Spec Preview](./assets/hero-preview.png)

## Problem We Aim to Solve

The design-to-development handoff is slow and inefficient. As developers, we've all been through the cycle of manually translating mockups into code, guessing at spacing and colors, writing repetitive component structures, and hoping the result matches the design. Most of the time, there's back-and-forth with designers, no clear starting point, and hours spent on boilerplate. Sketch2Spec was built to fix that - by helping you convert any wireframe or UI screenshot into working React code instantly, preview it across devices, and iterate quickly until it's perfect.

## Installation

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- API keys for:
  - [Google Gemini](https://makersuite.google.com/app/apikey)
  - [Clerk](https://clerk.com/)
  - [Cloudinary](https://cloudinary.com/)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Sketch2Spec.git
   cd Sketch2Spec
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Google Gemini AI
   GEMINI_API_KEY=AIza...
   GEMINI_MODEL=gemini-1.5-flash

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Tech Stack

| Tech | Purpose |
|------|---------|
| Next.js 15 & Tailwind CSS | Frontend framework and styling |
| React 18 | UI library |
| TypeScript | Type safety and developer experience |
| Clerk | User authentication and management |
| Google Gemini | Vision AI for wireframe-to-code generation |
| Cloudinary | Image upload and storage |
| Babel Standalone | Browser-based JSX transformation |
| Lucide React | Icon library |

## Key Features

### AI-Powered Code Generation

Sketch2Spec uses Google Gemini's vision models to analyze your wireframes and UI screenshots in real-time. Simply upload an image, and it generates complete React components with Tailwind CSS styling. You can choose between two models:

- **Gemini Flash (Optimized)**: Faster generation, ideal for simple to medium complexity UIs
- **Gemini Pro (Precision)**: Higher detail analysis, perfect for complex layouts and intricate designs

The AI extracts layout hierarchies, identifies UI elements, matches colors and typography, and produces clean, semantic JSX code ready to use in your projects.

### Smart Code Sanitization & Optimization

Sketch2Spec analyzes the generated code to:

- Remove TypeScript syntax for browser compatibility
- Convert ES6 imports to UMD globals for iframe rendering
- Auto-detect and import Lucide React icons used in the JSX
- Validate code completeness and syntax correctness
- Apply retry logic with exponential backoff for robust generation
- Ensure balanced braces, proper exports, and complete component structures

### Live Component Preview

You can preview your generated components instantly in a sandboxed iframe environment. The preview system supports:

- **Responsive Device Switching**: Test across desktop (100%), tablet (768px), and mobile (375px) viewports
- **Real-time Rendering**: See changes immediately with hot-reloading
- **Error Handling**: Detailed error messages with stack traces for debugging
- **Code Inspection**: Side-by-side view of source code and live preview
- **One-Click Copy**: Copy the entire JSX code to your clipboard instantly

### Iterative Regeneration

Sketch2Spec lets you regenerate code directly from the preview page without re-uploading your image. This enables rapid iteration:

- Refine the generated output with a single click
- Get variations of the same design
- Experiment with different AI interpretations
- Save time during the design-to-code workflow

All generated code is stored in session storage, so you can navigate between pages without losing your work.

### Secure Image Management

Upload your wireframes securely through Cloudinary integration:

- Signed upload URLs prevent unauthorized access
- Support for PNG, JPG, JPEG, and WebP formats
- Automatic image optimization and CDN delivery
- Persistent storage with unique public IDs
- Direct integration with AI generation pipeline

## Project Structure

```
Sketch2Spec/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   └── generate/
│   │   │       └── route.ts          # AI code generation endpoint
│   │   └── cloudinary/
│   │       └── sign/
│   │           └── route.ts          # Cloudinary signature endpoint
│   ├── dashboard/
│   │   ├── _components/
│   │   │   └── ImageUpload.tsx       # Upload & generation UI
│   │   └── page.tsx                  # Dashboard page
│   ├── preview/
│   │   └── page.tsx                  # Preview & code viewer
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx              # Clerk sign-in
│   ├── sign-up/
│   │   └── [[...sign-up]]/
│   │       └── page.tsx              # Clerk sign-up
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Landing page
├── components/
│   └── ui/                           # Shadcn UI components
├── lib/
│   ├── aiProviders.ts                # Gemini AI integration
│   ├── aiLogger.ts                   # Request logging
│   ├── buildPreviewSrcDoc.ts         # Preview iframe builder
│   └── utils.ts                      # Utility functions
├── middleware.ts                     # Clerk auth middleware
├── tailwind.config.ts                # Tailwind config
├── next.config.ts                    # Next.js config
└── package.json
```

## Usage

### Basic Workflow

1. **Sign up or log in** using Clerk authentication
2. **Navigate to the Dashboard** after authentication
3. **Upload your wireframe** by clicking "Browse Files" or drag-and-drop
4. **Select an AI model** (Optimized for speed, Precision for detail)
5. **Click "Generate Component"** and wait 5-15 seconds
6. **View the live preview** with responsive device switching
7. **Copy the code** to your clipboard with one click
8. **Regenerate if needed** for variations or improvements

### Tips for Best Results

- Use high-contrast, well-lit photos of your sketches
- Start with simpler layouts for better accuracy
- Add labels or annotations to wireframes for context
- Use the Precision model for complex, multi-section layouts
- Iterate with regeneration to explore different interpretations

## API Endpoints

### `POST /api/ai/generate`

Generate React code from a wireframe image URL.

**Request:**
```json
{
  "imageUrl": "https://res.cloudinary.com/...",
  "model": "gemini-flash-latest",
  "allowFallback": false
}
```

**Response:**
```json
{
  "code": "import React from 'react'...",
  "provider": "Gemini",
  "fallbackUsed": false
}
```

### `POST /api/cloudinary/sign`

Generate a signed upload URL for Cloudinary.

**Request:**
```json
{
  "public_id": "sketch_1234567890"
}
```

**Response:**
```json
{
  "signature": "...",
  "timestamp": 1234567890,
  "api_key": "...",
  "cloud_name": "..."
}
```

## Configuration

### AI Model Settings

Adjust generation parameters in `lib/aiProviders.ts`:

```typescript
generationConfig: {
  temperature: 0.2,        // Lower = more deterministic
  maxOutputTokens: 16000,  // Maximum code length
  topP: 0.95,
  topK: 40,
}
```

### Preview Customization

Modify the preview environment in `lib/buildPreviewSrcDoc.ts`:

- React version: `react@18`
- Tailwind CDN: `cdn.tailwindcss.com`
- Lucide icons: `lucide-react@0.474.0`
- Babel: `@babel/standalone@7.23.5`

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add all environment variables from your `.env` file
4. Deploy with one click
5. Update Clerk URLs to match your production domain

## Troubleshooting

### Common Issues

**Preview not rendering**
- Check browser console for errors
- Verify `window.__PREVIEW_COMPONENT__` is defined
- Ensure Babel transformation completed successfully

**API rate limits**
- Gemini has rate limits; add delays between requests
- Check your quota in Google Cloud Console

**Image upload fails**
- Verify Cloudinary credentials are correct
- Check image size (max 10MB recommended)
- Ensure CORS settings are properly configured

**Module not found errors**
- Ensure Lucide icons are properly auto-detected
- Check that UMD libraries are loading correctly
- Verify import resolution in `lib/aiProviders.ts`

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Roadmap

- [ ] Support for Claude and GPT-4 Vision models
- [ ] Export to CodeSandbox and StackBlitz
- [ ] Component library integration (Material-UI, Chakra UI)
- [ ] Version history for generated code
- [ ] Collaborative editing and sharing
- [ ] Dark mode support
- [ ] Figma plugin integration
- [ ] Mobile app (React Native)
- [ ] Batch processing for multiple wireframes

## Acknowledgments

- **Google Gemini** for powerful vision AI capabilities
- **Clerk** for seamless authentication
- **Cloudinary** for reliable image hosting
- **Vercel** for excellent deployment platform
- **Shadcn** for beautiful UI components

---

**Built with ❤️ by the Sketch2Spec Team**

*Transform your sketches into reality, one component at a time.*
