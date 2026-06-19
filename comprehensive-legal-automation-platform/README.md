# LegalEdge AI — Advocate's Intelligent Legal Assistant Platform

An enterprise-grade legal technology platform built with React, TypeScript, Vite, and Tailwind CSS (frontend) and Node.js/Express with PostgreSQL (backend).

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LegalEdge AI Platform                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────┐     ┌─────────────────────────────────────────┐   │
│  │   Frontend (React)   │     │            Backend (Node.js)            │   │
│  │                      │     │                                          │   │
│  │  • Dashboard         │────▶│  • Authentication (JWT + HttpOnly)      │   │
│  │  • Draft Formatter   │     │  • Draft Generation Engine              │   │
│  │  • Case Laws DB      │◀────│  • Legal Database API                   │   │
│  │  • Section Analyzer  │     │  • Situation Analyzer                   │   │
│  │  • Legal Notice      │     │  • Jurisdiction Mapper                  │   │
│  │  • RTI Drafter       │     │  • Department Directory                 │   │
│  │  • Draft Templates   │     │  • Case Management                      │   │
│  │  • Situation Mapper  │     │  • Filing Tracker                       │   │
│  │  • Jurisdiction Map  │     │  • Audit Logging                        │   │
│  │  • Govt. Departments │     │                                          │   │
│  │  • Filing Tracker    │     │        ┌────────────────────┐            │   │
│  │                      │     │        │   PostgreSQL DB    │            │   │
│  └─────────────────────┘     │        │                    │            │   │
│                               │        │  • Users/Sessions  │            │   │
│  Security Features:           │        │  • Legal Sections  │            │   │
│  • XSS Prevention            │        │  • Case Laws       │            │   │
│  • Input Sanitization        │        │  • Situations      │            │   │
│  • CSRF Protection           │        │  • Jurisdictions   │            │   │
│                               │        │  • Departments     │            │   │
│                               │        │  • Cases/Filings   │            │   │
│                               │        │  • Drafts          │            │   │
│                               │        │  • Audit Logs      │            │   │
│                               │        └────────────────────┘            │   │
│                               └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🔐 Security Features

### Frontend Security
- **XSS Prevention**: DOMPurify-style sanitization for all user inputs
- **Input Validation**: Client-side validation with strict patterns
- **CSRF Protection**: Token-based CSRF protection
- **Secure Storage**: No sensitive data in localStorage/sessionStorage
- **Rate Limiting**: Client-side rate limiting for form submissions

### Backend Security
- **JWT Authentication**: HttpOnly, Secure, SameSite=Strict cookies
- **Password Security**: Argon2id hashing with salt
- **Encryption at Rest**: AES-256-GCM for sensitive data
- **Rate Limiting**: 60 req/min general, 5 req/min for auth
- **RBAC**: Role-based access control (Advocate, Senior Advocate, Paralegal, Admin)
- **Audit Logging**: Complete activity tracking
- **Input Validation**: Zod schemas for all API inputs
- **Security Headers**: Helmet.js with strict CSP

## 📋 Modules

### 1. Private Dashboard
- User-specific legal notifications
- Quick action cards
- Active case metrics
- Filing countdown timers

### 2. One-Click Draft Formatter
- Auto-capitalization
- Paragraph numbering
- Legal header formatting
- Court-style formatting
- Double spacing option

### 3. Case Laws & Legal Sections Database
- IPC, CrPC, CPC, Constitution, RTI Act
- Full-text search
- Section ingredients breakdown
- Landmark case laws with citations

### 4. Section Ingredients Analyzer
- Interactive verification checklist
- Progress tracking
- Prima facie case confirmation
- Related sections display

### 5. Legal Notice Drafter
- Form-based generation
- Number-to-words conversion
- Professional formatting
- Save to database

### 6. RTI Application Drafter
- Standard applications
- First Appeals (Section 19)
- Complaints (Section 18)
- Fee and timeline information

### 7. Core Draft Templates
- Legal Notice
- RTI Applications
- Bail Applications
- Writ Petitions
- Criminal Complaints
- Consumer Complaints
- Divorce Petitions
- Police Complaints
- Civil Suits

### 8. Real-Time Situation Analyzer
- Pre-defined scenarios (8 types)
- Substantive sections mapping
- Procedural sections mapping
- Competent authorities
- Filing timelines
- Recommended drafts

### 9. Jurisdiction Mapper
- Police Stations
- Courts
- Tribunals
- Geographic filtering
- Contact information

### 10. Government Departments Directory
- Officer hierarchy
- Powers and functions
- RTI matrix
- Contact details

### 11. Future Applications Tracker
- Deadline tracking
- Priority levels
- Status management
- Countdown timers

### 12. Case Management
- Case CRUD operations
- Hearing history
- Opposition tracking
- Timeline synchronization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your database credentials and secrets

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
# From project root
npm install
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/legaledge_db"
JWT_SECRET="your-256-bit-secret-minimum-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-minimum-32-chars"
ENCRYPTION_KEY="your-32-byte-encryption-key-here"
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## 📡 API Endpoints

### Authentication
```
POST /api/v1/auth/login     - Login with email/password
POST /api/v1/auth/register  - Register new advocate
POST /api/v1/auth/logout    - Logout and revoke session
POST /api/v1/auth/refresh   - Refresh access token
GET  /api/v1/auth/me        - Get current user
```

### Drafts
```
POST /api/v1/drafts/format          - Format raw legal text
POST /api/v1/drafts/generate-notice - Generate legal notice
POST /api/v1/drafts/generate-rti    - Generate RTI application
POST /api/v1/drafts/generate-bail   - Generate bail application
GET  /api/v1/drafts                 - List user's drafts
GET  /api/v1/drafts/:id             - Get single draft
```

### Legal Database
```
GET /api/v1/legal/search                    - Search sections
GET /api/v1/legal/sections/:id              - Get section details
GET /api/v1/legal/analyzer/ingredients/:id  - Get section ingredients
GET /api/v1/legal/acts                      - List act types
GET /api/v1/legal/categories                - List categories
```

### Situations
```
GET /api/v1/situations               - List all situations
GET /api/v1/situations/analyze/:id   - Analyze specific situation
GET /api/v1/situations/search        - Search situations
```

### Jurisdiction
```
GET /api/v1/jurisdiction/search         - Search jurisdictions
GET /api/v1/jurisdiction/:id            - Get jurisdiction details
GET /api/v1/jurisdiction/meta/states    - List states
GET /api/v1/jurisdiction/meta/districts - List districts
```

### Departments
```
GET /api/v1/departments                  - List departments
GET /api/v1/departments/:id              - Get department details
GET /api/v1/departments/:id/hierarchy    - Get officer hierarchy
```

### Case Management
```
GET  /api/v1/cases/dashboard/summary  - Dashboard aggregation
GET  /api/v1/cases                    - List user's cases
POST /api/v1/cases                    - Create new case
GET  /api/v1/cases/:id                - Get case details
PUT  /api/v1/cases/:id                - Update case
```

### Filing Tracker
```
GET    /api/v1/cases/filings/all      - List all filings
POST   /api/v1/cases/filings          - Create filing
PUT    /api/v1/cases/filings/:id      - Update filing
DELETE /api/v1/cases/filings/:id      - Delete filing
```

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts with encrypted data
- `sessions` - JWT refresh token sessions
- `legal_sections` - IPC, CrPC, CPC, etc.
- `case_laws` - Landmark judgments
- `situations` - Pre-defined legal scenarios
- `jurisdictions` - Courts, police stations, tribunals
- `departments` - Government departments
- `officers` - Department officer hierarchy
- `cases` - User's legal cases
- `hearings` - Case hearing history
- `drafts` - Generated legal documents
- `filing_trackers` - Deadline tracking
- `audit_logs` - Security audit trail

## 📜 Legal Data Included

### Acts Covered
- Indian Penal Code (IPC)
- Code of Criminal Procedure (CrPC)
- Code of Civil Procedure (CPC)
- Constitution of India
- Right to Information Act
- Domestic Violence Act
- Consumer Protection Act
- Information Technology Act
- Motor Vehicles Act

### Landmark Cases
- Bachan Singh v. State of Punjab (Death penalty)
- Lalita Kumari v. Govt of UP (Mandatory FIR)
- Maneka Gandhi v. Union of India (Article 21)
- K.S. Puttaswamy v. Union of India (Privacy)
- Arnesh Kumar v. State of Bihar (498A safeguards)
- And many more...

## 🛡️ Compliance

- Designed for Indian legal practice
- Follows Bar Council guidelines
- GDPR-style data protection
- Audit trail for accountability
- Encrypted sensitive data

## 📝 License

This software is proprietary. All rights reserved.

---

**LegalEdge AI** — Empowering Advocates with Intelligent Legal Technology

© 2024-2026 LegalEdge AI. Built for the Indian Legal Fraternity.
