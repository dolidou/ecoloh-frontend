# 🎫 ECOLOH Frontend - React + TypeScript

Plateforme billetterie et événementiel pour ECOLOH (Algérie).

## Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **React Router v6** (routing)
- **Zustand** (state management)
- **React Query** (data fetching/caching)
- **Tailwind CSS** (styling)
- **Material-UI** (components)
- **Axios** (HTTP client)
- **React Hook Form** (form validation)

## Setup Local

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure .env.local
```bash
cp .env.example .env.local
# Edit .env.local and set:
VITE_API_URL=http://localhost:8000/api
VITE_APP_ENV=development
```

### 3. Start Dev Server
```bash
npm run dev
# → http://localhost:5173
```

### 4. Build for Production
```bash
npm run build
npm run preview  # Test production build locally
```

## Project Structure

```
src/
├── components/        # Reusable React components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── stores/           # Zustand state management
├── services/         # API calls & business logic
├── types/            # TypeScript interfaces
├── utils/            # Helper functions
├── styles/           # CSS & Tailwind
├── App.tsx           # Root component
├── main.tsx          # Entry point
└── router.tsx        # React Router setup
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

Frontend communicates with Laravel backend via REST API at `http://localhost:8000/api`.

See `../ecoloh/ÉTAPE_4_CONCEPTION_FONCTIONNELLE.md` for API routes and integration details.

## Authentication

Uses JWT tokens stored in localStorage. Managed via `useAuth` hook and `authStore`.

## Environment Variables

See `.env.example` for all available environment variables.

---

**Pour plus de détails:** Voir documentation in `/ecoloh/`
