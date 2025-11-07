# Premium Domain Sale Landing Page

## Overview

This is a single-page application designed to showcase and sell a premium domain name. The application features a minimalist landing page with a contact form that allows potential buyers to submit offers. Built with React and Express, it provides a clean, focused user experience with email notification integration for new submissions.

The application serves as a domain sale landing page where visitors can view the domain's value proposition and submit purchase offers through a validated contact form.

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

**Routing**: Wouter for lightweight client-side routing (currently minimal with just home and 404 pages).

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js, configured as an ES module project.

**Development Setup**: Custom Vite integration for hot module replacement during development. In production, the server serves pre-built static assets from the dist directory.

**API Design**: RESTful API endpoint (`POST /api/contact`) with rate limiting (3 requests per 15 minutes) to prevent spam and abuse.

**Validation**: Server-side validation using Zod schemas shared between frontend and backend through the `shared` directory, ensuring consistent validation rules across the stack.

**Data Storage Strategy**: Abstracted storage interface (`IStorage`) with an in-memory implementation (`MemStorage`) for development. The interface is designed to be easily swapped for database implementations without changing application logic.

**Security Measures**: 
- Honeypot field for spam detection
- Rate limiting on form submissions
- Request body parsing with raw body preservation for potential webhook verification
- CORS and security headers through Express middleware

### Data Storage Solutions

**Current Implementation**: In-memory storage using Map data structures for user and contact submission data. This is suitable for development but requires database migration for production.

**Database Schema Design**: Drizzle ORM is configured for PostgreSQL with two main tables:

1. **users table**: Stores user credentials with UUID primary keys
2. **contact_submissions table**: Stores domain offer submissions with fields for full name, email, offer amount, optional message, and submission timestamp

**Schema Validation**: Drizzle-Zod integration provides automatic Zod schema generation from database schema, maintaining a single source of truth for data validation.

**Migration Strategy**: Drizzle Kit is configured for schema migrations with migrations stored in the `migrations` directory. The `db:push` script directly pushes schema changes to the database.

### Email Integration Architecture

**Email Service Provider**: Resend API for transactional email delivery.

**Credential Management**: Uses Replit's connector system to securely retrieve API credentials at runtime. Credentials are fetched on-demand rather than cached to ensure fresh tokens, supporting both Repl and Deployment environments.

**Email Templates**: Server-rendered HTML email templates using template literals. The `createOfferEmailHTML` function generates formatted emails with submission details in a responsive table layout.

**Email Flow**: When a contact form is submitted, the system:
1. Validates the submission
2. Stores it in the database
3. Sends a formatted email notification to the configured recipient
4. Uses the submitter's email as the reply-to address for easy follow-up

### Design System

**Typography**: Inter font family from Google Fonts with a clear hierarchy:
- Large display sizes (56-72px) for the domain name
- Structured heading sizes (32-40px, text-3xl/4xl in Tailwind)
- Readable body text (16-18px)

**Spacing System**: Consistent use of Tailwind's spacing scale (4, 6, 8, 12, 16, 24 units) for vertical rhythm and component spacing.

**Layout Constraints**: Max-width container (max-w-2xl) centered on the page, optimized for form-focused experience rather than wide content layouts.

**Component Architecture**: Modular component structure with separate components for:
- DomainHero: Large domain name display with tagline
- ValueProposition: Benefits list with icons
- ContactForm: Form with validation and submission handling
- Footer: Simple copyright footer

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