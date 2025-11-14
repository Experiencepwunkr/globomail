# Copilot Instructions for Globomail

## Project Overview
**Globomail** is a Next.js 16 dashboard for Nigerian digital identity and verification services. It enables agents to register, access various verification services (NIN, BVN, CAC, TIN, etc.), manage wallets, and handle withdrawals.

**Tech Stack:**
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, TailwindCSS PostCSS v4
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Auth:** Planned; currently stub implementation
- **Payment:** Paystack integration planned for wallet/withdrawals

---

## Architecture Decisions

### 1. Directory Structure
```
src/
  app/
    page.tsx              # Home (dashboard index with isLoggedIn stub)
    layout.tsx            # Root layout with ThemeProvider
    globals.css           # Tailwind directives
    api/agents/create/route.ts    # Agent registration API endpoint
    login/page.tsx        # Login form (TODO: implement auth)
    register/page.tsx     # Agent registration form (working)
    services/
      page.tsx            # Services index
      *.tsx              # Individual service pages (most empty)
  components/
    DashboardLayout.tsx   # Sidebar + layout wrapper for authenticated views
    ServiceTile.tsx       # Reusable service card component
    ThemeProvider.tsx     # Dark/light mode toggle persistence
    ThemeToggle.tsx       # Theme switcher button
prisma/
  schema.prisma          # PostgreSQL Agent model definition
```

### 2. Why This Structure?
- **Single `DashboardLayout` component:** Wraps all authenticated pages; contains sidebar navigation for all 16 services + history/wallet
- **Service pages as separate files:** Scalable pattern for future implementation; easily add routing without modifying layout
- **API routes in `api/agents/`:** Follows Next.js conventions; agent CRUD operations isolated
- **Prisma schema:** PostgreSQL migrations track schema versioning (`migrations/20251114171138_init_postgres/`)

### 3. Data Flow
```
Register Form → POST /api/agents/create → Hash password (bcryptjs) → Prisma Agent.create() → Return agent ID
Dashboard Load → Check isLoggedIn (stub) → Redirect to /login if false → Show ServiceTile grid + sidebar nav
```

---

## Critical Workflows

### Running the Development Server
```powershell
npm run dev
# Opens http://localhost:3000
```

### Building for Production
```powershell
npm run build
npm start
```

### Database Setup
```powershell
# Sync schema with PostgreSQL (must have DATABASE_URL in .env.local)
npx prisma migrate deploy

# Generate Prisma client after schema changes
npx prisma generate

# View database in Prisma Studio
npx prisma studio
```

### Linting
```powershell
npm run lint
```

---

## Project-Specific Patterns & Conventions

### 1. Client vs. Server Components
- **All forms & interactive pages:** Marked `'use client'` (e.g., `register/page.tsx`, `DashboardLayout.tsx`)
- **Static/layout components:** No directive (defaults to Server Component)
- **Reason:** Theme persistence, form state, and router navigation require client-side React

### 2. Styling Conventions
- **Tailwind CSS 4:** Use utility classes directly in JSX (no CSS files except `globals.css`)
- **Dark mode:** `dark:` prefix for dark theme variants (e.g., `text-gray-900 dark:text-white`)
- **Colors:** Predefined palette in `ServiceTile.tsx` maps service icons (N, P, C, B, I, V, R, U, M, A, T, S, W) to colors
- **Example:** `className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"`

### 3. Component Patterns
- **ServiceTile:** Exported as `forwardRef` (allows parent to pass ref); displays icon, title, description in card
- **DashboardLayout:** Accepts `children` prop; hardcoded sidebar links (consider parameterizing if adding dynamic nav)
- **Both use composition:** No props drilling; components are self-contained

### 4. API Endpoint Pattern
**File:** `src/app/api/agents/create/route.ts`
```typescript
export async function POST(request: Request) {
  const { name, email, phone, password } = await request.json();
  
  // ✅ Validation → Error Response (with status codes)
  // ✅ Duplicate check → 409 Conflict
  // ✅ Password hashing → bcryptjs.hash(password, 12)
  // ✅ Prisma operation → .create() returns agent object
  // ✅ Response → NextResponse.json({ success: true, agent: {...} })
}
```
- **Always validate** input before DB operations
- **Use Prisma client** (singleton at module level: `const prisma = new PrismaClient()`)
- **Return minimal safe data** (exclude password hashes)
- **Include helpful error messages** (e.g., "An agent with this email already exists")

### 5. Authentication Status (Current Stub)
**File:** `src/app/page.tsx`
```typescript
const isLoggedIn = false; // ← Hardcoded stub — TODO: replace with real auth
if (!isLoggedIn) {
  router.push('/login');
}
```
- **TODO:** Implement session/JWT verification (e.g., `useSession()` from next-auth, or custom middleware)
- **Impact:** All protected pages redirect to `/login` unless `isLoggedIn = true`

### 6. Imports Path Alias
```typescript
import { DashboardLayout } from '@/components/DashboardLayout';
```
- **`@/`** maps to `./src/` (configured in `tsconfig.json`)
- Use consistently for clean, non-relative imports

---

## Integration Points & External Dependencies

### Paystack (Planned, Not Yet Active)
- **Purpose:** Dedicated virtual accounts for agent wallet funding; withdrawal processing
- **Status:** Code commented out in `/api/agents/create/route.ts` (lines 54–79)
- **TODO:** Uncomment & add `PAYSTACK_SECRET_KEY` to `.env.local` when ready
- **Flow:** Agent registers → Paystack creates account → Bank name, account #, customer code stored in DB

### bcryptjs (Password Hashing)
- **Used in:** `/api/agents/create/route.ts`
- **Pattern:** `const hashedPassword = await hash(password, 12);` (cost factor 12)
- **Never log or return** password hashes to client

### Prisma Client
- **Singleton instance:** `const prisma = new PrismaClient();` at module level
- **Models:** Only `Agent` defined; schema at `prisma/schema.prisma`
- **Migrations:** Versioned in `prisma/migrations/`; always run `npx prisma migrate deploy` after pulling schema changes

---

## Service Pages Architecture

### Current State
- 14 service pages defined in `src/app/services/` (all currently empty `.tsx` files)
- Examples: `nin.tsx`, `bvn-verify.tsx`, `cac.tsx`, `ipe-clearance.tsx`, `validation.tsx`, etc.

### Implementation Pattern (For New Service Pages)
```typescript
'use client';

import { DashboardLayout } from '@/components/DashboardLayout';

export default function ServicePage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Name</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Description</p>
        {/* Service form or content here */}
      </div>
    </DashboardLayout>
  );
}
```
- Wrap with `DashboardLayout` for consistent sidebar + header
- Mark `'use client'` if form/state needed
- Maintain dark mode class pattern: `dark:` variants

---

## Database Model Reference

### Agent Table (PostgreSQL)
```prisma
model Agent {
  id              String    @id @default(uuid())      # Primary key
  email           String    @unique                   # Unique email per agent
  name            String                              # Full name
  phone           String                              # Phone number
  password        String                              # bcrypt hash
  walletBalance   Float     @default(0.0)             # Account balance
  accountNumber   String?   # Paystack/bank account #
  bankName        String?   # Paystack bank name
  accountName     String?   # Display name for bank account
  paystackCode    String?   # Paystack customer code
  isApproved      Boolean   @default(false)           # Admin approval flag
  canWithdraw     Boolean   @default(false)           # Withdrawal permission
  createdAt       DateTime  @default(now())           # Registration timestamp
  updatedAt       DateTime  @updatedAt                # Last modified timestamp
}
```

---

## Common Tasks

### Add a New Service Page
1. Create `/src/app/services/[service-name].tsx`
2. Wrap with `'use client'` and `<DashboardLayout>`
3. Add link to `DashboardLayout.tsx` sidebar if needed (currently hardcoded)

### Add a New API Endpoint
1. Create `/src/app/api/[resource]/[action]/route.ts`
2. Export `POST`, `GET`, `PUT`, `DELETE` as needed
3. Use Prisma for DB operations; validate input; return `NextResponse.json()`

### Update Database Schema
1. Edit `/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name [migration_name]`
3. Commit migration files to `prisma/migrations/`

### Test Theme Toggle
- Dark mode state stored in `localStorage` as `theme` key
- Persisted via `ThemeProvider.tsx` on component mount
- Add new color variants in `ServiceTile.tsx` `colors` Record as needed

---

## Known TODOs & Future Work
- [ ] Replace `isLoggedIn` stub with real authentication (next-auth or JWT)
- [ ] Implement login form submission logic (currently UI only)
- [ ] Populate empty service pages with actual forms/logic
- [ ] Activate Paystack virtual account creation (uncomment code + add env vars)
- [ ] Add history & wallet pages (`/history`, `/wallet`)
- [ ] Implement logout functionality
- [ ] Add form validation libraries (e.g., zod, react-hook-form)
- [ ] Error boundary / global error handling
- [ ] Rate limiting on API endpoints

---

## Environment Variables
Create `.env.local` with:
```
DATABASE_URL="postgresql://user:password@localhost:5432/globomail"
# PAYSTACK_SECRET_KEY="sk_test_..." (uncomment when ready)
```

---

## Quick Debugging Tips
- **Prisma sync issues:** Run `npx prisma generate` after schema changes
- **Dark mode not toggling:** Check `localStorage` in DevTools; ensure `ThemeProvider` mounts
- **API 500 error:** Check server logs in terminal; validate request JSON payload
- **TypeScript errors:** Verify path aliases in `tsconfig.json` match imports
