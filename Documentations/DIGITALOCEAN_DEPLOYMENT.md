# Digital Ocean Deployment Guide

Complete guide for deploying MaarifaHub to Digital Ocean with both frontend and backend.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Digital Ocean Setup](#digital-ocean-setup)
4. [Deployment Options](#deployment-options)
5. [Quick Deploy](#quick-deploy)
6. [Manual Deployment](#manual-deployment)
7. [Configuration](#configuration)
8. [Maintenance](#maintenance)

## Overview

This guide deploys MaarifaHub as a complete stack on Digital Ocean:
- **Frontend**: React + Vite app served via Nginx
- **Backend**: Node.js/Express API
- **Database**: MongoDB
- **Reverse Proxy**: Nginx handling both frontend and backend

## Prerequisites

### Required Accounts
- Digital Ocean account
- Domain name (optional but recommended)

### Local Requirements
- Git installed
- Docker and Docker Compose installed locally (for testing)
- SSH key pair generated

## Digital Ocean Setup

### Option 1: Droplet with Docker (Recommended)

1. **Create a Droplet**
   ```
   - Go to Digital Ocean Dashboard
   - Click "Create" → "Droplets"
   - Choose: Ubuntu 22.04 LTS
   - Plan: Basic ($12/month - 2GB RAM minimum recommended)
   - Datacenter: Choose closest to your users
   - Authentication: Add your SSH key
   - Hostname: maarifahub
   ```

2. **Initial Server Setup**
   ```bash
   # SSH into your droplet
   ssh root@your_droplet_ip
   
   # Update system
   apt update && apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   apt install docker-compose -y
   
   # Create app directory
   mkdir -p /opt/maarifahub
   cd /opt/maarifahub
   ```

### Option 2: App Platform (Managed Service)

Digital Ocean App Platform can host your application with zero server management:

1. **Connect Repository**
   - Go to App Platform in DO dashboard
   - Connect your GitHub/GitLab repository
   - Select the `maarifaHub` repository

2. **Configure Components**
   - **Web Service (Frontend)**: Detected from Dockerfile
   - **Web Service (Backend)**: Detected from server/Dockerfile
   - **Database**: Add MongoDB database component

3. **Environment Variables**
   - Set all required environment variables (see Configuration section)

## Deployment Options

### Quick Deploy Script (Recommended)

We provide automated deployment scripts for easy setup.

```bash
# On your local machine
./deploy-digitalocean.sh
```

### Docker Compose Deployment (Droplet)

For full control with Docker:

1. **Transfer Files to Server**
   ```bash
   # From your local machine
   scp docker-compose.digitalocean.yml root@your_droplet_ip:/opt/maarifahub/
   scp nginx.do.conf root@your_droplet_ip:/opt/maarifahub/
   scp .env.digitalocean root@your_droplet_ip:/opt/maarifahub/.env
   
   # Or clone from Git
   ssh root@your_droplet_ip
   cd /opt/maarifahub
   git clone https://github.com/yourusername/maarifaHub.git .
   ```

2. **Configure Environment**
   ```bash
   # Copy and edit environment file
   cp .env.digitalocean.example .env.digitalocean
   nano .env.digitalocean
   ```

3. **Deploy Application**
   ```bash
   docker-compose -f docker-compose.digitalocean.yml up -d
   ```

## Quick Deploy

### Using the Deployment Script

```bash
# 1. Make script executable
chmod +x deploy-digitalocean.sh

# 2. Run deployment
./deploy-digitalocean.sh

# Follow the prompts to enter:
# - Droplet IP address
# - Domain name (optional)
# - MongoDB credentials
# - JWT secret
```

The script will:
- Connect to your droplet
- Install required dependencies
- Transfer necessary files
- Configure environment variables
- Build and start containers
- Setup SSL with Let's Encrypt (if domain provided)

## Manual Deployment

### Step 1: Prepare Your Droplet

```bash
# SSH into droplet
ssh root@your_droplet_ip

# Create app directory
mkdir -p /opt/maarifahub
cd /opt/maarifahub

# Install required packages
apt update
apt install -y docker.io docker-compose git certbot python3-certbot-nginx
systemctl enable docker
systemctl start docker
```

### Step 2: Clone or Upload Code

**Option A: Git Clone**
```bash
git clone https://github.com/yourusername/maarifaHub.git .
```

**Option B: Upload via SCP**
```bash
# From your local machine
scp -r . root@your_droplet_ip:/opt/maarifahub/
```

### Step 3: Configure Environment

```bash
# Create environment file
cat > .env.digitalocean << 'EOF'
# Node Environment
NODE_ENV=production

# Server Configuration
PORT=5000
FRONTEND_PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb://admin:your_secure_password@mongodb:27017/maarifahub?authSource=admin
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your_secure_password
MONGO_INITDB_DATABASE=maarifahub

# JWT Configuration
JWT_SECRET=your_very_long_random_jwt_secret_here
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com

# API URL for Frontend
VITE_API_URL=https://yourdomain.com/api
EOF

# Edit with your actual values
nano .env.digitalocean
```

### Step 4: Deploy with Docker Compose

```bash
# Start all services
docker-compose -f docker-compose.digitalocean.yml up -d

# Check status
docker-compose -f docker-compose.digitalocean.yml ps

# View logs
docker-compose -f docker-compose.digitalocean.yml logs -f
```

### Step 5: Configure Domain (Optional but Recommended)

**A. Point Domain to Droplet**
```
Create A record in your DNS:
- Type: A
- Name: @ (or subdomain like www)
- Value: your_droplet_ip
- TTL: 3600
```

**B. Setup SSL with Let's Encrypt**
```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
certbot renew --dry-run
```

### Step 6: Configure Firewall

```bash
# Setup UFW firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Check status
ufw status
```

## Configuration

### Environment Variables

Required environment variables for production:

#### Backend (.env.digitalocean)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://admin:password@mongodb:27017/maarifahub?authSource=admin
JWT_SECRET=your_jwt_secret_at_least_32_chars
JWT_EXPIRE=7d
CORS_ORIGIN=https://yourdomain.com
```

#### MongoDB
```bash
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your_secure_password
MONGO_INITDB_DATABASE=maarifahub
```

#### Frontend
```bash
VITE_API_URL=https://yourdomain.com/api
```

### Nginx Configuration

The included `nginx.do.conf` handles:
- Serving frontend static files
- Proxying API requests to backend
- SSL/TLS termination
- Gzip compression
- Security headers
- WebSocket support (for future features)

## Maintenance

### Viewing Logs

```bash
# All services
docker-compose -f docker-compose.digitalocean.yml logs -f

# Specific service
docker-compose -f docker-compose.digitalocean.yml logs -f backend
docker-compose -f docker-compose.digitalocean.yml logs -f frontend
docker-compose -f docker-compose.digitalocean.yml logs -f mongodb
```

### Updating Application

```bash
# Pull latest changes
cd /opt/maarifahub
git pull

# Rebuild and restart
docker-compose -f docker-compose.digitalocean.yml down
docker-compose -f docker-compose.digitalocean.yml up -d --build

# Or use the script
./update-digitalocean.sh
```

### Database Backup

```bash
# Create backup script
cat > /opt/maarifahub/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/maarifahub/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

docker exec maarifahub-mongodb mongodump \
  --username admin \
  --password your_password \
  --authenticationDatabase admin \
  --db maarifahub \
  --out /backup/$DATE

docker cp maarifahub-mongodb:/backup/$DATE $BACKUP_DIR/

# Keep only last 7 days of backups
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;

echo "Backup completed: $BACKUP_DIR/$DATE"
EOF

chmod +x /opt/maarifahub/backup.sh

# Setup daily backup cron job
crontab -e
# Add: 0 2 * * * /opt/maarifahub/backup.sh
```

### Monitoring

```bash
# Check container health
docker ps

# Check resource usage
docker stats

# Check disk space
df -h

# Check MongoDB status
docker exec maarifahub-mongodb mongosh \
  -u admin -p your_password \
  --authenticationDatabase admin \
  --eval "db.serverStatus()"
```

### Troubleshooting

#### Application Not Starting
```bash
# Check logs
docker-compose -f docker-compose.digitalocean.yml logs

# Restart services
docker-compose -f docker-compose.digitalocean.yml restart

# Rebuild from scratch
docker-compose -f docker-compose.digitalocean.yml down -v
docker-compose -f docker-compose.digitalocean.yml up -d --build
```

#### MongoDB Connection Issues
```bash
# Check MongoDB logs
docker logs maarifahub-mongodb

# Test connection
docker exec maarifahub-mongodb mongosh \
  -u admin -p your_password \
  --authenticationDatabase admin
```

#### SSL Certificate Issues
```bash
# Renew certificate
certbot renew

# Check certificate status
certbot certificates
```

## Cost Estimation

### Droplet Hosting
- **Basic Droplet** ($12/month): 2GB RAM, 1 CPU, 50GB SSD
- **Professional Droplet** ($24/month): 4GB RAM, 2 CPU, 80GB SSD
- **Backups** (+20%): Optional automated backups
- **Bandwidth**: 2-4TB included (usually sufficient)

**Total**: $12-30/month depending on traffic

### App Platform Hosting
- **Basic Tier**: Starting at $5/month per component
- **Pro Tier**: Better performance, $12/month per component
- **Managed MongoDB**: Starting at $15/month

**Total**: $35-60/month (zero maintenance)

## Security Best Practices

1. **Change Default Passwords**: Use strong, unique passwords
2. **Enable Firewall**: Only allow necessary ports
3. **Setup SSL**: Always use HTTPS in production
4. **Regular Updates**: Keep system and Docker images updated
5. **Backup Regularly**: Automate daily backups
6. **Monitor Logs**: Set up log monitoring and alerts
7. **Use Secrets**: Never commit sensitive data to Git
8. **Limit Root Access**: Create non-root user for deployment

## Support

For issues or questions:
1. Check logs first: `docker-compose logs`
2. Review this documentation
3. Check Digital Ocean's community tutorials
4. Contact support if needed

## Next Steps

After deployment:
1. Test all functionality
2. Setup monitoring and alerts
3. Configure automated backups
4. Setup CI/CD pipeline (optional)
5. Add custom domain and SSL
6. Configure email service
7. Setup analytics

---

**Deployment Checklist:**
- [ ] Droplet created and accessible
- [ ] Docker and Docker Compose installed
- [ ] Environment variables configured
- [ ] Application deployed and running
- [ ] Domain pointed to droplet
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Backups scheduled
- [ ] Monitoring setup
- [ ] All features tested

**Your app should now be live at: https://yourdomain.com** 🎉
