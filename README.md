# Fxeno - Prisma with Neon Dual URL Setup

This project demonstrates the proper setup for using Prisma with Neon database using dual URLs for optimal performance and reliability.

## Database Configuration

This setup uses two separate URLs for different purposes:

- **DATABASE_URL**: Points to Neon pooler (PgBouncer) for application runtime
- **DIRECT_URL**: Points to direct (non-pooler) endpoint for migrations

## Setup Instructions

1. **Copy environment variables**:
   ```bash
   cp .env.example .env
   ```

2. **Update your .env file** with your actual Neon credentials:
   - Replace `YOUR_PASSWORD` with your rotated Neon password
   - Replace `ep-xxxxx` with your actual Neon endpoint

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

5. **Run migrations**:
   ```bash
   npm run db:migrate
   ```

## Why This Setup?

- **PgBouncer (transaction mode)** breaks long transactions used by migrations
- **directUrl** ensures `prisma migrate` goes straight to the primary database
- **Runtime queries** still flow through the pooler for scalability
- **SSL mode** is set to `require` for security

## Available Scripts

- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes without migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database and run all migrations

## Environment Variables

### DATABASE_URL (Pooler)
```
postgresql://neon_user:PASSWORD@ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=10&pool_timeout=15
```

### DIRECT_URL (Direct Connection)
```
postgresql://neon_user:PASSWORD@ep-xxxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=10
```

### Optional Optimization
```
PRISMA_CLIENT_ENGINE_TYPE=library
```

This speeds up Prisma on serverless environments.
