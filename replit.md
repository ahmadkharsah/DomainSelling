# Premium Domain Sale Landing Page

## Overview

This is a single-page application designed to showcase and sell a premium domain name. The application features a minimalist landing page with a contact form that allows potential buyers to submit offers. Built with React and Express, it provides a clean, focused user experience with email notification integration for new submissions.

The application serves as a domain sale landing page where visitors can view the domain's value proposition and submit purchase offers through a validated contact form.

## Admin Panel

**Access**: Protected admin panel available at `/admin` (requires authentication)

**Default Credentials**:
- Username: `admin`
- Password: `admin123`

**Configurable Settings**:
- Domain Name: The domain displayed prominently on the landing page
- Background Color: Page background color (hex format, e.g., #FFFFFF)
- Accent Color: Used in gradient effects for the domain name display
- Font Color: Text color applied across the entire landing page
- Resend API Key: Optional email service API key for contact form submissions

**Features**:
- Session-based authentication with secure password hashing
- Protected routes that automatically redirect to login when not authenticated
- Real-time configuration updates that immediately reflect on the landing page
- Responsive admin interface for mobile, tablet, and desktop
- Logout functionality to end admin sessions

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite as the build tool and development server.

**UI Component System**: Utilizes shadcn/ui component library built on top of Radix UI primitives. This provides accessible, customizable components following the "New York" style variant. Components are locally stored in the project rather than installed as dependencies, allowing for full customization.

**Styling Approach**: Tailwind CSS with a custom design system based on HSL color variables. The color palette is specifically tailored for the domain sale use case with:
- Deep navy blue background (#0C2B4E)
- Off-white text (#F4F4F4)  
- Teal-blue accents (#1D546C)
- Semantic color tokens for validation states

**Form Management**: React Hook Form with Zod schema validation, ensuring type-safe form handling and comprehensive client-side validation before submission.

**State Management**: TanStack Query (React Query) for server state management, providing caching, background updates, and optimistic UI updates for the contact form submission.

**Routing**: Wouter for lightweight client-side routing with the following pages:
- `/` - Public landing page
- `/login` - Admin authentication page
- `/admin` - Protected admin panel (requires login)
- `404` - Not found page

**Authentication**: Custom authentication system with:
- `useAuth` hook for accessing user state and authentication mutations
- `ProtectedRoute` component for route guards
- Session persistence using express-session with in-memory store

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js, configured as an ES module project.

**Development Setup**: Custom Vite integration for hot module replacement during development. In production, the server serves pre-built static assets from the dist directory.

**API Design**: RESTful API with the following endpoints:
- `POST /api/contact` - Submit domain purchase offer (rate limited: 3 requests per 15 minutes)
- `POST /api/login` - Authenticate admin user
- `POST /api/logout` - End admin session
- `POST /api/register` - Register new admin user
- `GET /api/user` - Get current authenticated user
- `GET /api/site-config` - Fetch site configuration (public)
- `PUT /api/site-config` - Update site configuration (requires authentication)

**Validation**: Server-side validation using Zod schemas shared between frontend and backend through the `shared` directory, ensuring consistent validation rules across the stack.

**Data Storage Strategy**: Abstracted storage interface (`IStorage`) with an in-memory implementation (`MemStorage`) for development. The interface is designed to be easily swapped for database implementations without changing application logic.

**Security Measures**: 
- Password hashing using scrypt algorithm for admin credentials
- Session-based authentication with secure session management
- Protected API routes requiring authentication
- Honeypot field for spam detection on contact form
- Rate limiting on contact form submissions (3 per 15 minutes)
- Request body parsing with raw body preservation for potential webhook verification
- CORS and security headers through Express middleware

### Data Storage Solutions

**Current Implementation**: In-memory storage using Map data structures for user and contact submission data. This is suitable for development but requires database migration for production.

**Database Schema Design**: Drizzle ORM is configured for PostgreSQL with three main tables:

1. **users table**: Stores admin credentials with UUID primary keys and hashed passwords
2. **contact_submissions table**: Stores domain offer submissions with fields for:
   - full name (required)
   - email (required, validated format)
   - offer amount (required, minimum $500)
   - message (optional, max 2000 characters)
   - submission timestamp
3. **site_config table**: Stores site configuration with fields for:
   - domain name (displayed on landing page)
   - background color (hex format)
   - accent color (hex format)
   - font color (hex format)
   - Resend API key (optional)

**Schema Validation**: Drizzle-Zod integration provides automatic Zod schema generation from database schema, maintaining a single source of truth for data validation.

**Migration Strategy**: Drizzle Kit is configured for schema migrations with migrations stored in the `migrations` directory. The `db:push` script directly pushes schema changes to the database.

### Email Integration Architecture

**Email Service Provider**: Resend API for transactional email delivery.

**Credential Management**: Uses Replit's connector system to securely retrieve API credentials at runtime. Credentials are fetched on-demand rather than cached to ensure fresh tokens, supporting both Repl and Deployment environments.

**Email Templates**: Server-rendered HTML email templates using template literals. The `createOfferEmailHTML` function generates formatted emails with submission details in a responsive table layout.

**Email Flow**: When a contact form is submitted, the system:
1. Validates the submission (including honeypot spam check)
2. Stores it in memory (in-memory storage for development)
3. Sends a formatted HTML email notification via Resend API to the configured recipient
4. Uses the submitter's email as the reply-to address for easy follow-up
5. Returns success (201) only if email sends successfully; any email delivery failure returns error (500) to user

**Error Handling**: Email delivery errors properly propagate to the frontend, showing error messages via toast notifications rather than false success confirmations.

### Design System

**Typography**: Inter font family from Google Fonts with a clear hierarchy:
- Large display sizes (56-72px) for the domain name
- Structured heading sizes (32-40px, text-3xl/4xl in Tailwind)
- Readable body text (16-18px)

**Spacing System**: Consistent use of Tailwind's spacing scale (4, 6, 8, 12, 16, 24 units) for vertical rhythm and component spacing.

**Layout Constraints**: Max-width container (max-w-2xl) centered on the page, optimized for form-focused experience rather than wide content layouts.

**Component Architecture**: Modular component structure with separate components for:
- DomainHero: Large domain name display with gradient text effect and tagline (accepts dynamic domain name and accent color from site config)
- ValueProposition: Benefits list with icons (icons use foreground color for consistency)
- ContactForm: Form with comprehensive validation, submission handling, success confirmation, and reset functionality to submit multiple offers
- Footer: Simple copyright footer

**Admin Components**:
- Login: Responsive login form with username/password authentication
- Admin: Protected admin panel with site configuration form, color pickers, and live updates
- ProtectedRoute: Route guard component that redirects to login when not authenticated

**User Experience Features**:
- Form submission shows loading state with spinner
- Success confirmation displays "Thank You" message with next steps
- "Submit Another Offer" button resets form for additional submissions
- Inline validation errors guide users to correct issues
- Toast notifications for submission errors
- Dynamic site customization through admin panel
- Real-time configuration updates that immediately affect the landing page
- Responsive design for all pages (mobile, tablet, desktop)

## External Dependencies

### Third-Party Services

**Resend**: Email delivery service integrated through their Node.js SDK. Requires API key and verified sender email configured through Replit connectors.

**Neon Database**: Serverless PostgreSQL database via `@neondatabase/serverless` driver. Connection configured through DATABASE_URL environment variable.

### Key Libraries

**UI & Styling**:
- Radix UI primitives (@radix-ui/*) - Accessible component primitives
- Tailwind CSS - Utility-first CSS framework
- class-variance-authority - Type-safe component variant management
- lucide-react - Icon library

**Form & Validation**:
- react-hook-form - Form state management
- zod - Schema validation
- @hookform/resolvers - Integration between react-hook-form and zod

**Authentication & Security**:
- passport - Authentication middleware
- passport-local - Username/password authentication strategy
- express-session - Session management
- memorystore - In-memory session store for development
- scrypt - Password hashing (built-in Node.js crypto module)

**Data Management**:
- @tanstack/react-query - Server state management
- drizzle-orm - TypeScript ORM
- drizzle-zod - Zod schema generation from Drizzle schemas

**Development Tools**:
- Vite - Build tool and dev server
- TypeScript - Type safety
- tsx - TypeScript execution for Node.js
- esbuild - Fast bundling for production builds

### Environment Requirements

**Runtime**: Node.js with ES module support
**Database**: PostgreSQL (via Neon serverless driver)
**Email**: Resend account with verified sender domain
**Deployment**: Configured for Replit deployment with environment-specific handling for connectors and authentication tokens