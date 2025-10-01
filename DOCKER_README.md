# Acquisitions API - Docker Setup Guide

This guide explains how to run the Acquisitions API using Docker with different configurations for development and production environments.

## Overview

- **Development**: Uses **Neon Local** proxy for ephemeral database branches
- **Production**: Connects directly to **Neon Cloud** database

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- Neon account with API access

## Environment Configuration

### Development Environment

1. **Copy the development environment file:**
   ```bash
   cp .env.example .env.development
   ```

2. **Configure `.env.development`:**
   ```env
   # Development Environment Configuration
   PORT=3000
   NODE_ENV=development
   LOG_LEVEL=debug

   # Neon Local Database Configuration (Docker Compose)
   DATABASE_URL=postgres://neon:npg@neon-local:5432/acquisitions?sslmode=require

   # JWT Configuration
   JWT_SECRET=your-dev-jwt-secret-key-change-in-production

   # Neon Configuration for Development
   NEON_API_KEY=your_neon_api_key_here
   NEON_PROJECT_ID=your_neon_project_id_here
   PARENT_BRANCH_ID=your_parent_branch_id_here
   ```

3. **Get your Neon credentials:**
   - **API Key**: Go to [Neon Console](https://console.neon.tech) → Account Settings → API Keys
   - **Project ID**: Found in Project Settings → General
   - **Parent Branch ID**: Usually your main/production branch ID

### Production Environment

1. **Create production environment file:**
   ```bash
   cp .env.example .env.production
   ```

2. **Configure `.env.production`:**
   ```env
   # Production Environment Configuration
   PORT=3000
   NODE_ENV=production
   LOG_LEVEL=info

   # Neon Cloud Database Configuration
   DATABASE_URL=postgres://username:password@ep-example.us-east-1.aws.neon.tech/dbname?sslmode=require

   # JWT Configuration - Should be injected as environment variable
   JWT_SECRET=${JWT_SECRET}
   ```

## Development Setup

### Using Docker Compose (Recommended)

1. **Start the development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml --env-file .env.development up --build
   ```

2. **The setup includes:**
   - **Neon Local proxy** running on port 5432
   - **Application** running on port 3000
   - **Ephemeral database branch** automatically created
   - **Hot reload** enabled for development

3. **Access the application:**
   - API: http://localhost:3000
   - Health check: http://localhost:3000/health

4. **Stop the environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

### Alternative Docker Commands

```bash
# Build development image
docker build --target development -t acquisitions:dev .

# Run Neon Local separately
docker run --name neon-local -p 5432:5432 \
  -e NEON_API_KEY=your_api_key \
  -e NEON_PROJECT_ID=your_project_id \
  -e PARENT_BRANCH_ID=your_branch_id \
  neondatabase/neon_local:latest

# Run application
docker run --name acquisitions-dev -p 3000:3000 \
  --link neon-local \
  -e DATABASE_URL=postgres://neon:npg@neon-local:5432/acquisitions?sslmode=require \
  acquisitions:dev
```

## Production Setup

### Using Docker Compose

1. **Set environment variables:**
   ```bash
   export DATABASE_URL="postgres://username:password@ep-example.us-east-1.aws.neon.tech/dbname?sslmode=require"
   export JWT_SECRET="your-super-secure-jwt-secret"
   ```

2. **Start production environment:**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

3. **Check logs:**
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f
   ```

4. **Stop production environment:**
   ```bash
   docker-compose -f docker-compose.prod.yml down
   ```

### Alternative Production Deployment

```bash
# Build production image
docker build --target production -t acquisitions:prod .

# Run production container
docker run -d --name acquisitions-prod -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="your_neon_cloud_url" \
  -e JWT_SECRET="your_jwt_secret" \
  acquisitions:prod
```

## Key Differences: Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| Database | Neon Local (Ephemeral branches) | Neon Cloud (Persistent) |
| SSL Config | Self-signed certificates | Full SSL/TLS |
| Connection | `postgres://neon:npg@neon-local:5432/...` | `postgres://...@*.neon.tech/...` |
| Hot Reload | ✅ Enabled | ❌ Disabled |
| User | root | non-root (nodejs) |
| Health Checks | Basic | Comprehensive |

## Database Migration

Run migrations in both environments:

```bash
# Development
docker exec -it acquisitions-app-dev npm run db:migrate

# Production
docker exec -it acquisitions-app-prod npm run db:migrate
```

## Troubleshooting

### Common Issues

1. **Neon Local connection fails:**
   ```bash
   # Check if Neon Local is running
   docker logs acquisitions-neon-local
   
   # Verify environment variables
   docker exec -it acquisitions-neon-local env | grep NEON
   ```

2. **SSL certificate issues:**
   - Development: Self-signed certificates are expected
   - Production: Ensure your DATABASE_URL includes `?sslmode=require`

3. **Permission issues:**
   ```bash
   # Fix logs directory permissions
   chmod 755 ./logs
   ```

4. **Branch creation fails:**
   - Verify your NEON_API_KEY has proper permissions
   - Check PARENT_BRANCH_ID exists in your project

### Useful Commands

```bash
# View running containers
docker ps

# Check application logs
docker logs acquisitions-app-dev -f

# Enter container shell
docker exec -it acquisitions-app-dev sh

# Clean up Docker resources
docker system prune -f
docker volume prune -f

# Reset everything
docker-compose -f docker-compose.dev.yml down -v
docker system prune -af
```

## Environment Variables Reference

### Required for Development
- `NEON_API_KEY` - Your Neon API key
- `NEON_PROJECT_ID` - Your Neon project ID
- `PARENT_BRANCH_ID` - Branch to create ephemeral branches from

### Required for Production
- `DATABASE_URL` - Full Neon Cloud connection string
- `JWT_SECRET` - Secure JWT signing key

### Optional
- `PORT` - Application port (default: 3000)
- `LOG_LEVEL` - Logging level (debug, info, warn, error)
- `DELETE_BRANCH` - Keep ephemeral branches after container stops (default: true)

## Security Notes

- Never commit `.env.development` or `.env.production` files
- Use strong, unique JWT secrets in production
- Neon Local creates ephemeral branches that are automatically deleted
- Production containers run as non-root user for security

## Next Steps

1. Set up CI/CD pipeline with these Docker configurations
2. Configure monitoring and logging aggregation
3. Set up reverse proxy (nginx) for production
4. Implement container orchestration (Kubernetes/Docker Swarm)

---

For more information about Neon Local, visit: https://neon.com/docs/local/neon-local
