# College Discovery Platform - Deployment Guide

## Quick Start

This Next.js application is ready to deploy on Vercel.

### Prerequisites

- GitHub account with the project repository
- Vercel account (free tier works)
- Optional: PostgreSQL database for persistent data

## Option 1: Deploy with Fallback Data (No Database)

The app includes fallback data for 16 top Indian BTech colleges. This works out of the box:

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy (no environment variables needed)

The site will work immediately with search, filters, EAMCET rank filters, and category filtering.

## Option 2: Deploy with PostgreSQL Database

For persistent user data and college management:

### Step 1: Create PostgreSQL Database

Choose one of:
- **Vercel Postgres** (recommended for Vercel deployments)
  - Free tier available in some regions
  - Managed by Vercel team
  
- **Supabase** (free tier, full PostgreSQL)
  - https://supabase.com
  - 500 MB storage free
  
- **AWS RDS** or other managed PostgreSQL services

### Step 2: Get Connection String

Copy your PostgreSQL connection string in this format:
```
postgresql://user:password@host:port/database
```

### Step 3: Configure Environment Variables

In Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add `DATABASE_URL` with your PostgreSQL connection string
3. Add `NEXT_DISABLE_SWC_BINARY=1` for Windows compatibility
4. Redeploy

### Step 4: Initialize Database (First Time)

Option A - Using Vercel CLI:
```bash
npm install -g vercel
vercel env pull  # Pulls environment variables
npx prisma migrate deploy
npx ts-node --transpile-only prisma/seed.ts
```

Option B - Using Prisma migrations:
```bash
npx prisma db push
npx ts-node --transpile-only prisma/seed.ts
```

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Repository connected to Vercel
- [ ] Build passes locally: `npm run build`
- [ ] Environment variables set (if using database)
- [ ] Database initialized (if using database)
- [ ] Test homepage loads at your-domain.vercel.app

## Features

- **Search & Filter**: Find colleges by name, location, course
- **EAMCET Rank Eligibility**: Filter by EAMCET entrance exam ranks
- **BTech Categories**: Filter by IIT, NIT, IIIT, or Private colleges
- **Compare**: Select up to 3 colleges to compare side-by-side
- **Save Favorites**: Bookmark colleges for later review
- **Responsive Design**: Mobile, tablet, and desktop friendly
- **Fallback Data**: Works without a database

## Colleges Included

Default dataset includes 16 top Indian BTech colleges:
- IIT Madras, IIT Bombay, IIT Delhi, IIT Kanpur, IIT Kharagpur, IIT Roorkee
- BITS Pilani, IIIT Hyderabad, IIIT Delhi
- NIT Trichy, NIT Surathkal
- VIT Vellore, SRM University, Amrita Vishwa Vidyapeetham
- Manipal Institute of Technology, JNTU Hyderabad

Each college includes:
- Fees information
- Rating/quality score
- Course offerings (CS, EC, Mechanical, etc.)
- EAMCET rank cutoffs for eligibility matching
- Location details

## Environment Variables

### Required (for database functionality)
- `DATABASE_URL` - PostgreSQL connection string (optional, fallback data is used if not set)

### Optional
- `NEXT_DISABLE_SWC_BINARY=1` - Required for Windows builds (automatically set by vercel.json)

## Troubleshooting

### Build fails with "MODULE_NOT_FOUND"
Ensure `postinstall` script runs: Vercel should automatically run `npm install` which triggers `prisma generate`.

### Database connection fails
- Check DATABASE_URL is correct
- Verify database accepts connections from Vercel IP ranges
- For Supabase: Check project settings for IP allowlisting

### "cannot find module '@prisma/client'"
This is handled by the postinstall script. If still failing:
```bash
npx prisma generate
npm run build
```

## Performance Optimizations

The app uses:
- Next.js 14 App Router for optimal performance
- TailwindCSS for minimal CSS payload
- Fallback data for instant load (no DB latency)
- Client-side filtering for fast search
- Static homepage generation when possible

## Support

For Vercel deployments: https://vercel.com/docs
For Next.js issues: https://nextjs.org/docs
For database help: 
- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
- Supabase: https://supabase.com/docs
