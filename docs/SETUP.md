# Truadboon App - Setup Instructions

## Prerequisites
- Node.js 18+ and pnpm installed
- Supabase account and project

## Quick Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables

1. Copy the `.env` file and update with your Supabase credentials:
   - Get your Supabase credentials from: https://app.supabase.com/project/_/settings/api
   - Update `DATABASE_URL` with your Supabase PostgreSQL connection string
   - Update `NEXT_PUBLIC_SUPABASE_URL` with your project URL
   - Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your anonymous key

Example `.env` configuration:
```env
DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@db.YOUR-PROJECT-REF.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

### 3. Setup Database

Run Prisma migrations to create database tables:
```bash
pnpx prisma db push
```

Or for production:
```bash
pnpx prisma migrate dev --name init
```

### 4. Start Development Server

```bash
pnpm dev
```

The app will be available at http://localhost:3000

### 5. Build for Production

```bash
pnpm build
pnpm start
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Database Management

- `pnpx prisma studio` - Open Prisma Studio to manage database
- `pnpx prisma db push` - Push schema changes to database (development)
- `pnpx prisma migrate dev` - Create and apply migrations (production-ready)
- `pnpx prisma generate` - Regenerate Prisma Client

## Supabase Setup

1. Create a new project at https://supabase.com
2. Go to Project Settings → Database
3. Copy the connection string (Transaction mode or Session mode)
4. Replace the password placeholder with your database password
5. Update your `.env` file with the connection string

## Additional Configuration

### LINE Bot Integration (Optional)
If you're using LINE bot features:
1. Get your LINE credentials from https://developers.line.biz/console/
2. Add `LINE_CHANNEL_ACCESS_TOKEN` and `LINE_CHANNEL_SECRET` to `.env`

## Troubleshooting

### Database Connection Issues
- Ensure your Supabase project is active
- Check that the connection string format is correct
- Verify your database password

### Prisma Issues
- Run `pnpx prisma generate` to regenerate the client
- Run `pnpx prisma db push` to sync your schema

## Tech Stack

- **Framework**: Next.js 16
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 7
- **UI**: React 19, Radix UI, Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Deployment**: Vercel-ready
