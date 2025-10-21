# Docker Setup Guide

Complete guide for running the E-Commerce Design Platform with Docker.

## 🐳 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- Git (for cloning the repository)

### 1. Setup Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
nano .env  # or use your preferred editor
```

**Required Variables:**
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `GOOGLE_AI_API_KEY` - Get from Google AI Studio
- `STRIPE_SECRET_KEY` - Get from Stripe Dashboard (for payments)

### 2. Start the Application

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f postgres
```

### 3. Initialize Database

```bash
# Run Prisma migrations
docker-compose exec app npx prisma migrate deploy

# (Optional) Seed database with sample data
docker-compose exec app npx prisma db seed
```

### 4. Access the Application

- **App**: http://localhost:3000
- **Database UI (Adminer)**: http://localhost:8080
  - System: `PostgreSQL`
  - Server: `postgres`
  - Username: `ecomdesign` (or your POSTGRES_USER)
  - Password: `ecomdesign_password` (or your POSTGRES_PASSWORD)
  - Database: `ecomdesign` (or your POSTGRES_DB)

## 📦 Docker Services

### Application (app)
- **Container**: `ecomdesign-app`
- **Port**: 3000
- **Image**: Custom Next.js build
- **Health Check**: `/api/health` endpoint

### Database (postgres)
- **Container**: `ecomdesign-db`
- **Port**: 5432
- **Image**: PostgreSQL 16 Alpine
- **Volume**: `postgres_data` (persistent storage)

### Database UI (adminer)
- **Container**: `ecomdesign-adminer`
- **Port**: 8080
- **Image**: Adminer latest

## 🛠️ Common Commands

### Starting & Stopping

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v

# Restart specific service
docker-compose restart app
```

### Rebuilding

```bash
# Rebuild app after code changes
docker-compose build app

# Rebuild and restart
docker-compose up -d --build app

# Force complete rebuild (no cache)
docker-compose build --no-cache app
```

### Database Operations

```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U ecomdesign -d ecomdesign

# Backup database
docker-compose exec postgres pg_dump -U ecomdesign ecomdesign > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T postgres psql -U ecomdesign -d ecomdesign

# Run Prisma Studio (Database UI)
docker-compose exec app npx prisma studio
```

### Logs & Debugging

```bash
# View all logs
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100 app

# Check service status
docker-compose ps

# Execute commands in app container
docker-compose exec app sh
docker-compose exec app npm run build
docker-compose exec app npx prisma migrate dev
```

### Cleanup

```bash
# Remove stopped containers
docker-compose down

# Remove volumes (⚠️ deletes data)
docker-compose down -v

# Remove images
docker rmi ecomdesign-app

# Full cleanup (containers, networks, volumes)
docker-compose down -v --remove-orphans
docker system prune -a
```

## 🔧 Development Workflow

### Local Development with Hot Reload

For development, you may prefer running Next.js locally while using Docker only for PostgreSQL:

```bash
# Start only the database
docker-compose up -d postgres adminer

# Run Next.js locally
npm run dev
```

### Running Tests

```bash
# Unit tests
docker-compose exec app npm run test

# E2E tests
docker-compose exec app npm run test:e2e

# Test coverage
docker-compose exec app npm run test:coverage
```

## 🚀 Production Deployment

### Building Production Image

```bash
# Build production image
docker build -t ecomdesign:latest .

# Tag for registry
docker tag ecomdesign:latest your-registry/ecomdesign:latest

# Push to registry
docker push your-registry/ecomdesign:latest
```

### Environment Configuration

Production `.env` should include:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/ecomdesign
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret

# Use production API keys
STRIPE_SECRET_KEY=sk_live_...
GOOGLE_AI_API_KEY=production-key
```

### Deployment Platforms

#### DigitalOcean App Platform

```bash
# Build and deploy
doctl apps create --spec .do/app.yaml

# Update existing app
doctl apps update $APP_ID --spec .do/app.yaml
```

#### Docker Swarm / Kubernetes

See deployment documentation for orchestration-specific configurations.

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Only commit `.env.example`
2. **Use strong secrets** - Generate with `openssl rand -base64 32`
3. **Rotate credentials** regularly in production
4. **Use non-root user** - Dockerfile already configured
5. **Scan images** - `docker scan ecomdesign:latest`
6. **Update base images** regularly

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "3001:3000"
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres

# Verify DATABASE_URL in .env matches docker-compose.yml
```

### Build Failures

```bash
# Clear build cache
docker-compose build --no-cache

# Remove node_modules and rebuild
docker-compose down
rm -rf node_modules
docker-compose up -d --build
```

### Permission Issues

```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Reset Docker permissions
docker-compose down
docker system prune -a
docker-compose up -d --build
```

## 📊 Monitoring

### Health Checks

```bash
# Check app health
curl http://localhost:3000/api/health

# Check database health
docker-compose exec postgres pg_isready -U ecomdesign
```

### Resource Usage

```bash
# View resource usage
docker stats

# View specific container
docker stats ecomdesign-app
```

## 🔄 Updates & Maintenance

### Updating Dependencies

```bash
# Update npm packages
docker-compose exec app npm update

# Update Prisma
docker-compose exec app npm install @prisma/client@latest prisma@latest
docker-compose exec app npx prisma generate
```

### Database Migrations

```bash
# Create new migration
docker-compose exec app npx prisma migrate dev --name migration_name

# Apply migrations
docker-compose exec app npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
docker-compose exec app npx prisma migrate reset
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [Prisma with Docker](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker)

## 🆘 Getting Help

If you encounter issues:

1. Check logs: `docker-compose logs -f`
2. Verify environment variables in `.env`
3. Ensure Docker Desktop is running
4. Try rebuilding: `docker-compose up -d --build`
5. Check GitHub Issues or create a new one
