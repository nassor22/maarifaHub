# 🌊 Deploy MaarifaHub to Digital Ocean

Complete hosting solution for both frontend and backend on Digital Ocean.

## ⚡ Quick Start (3 Steps)

### 1. Pre-Flight Check
```bash
./check-digitalocean.sh
```

### 2. Deploy
```bash
./deploy-digitalocean.sh
```

### 3. Done! 🎉
Your app will be live at your droplet IP or domain.

---

## 📋 What You Need

- [ ] Digital Ocean account ([Sign up](https://www.digitalocean.com/))
- [ ] Droplet IP address (after creating droplet)
- [ ] SSH key configured
- [ ] MongoDB password (strong, 20+ characters)
- [ ] JWT secret (32+ characters) - Generate: `openssl rand -base64 32`
- [ ] Domain name (optional)

## 🚀 Deployment Process

### Step 1: Create Digital Ocean Droplet

1. Go to [Digital Ocean](https://www.digitalocean.com/)
2. Click "Create" → "Droplets"
3. Select **Ubuntu 22.04 LTS**
4. Choose plan: **Basic - $12/month** (2GB RAM minimum)
5. Add your SSH key
6. Create droplet
7. Note the IP address

### Step 2: Run Pre-Flight Check

```bash
./check-digitalocean.sh
```

This verifies:
- ✓ All required files present
- ✓ Scripts are executable
- ✓ SSH client available
- ✓ SSH keys configured
- ✓ Network connectivity

### Step 3: Deploy Application

```bash
./deploy-digitalocean.sh
```

The script will:
1. Connect to your droplet
2. Install Docker and dependencies
3. Transfer application files
4. Configure environment variables
5. Build and start containers
6. Setup firewall
7. Configure SSL (if domain provided)

**Follow the prompts and enter your values when requested.**

### Step 4: Test Your Application

- **With Domain**: Visit https://yourdomain.com
- **Without Domain**: Visit http://YOUR_DROPLET_IP

Test:
- [ ] Homepage loads
- [ ] User registration works
- [ ] Login works
- [ ] API responds correctly

---

## 📁 Files Reference

| File | Purpose |
|------|---------|
| `deploy-digitalocean.sh` | Automated deployment script |
| `check-digitalocean.sh` | Pre-deployment verification |
| `docker-compose.digitalocean.yml` | Docker orchestration config |
| `nginx.do.conf` | Nginx reverse proxy config |
| `.env.digitalocean.example` | Environment variables template |

## 📚 Documentation

| Document | What It Contains |
|----------|------------------|
| [DIGITALOCEAN_SUMMARY.md](DIGITALOCEAN_SUMMARY.md) | Quick overview & getting started |
| [DIGITALOCEAN_QUICK_REF.md](DIGITALOCEAN_QUICK_REF.md) | Common commands reference |
| [Documentations/DIGITALOCEAN_DEPLOYMENT.md](Documentations/DIGITALOCEAN_DEPLOYMENT.md) | Complete detailed guide |
| [DEPLOYMENT_COMPARISON.md](DEPLOYMENT_COMPARISON.md) | Compare deployment options |

## 🔧 Common Operations

### View Logs
```bash
ssh root@YOUR_IP 'cd /opt/maarifahub && docker-compose -f docker-compose.digitalocean.yml logs -f'
```

### Restart Services
```bash
ssh root@YOUR_IP 'cd /opt/maarifahub && docker-compose -f docker-compose.digitalocean.yml restart'
```

### Update Application
```bash
ssh root@YOUR_IP '/opt/maarifahub/update.sh'
```

### Backup Database
```bash
ssh root@YOUR_IP '/opt/maarifahub/backup.sh'
```

### Stop Application
```bash
ssh root@YOUR_IP 'cd /opt/maarifahub && docker-compose -f docker-compose.digitalocean.yml down'
```

### Start Application
```bash
ssh root@YOUR_IP 'cd /opt/maarifahub && docker-compose -f docker-compose.digitalocean.yml up -d'
```

## 🔐 Security

The deployment includes:
- ✅ Firewall (UFW) configured
- ✅ MongoDB authentication enabled
- ✅ Backend only accessible via nginx
- ✅ JWT token authentication
- ✅ Security headers
- ✅ Rate limiting
- ✅ SSL/TLS (with domain)
- ✅ Container isolation

## 💰 Costs

| Component | Cost | Notes |
|-----------|------|-------|
| Droplet (2GB) | $12/month | Minimum recommended |
| Droplet (4GB) | $24/month | Better performance |
| Backups | +20% | Optional |
| Domain | $10-15/year | Optional |
| **Total** | **$12-30/month** | Predictable pricing |

## 🆘 Troubleshooting

### Can't Connect to Droplet
```bash
# Test SSH connection
ssh -v root@YOUR_DROPLET_IP

# If fails, use Digital Ocean console
# Dashboard → Droplets → Your Droplet → Console
```

### Deployment Script Fails
```bash
# Check SSH key is added to droplet
ssh-add -l

# Verify droplet IP is correct
ping YOUR_DROPLET_IP

# Check script is executable
ls -la deploy-digitalocean.sh
```

### Containers Won't Start
```bash
# SSH into droplet
ssh root@YOUR_IP

# Check logs
cd /opt/maarifahub
docker-compose -f docker-compose.digitalocean.yml logs

# Restart
docker-compose -f docker-compose.digitalocean.yml restart
```

### Website Not Loading
```bash
# Check if containers are running
docker ps

# Check nginx logs
docker logs maarifahub-frontend

# Check backend logs
docker logs maarifahub-backend

# Verify firewall
sudo ufw status
```

## 🎯 Next Steps After Deployment

1. **Test thoroughly** - Verify all features work
2. **Setup backups** - Schedule daily backups
   ```bash
   ssh root@YOUR_IP
   crontab -e
   # Add: 0 2 * * * /opt/maarifahub/backup.sh
   ```
3. **Monitor logs** - Check for errors regularly
4. **Update regularly** - Keep system and containers updated
5. **Setup monitoring** - Consider Uptime Robot or similar
6. **Configure analytics** - Add Google Analytics or Plausible

## 🌐 Adding a Custom Domain

### 1. Configure DNS
Add an A record in your domain registrar:
- **Type**: A
- **Name**: @ (or subdomain)
- **Value**: YOUR_DROPLET_IP
- **TTL**: 3600

### 2. Wait for DNS Propagation
```bash
# Check if DNS is ready
dig yourdomain.com +short
# Should show your droplet IP
```

### 3. Install SSL Certificate
```bash
ssh root@YOUR_IP
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 📊 What Gets Deployed

```
┌────────────────────────────────────────┐
│      Digital Ocean Droplet             │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │  Nginx (Port 80/443)             │ │
│  │  • Serves React app              │ │
│  │  • Proxies /api to backend       │ │
│  └──────────────┬───────────────────┘ │
│                 │                      │
│  ┌──────────────▼───────────────────┐ │
│  │  Backend API (Port 5000)         │ │
│  │  • Node.js + Express             │ │
│  │  • JWT Auth                      │ │
│  └──────────────┬───────────────────┘ │
│                 │                      │
│  ┌──────────────▼───────────────────┐ │
│  │  MongoDB (Port 27017)            │ │
│  │  • Database                      │ │
│  │  • Persistent storage            │ │
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
```

## ✨ Why Digital Ocean?

- ✅ **Simple**: One place for everything
- ✅ **Affordable**: $12-30/month predictable cost
- ✅ **Reliable**: 99.99% uptime SLA
- ✅ **Full Control**: Complete server access
- ✅ **Scalable**: Easy to resize as you grow
- ✅ **Great Support**: Excellent community and docs

## 🤝 Need Help?

1. **Check documentation** - Read the guides linked above
2. **View logs** - Most issues show up in logs
3. **Digital Ocean Community** - Extensive tutorials available
4. **Support tickets** - Contact DO support if needed

---

## 🎉 Ready to Deploy?

```bash
# Step 1: Check everything is ready
./check-digitalocean.sh

# Step 2: Deploy!
./deploy-digitalocean.sh
```

**Your MaarifaHub app will be live in ~30 minutes!** 🚀
