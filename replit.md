# Overview

This is a personal portfolio website built as a full-stack application showcasing the work of a data scientist and web developer. The application features a modern React frontend with a Node.js/Express backend, designed to display projects, blog posts, services, resume information, and provide contact functionality. The architecture emphasizes type safety, modern UI components, and seamless data management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React 18 and TypeScript, emphasizing modern development practices and user experience:

- **UI Framework**: React with TypeScript for type safety and better development experience
- **Styling System**: Tailwind CSS with custom CSS variables for consistent theming and design tokens
- **Component Library**: Radix UI primitives with shadcn/ui components providing accessible, customizable UI elements
- **State Management**: React hooks for local state management and TanStack Query for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development builds and optimized production bundles
- **Development Tools**: Integrated with Replit-specific plugins for enhanced development experience

## Backend Architecture
The backend uses a minimal Express.js setup with TypeScript:

- **Server Framework**: Express.js with TypeScript for type-safe server-side development
- **API Design**: RESTful API structure with `/api` prefix for all endpoints
- **Data Access**: Abstract storage interface with implementations for various data entities
- **Error Handling**: Centralized error handling middleware
- **Development Integration**: Hot reloading with Vite integration during development

## Database Design
PostgreSQL database managed through Drizzle ORM:

- **ORM**: Drizzle ORM providing type-safe database operations and schema management
- **Database**: PostgreSQL with Neon Database serverless driver for cloud-native deployment
- **Schema Structure**: Comprehensive schema covering users, projects, blog posts, services, contact submissions, experience, education, and certifications
- **Migrations**: Drizzle Kit for automated database schema migrations and version control

## Content Management System
The application includes a content management structure for:

- **Projects**: Portfolio projects with categories, technologies, descriptions, and links
- **Blog Posts**: Published articles with categories, tags, slugs, and reading time estimates
- **Services**: Professional services offered with descriptions and icons
- **Resume Data**: Experience, education, and certification information
- **Contact System**: Form submissions with validation and storage

## Theming and Design System
Custom theming system built on Tailwind CSS:

- **Theme Management**: React hook-based theme switching with localStorage persistence
- **CSS Variables**: Extensive use of CSS custom properties for dynamic theming
- **Design Tokens**: Consistent spacing, colors, and typography through Tailwind configuration
- **Component Variants**: Class variance authority for consistent component styling patterns

# External Dependencies

## Core Infrastructure
- **@neondatabase/serverless**: PostgreSQL serverless database driver for cloud deployment
- **drizzle-orm**: Type-safe ORM for database operations and schema management
- **drizzle-kit**: Database migration and schema management tooling

## Frontend Libraries
- **@tanstack/react-query**: Server state management, caching, and synchronization
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives
- **react-hook-form**: Form handling with validation and error management
- **@hookform/resolvers**: Form validation resolvers including Zod integration
- **wouter**: Lightweight routing solution for React applications

## Development and Build Tools
- **vite**: Modern build tool for fast development and optimized production builds
- **@vitejs/plugin-react**: React integration for Vite
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **tailwindcss**: Utility-first CSS framework
- **typescript**: Type safety and enhanced development experience

## Validation and Utilities
- **zod**: Schema validation library for runtime type checking
- **drizzle-zod**: Integration between Drizzle ORM and Zod for schema validation
- **clsx**: Conditional className utility
- **tailwind-merge**: Tailwind CSS class merging utility
- **date-fns**: Date manipulation and formatting utilities

## UI Enhancement Libraries
- **lucide-react**: Icon library providing consistent iconography
- **class-variance-authority**: Component variant management
- **embla-carousel-react**: Carousel/slider component functionality
- **cmdk**: Command palette and search interface components