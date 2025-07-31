# Sonix Admin

This project requires a Supabase backend. Copy `.env.example` to `.env` and fill in your Supabase credentials:

```
cp .env.example .env
```

Then edit `.env` and set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`.

Run the development server with:

```
npm run dev
```

Vitest tests can be executed with:

```
npx vitest run
```
