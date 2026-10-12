## Admin Panel + Postgres (VPS)

### 1) Environment variables

Copy `.env.example` to `.env` and fill values.

- `DATABASE_URL`: your Postgres connection string
- `NEXT_PUBLIC_SITE_URL`: `https://boxorapackaging.com`
- `ADMIN_SESSION_SECRET`: long random secret
- Optional (for seeding first admin):
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`

### 2) Local Postgres (optional)

If you want a local DB for development:

```bash
docker compose up -d
```

Defaults match `prisma.config.ts` fallback:

```text
postgresql://postgres:postgres@localhost:5432/boxora?schema=public
```

### 3) Prisma workflow

Generate client:

```bash
npm run prisma:generate
```

Create schema in DB (uses `DATABASE_URL`):

```bash
npx prisma migrate deploy
```

Seed:

```bash
npm run db:seed
```

