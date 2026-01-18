# Digital Ocean Deployment - Quick Reference

## 🚀 Quick Start

### One-Command Deploy
```bash
chmod +x deploy-digitalocean.sh
./deploy-digitalocean.sh
```

## 📋 Prerequisites Checklist
- [ ] Digital Ocean account created
- [ ] Droplet created (Ubuntu 22.04, 2GB RAM minimum)
- [ ] SSH key added to droplet
- [ ] Domain DNS configured (optional)

## 🔑 Required Information
Before deploying, have these ready:
- Droplet IP address
- MongoDB admin password (secure, 20+ characters)
- JWT secret (32+ characters)
- Domain name (if using custom domain)

## 📁 Files Created
- `docker-compose.digitalocean.yml` - Docker orchestration
- `nginx.do.conf` - Nginx reverse proxy config
- `.env.digitalocean.example` - Environment template
- `deploy-digitalocean.sh` - Automated deployment script

## 🛠️ Manual Deploy Steps

### 1. Prepare Droplet
```bash
ssh root@YOUR_DROPLET_IP
apt update && apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install docker-compose -y
mkdir -p /opt/maarifahub
```

### 2. Upload Files
```bash
# From local machine
scp -r . root@YOUR_DROPLET_IP:/opt/maarifahub/
```

### 3. Configure Environment
```bash
ssh root@YOUR_DROPLET_IP
cd /opt/maarifahub
cp .env.digitalocean.example .env
nano .env  # Edit with your values
```

### 4. Deploy
```bash
docker-compose -f docker-compose.digitalocean.yml up -d --build
```

### 5. Configure Firewall
```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 6. Setup SSL (with domain)
```bash
certbot --nginx -d yourdomain.com
```

## 🔍 Useful Commands

### View Logs
```bash
cd /opt/maarifahub
docker-compose -f docker-compose.digitalocean.yml logs -f
docker-compose -f docker-compose.digitalocean.yml logs -f backend
docker-compose -f docker-compose.digitalocean.yml logs -f frontend
```

### Restart Services
```bash
docker-compose -f docker-compose.digitalocean.yml restart
docker-compose -f docker-compose.digitalocean.yml restart backend
```

### Stop/Start
```bash
docker-compose -f docker-compose.digitalocean.yml down
docker-compose -f docker-compose.digitalocean.yml up -d
```

### Update Application
```bash
./update.sh  # On droplet
# Or manually:
docker-compose -f docker-compose.digitalocean.yml down
docker-compose -f docker-compose.digitalocean.yml up -d --build
```

### Database Backup
```bash
./backup.sh  # On droplet
```

### Check Service Status
```bash
docker ps
docker-compose -f docker-compose.digitalocean.yml ps
```

## 🌐 Access Your App
- **With Domain**: https://yourdomain.com
- **Without Domain**: http://YOUR_DROPLET_IP

## 📊 Monitoring

### Check Container Health
```bash
docker ps
docker stats
```

### Check Disk Space
```bash
df -h
```

### Check MongoDB
```bash
docker exec maarifahub-mongodb mongosh \
  -u admin -p YOUR_PASSWORD \
  --authenticationDatabase admin \
  --eval "db.serverStatus()"
```

## 🔧 Troubleshooting

### Containers Won't Start
```bash
docker-compose -f docker-compose.digitalocean.yml logs
docker-compose -f docker-compose.digitalocean.yml down -v
docker-compose -f docker-compose.digitalocean.yml up -d --build
```

### Can't Connect to Database
```bash
docker logs maarifahub-mongodb
docker exec maarifahub-mongodb mongosh -u admin -p PASSWORD
```

### Frontend Not Loading
```bash
docker logs maarifahub-frontend
# Check nginx config
docker exec maarifahub-frontend nginx -t
```

### Backend API Errors
```bash
docker logs maarifahub-backend
docker exec -it maarifahub-backend sh
```

## 🔐 Security Checklist
- [ ] Strong MongoDB password set
- [ ] Secure JWT secret generated
- [ ] Firewall configured (only ports 22, 80, 443 open)
- [ ] SSL certificate installed
- [ ] Regular backups scheduled
- [ ] CORS restricted to your domain

## 💰 Cost Estimate
- **Basic Droplet**: $12/month (2GB RAM)
- **Professional**: $24/month (4GB RAM)
- **Backups**: +20% (optional)
- **Total**: ~$12-30/month

## 📚 Documentation
- Full Guide: `Documentations/DIGITALOCEAN_DEPLOYMENT.md`
- API Docs: `Documentations/API_DOCUMENTATION.md`
- Architecture: `Documentations/ARCHITECTURE.md`

## 🆘 Support
1. Check logs: `docker-compose logs`
2. Review documentation
3. Check Digital Ocean community
4. Contact support

## ⚡ Quick Commands Reference

```bash
# Deploy
./deploy-digitalocean.sh

# Update
ssh root@IP '/opt/maarifahub/update.sh'

# Backup
ssh root@IP '/opt/maarifahub/backup.sh'

# Logs
ssh root@IP 'cd /opt/maarifahub && docker-compose logs -f'

# Restart
ssh root@IP 'cd /opt/maarifahub && docker-compose restart'

# Stop
ssh root@IP 'cd /opt/maarifahub && docker-compose down'

# Start
ssh root@IP 'cd /opt/maarifahub && docker-compose up -d'
```

---

**Need help?** Refer to `Documentations/DIGITALOCEAN_DEPLOYMENT.md` for detailed information.
