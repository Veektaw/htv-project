# HTV Web Application

HTV is a role-based medical finance dashboard built with Next.js. The application supports two main user experiences:

- **Admin portal** for managing users, invoices, reconciliations, prescriptions, payments, dashboards, and platform settings.
- **Doctor portal** for viewing earnings, prescriptions, invoices, reconciliations, payments, notifications, and profile settings.

The app uses secure server-side session handling, typed API service modules, reusable table and modal patterns, and a component structure organized by product area.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [UI and Styling](#ui-and-styling)
- [Project Structure](#project-structure)
- [Routing](#routing)
- [Data Fetching and API Layer](#data-fetching-and-api-layer)
- [Authentication and Authorization](#authentication-and-authorization)
- [State Management](#state-management)
- [Forms and Validation](#forms-and-validation)
- [Development Notes](#development-notes)

## Overview

HTV is implemented as a Next.js App Router application. The root route redirects users to sign in, after which authenticated users are routed into the correct dashboard based on their role.

The application is organized around two route groups:

- `app/(admin)` contains admin-only pages.
- `app/(doctor)` contains doctor-facing pages.

Shared layouts, sidebar navigation, headers, tables, UI primitives, hooks, types, API wrappers, and server actions are separated into dedicated folders to keep each domain area maintainable.

## Tech Stack

- **Framework:** Next.js 16
- **Runtime UI:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI primitives:** shadcn/ui style components, Radix UI, lucide-react
- **Forms:** React Hook Form
- **Validation:** Zod
- **Server state:** TanStack React Query
- **Dates:** date-fns, react-day-picker
- **Authentication/session tokens:** jose
- **Notifications:** Sonner
- **Linting:** ESLint with Next.js core web vitals and TypeScript rules
- **Formatting:** Prettier with Tailwind class sorting

## Features

- Role-based admin and doctor dashboards.
- Secure sign-in, logout, password reset, and first-login password change flows.
- Protected route handling with session cookies and role redirects.
- Admin management for users, invoices, reconciliations, prescriptions, and payments.
- Doctor workflows for invoices, reconciliations, payments, prescriptions, and profile settings.
- Comment history and add-comment modals for invoice and reconciliation records.
- Reusable table components with pagination, sortable headers, filters, search wrappers, status cells, and row actions.
- Global toast notifications.
- Collapsible sidebar layout shared by authenticated sections.

## Getting Started

### Prerequisites

- Node.js compatible with Next.js 16
- npm

### Installation

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with the correct API URL, app URL, and secret key.

Start the development server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

## Environment Variables

The project expects these variables:

```env
APP_URL=
BASE_URL=
SECRET_KEY=
```

| Variable | Purpose |
| --- | --- |
| `APP_URL` | Base URL for this Next.js application, usually `http://localhost:3000` in development. |
| `BASE_URL` | Base URL for the backend API consumed by the service layer. |
| `SECRET_KEY` | Secret used by `jose` to sign and verify encrypted session cookies. |

Do not commit real `.env.local` values. Local environment files are ignored by Git.

## Available Scripts

```bash
npm run dev
```

Runs the local development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after a successful build.

```bash
npm run lint
```

Runs ESLint across the project.

## UI and Styling

The application uses Tailwind CSS 4 with global theme tokens defined in `app/globals.css`.

Key styling conventions:

- Global font is Inter, configured through `next/font` in `public/fonts/index.ts`.
- Shared UI primitives live in `app/_components/ui`.
- shadcn/ui configuration is stored in `components.json`.
- Tailwind theme tokens include custom named colors such as `RangoonGreen`, `CatskillWhite`, `PortlandOrange`, `DeepSea`, and `LightMustard`.
- Sidebar sizing is controlled with CSS variables:
  - `--sidebar-width-open`
  - `--sidebar-width-close`
- Toasts are rendered globally through Sonner in `app/layout.tsx`.
- Tooltips are provided globally through the shared `TooltipProvider`.

## Project Structure

```text
app/
  (admin)/                 Admin route group
  (auth)/                  Authentication pages
  (doctor)/                Doctor route group
  _components/             App components grouped by domain and shared usage
    admin/                 Admin-specific components
    auth/                  Auth forms and auth UI
    doctor/                Doctor-specific components
    shared/                Layout, sidebar, header, tables, loaders, menus
    ui/                    Reusable UI primitives
  api/                     Next.js route handlers used by the app
  globals.css              Tailwind imports, theme tokens, and base styles
  layout.tsx               Root providers and global metadata
  page.tsx                 Root redirect to sign-in

contexts/                  React context providers
hooks/                     Shared client hooks
lib/                       Utilities, constants, route helpers, toast helpers
public/                    Static images, SVGs, and font setup
services/
  actions/                 Server actions used by client flows
  apis/                    Typed backend API functions
  auth.ts                  Session, cookie, auth, and route protection helpers
types/                     Shared TypeScript domain and API types
proxy.ts                   Next.js proxy middleware for protected routes
```

## Routing

The app uses Next.js route groups to separate pages by audience without adding the group name to the URL.

### Public and auth routes

- `/` redirects to `/sign-in`.
- `/sign-in` handles login.
- `/reset-password` handles password reset.
- `/create-new-password` handles required password updates.

### Doctor routes

- `/dashboard`
- `/invoices`
- `/payments`
- `/prescriptions`
- `/profile`
- `/reconciliations`

### Admin routes

- `/admin/dashboard`
- `/admin/invoices`
- `/admin/payments`
- `/admin/prescriptions`
- `/admin/reconciliations`
- `/admin/settings`
- `/admin/users`
- `/admin/users/[id]`

## Data Fetching and API Layer

Backend communication is centralized through `services/apis/api.ts`.

The `Api` class provides typed helpers for:

- `GET`
- `POST`
- `PATCH`
- `PUT`
- `DELETE`
- authenticated requests
- JSON payloads
- form data payloads
- image fetching as an array buffer
- consistent success and error response shapes

Domain API modules live under `services/apis`, for example:

- `auth.api.ts`
- `dashboard.api.ts`
- `invoices.api.ts`
- `doctor-invoices.api.ts`
- `payments.api.ts`
- `prescriptions.api.ts`
- `reconciliations.api.ts`
- `users.api.ts`

Server actions live under `services/actions` and are used for flows that need server-side cookie or session access.

## Authentication and Authorization

Session management is handled in `services/auth.ts`.

The app stores:

- an encrypted `session` cookie containing user/session data
- a `refresh_token` cookie for refresh flows

Important behaviors:

- Session cookies are signed and verified with `jose`.
- Sessions expire after a configured short lifetime and are refreshed/slid forward during protected navigation.
- Users without a valid session are redirected to `/sign-in`.
- Admin users are redirected to `/admin/dashboard`.
- Non-admin users are redirected to `/dashboard`.
- Users with `must_change_password` are redirected to `/create-new-password`.
- Non-admin users cannot access `/admin/*` routes.

Route protection is wired through `proxy.ts`, which calls `updateSession`.

## State Management

Server state is managed with TanStack React Query in `contexts/query-provider.tsx`.

Default query behavior:

- `staleTime`: 60 seconds
- `refetchInterval`: 10 minutes

Local UI state is handled with React state and feature-specific context providers, such as sidebar state and table/domain providers.

## Forms and Validation

Forms are built with React Hook Form and validated with Zod schemas.

Schema files are colocated with their feature areas, for example:

- `app/_components/auth/sign-in/schemas.ts`
- `app/_components/auth/reset-password/schemas.ts`
- `app/_components/doctor/invoices/schemas.ts`
- `app/_components/admin/users/schemas.ts`
- `app/_components/admin/settings/schemas.ts`
- `app/_components/doctor/settings/schemas.ts`

## Development Notes

- Use the `@/` alias for imports from the project root.
- Keep domain-specific components inside their admin, doctor, auth, or shared folders.
- Add reusable UI primitives to `app/_components/ui`.
- Keep backend endpoint wrappers in `services/apis`.
- Keep server actions that interact with cookies/session data in `services/actions`.
- Keep shared response, payload, and model types in `types`.
- Run `npm run lint` before opening a pull request.

