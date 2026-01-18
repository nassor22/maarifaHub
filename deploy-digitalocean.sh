#!/bin/bash

#############################################
# MaarifaHub Digital Ocean Deployment Script
# This script automates the deployment process
#############################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}\n"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main script
main() {
    print_header "MaarifaHub Digital Ocean Deployment"
    
    # Check prerequisites
    print_info "Checking prerequisites..."
    
    if ! command_exists ssh; then
        print_error "SSH is not installed. Please install OpenSSH client."
        exit 1
    fi
    
    if ! command_exists scp; then
        print_error "SCP is not installed. Please install OpenSSH client."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
    
    # Get deployment details from user
    print_header "Deployment Configuration"
    
    read -p "Enter your Digital Ocean droplet IP: " DROPLET_IP
    if [ -z "$DROPLET_IP" ]; then
        print_error "Droplet IP cannot be empty"
        exit 1
    fi
    
    read -p "Enter your domain name (press Enter to skip): " DOMAIN_NAME
    
    read -p "Enter SSH user (default: root): " SSH_USER
    SSH_USER=${SSH_USER:-root}
    
    read -p "Enter MongoDB admin username (default: admin): " MONGO_USER
    MONGO_USER=${MONGO_USER:-admin}
    
    read -sp "Enter MongoDB admin password: " MONGO_PASSWORD
    echo
    if [ -z "$MONGO_PASSWORD" ]; then
        print_error "MongoDB password cannot be empty"
        exit 1
    fi
    
    read -sp "Enter JWT secret (min 32 characters): " JWT_SECRET
    echo
    if [ ${#JWT_SECRET} -lt 32 ]; then
        print_error "JWT secret must be at least 32 characters"
        exit 1
    fi
    
    # Confirm settings
    print_header "Deployment Summary"
    echo "Droplet IP: $DROPLET_IP"
    echo "SSH User: $SSH_USER"
    echo "Domain: ${DOMAIN_NAME:-Not configured}"
    echo "MongoDB User: $MONGO_USER"
    echo
    read -p "Continue with deployment? (y/N): " CONFIRM
    if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
        print_warning "Deployment cancelled"
        exit 0
    fi
    
    # Test SSH connection
    print_header "Testing SSH Connection"
    if ssh -o ConnectTimeout=10 -o BatchMode=yes "$SSH_USER@$DROPLET_IP" exit 2>/dev/null; then
        print_success "SSH connection successful"
    else
        print_error "Cannot connect to droplet. Please check your SSH keys and IP address."
        exit 1
    fi
    
    # Setup droplet
    print_header "Setting Up Droplet"
    
    print_info "Installing Docker and dependencies..."
    ssh "$SSH_USER@$DROPLET_IP" << 'ENDSSH'
        # Update system
        sudo apt-get update -qq
        
        # Install Docker if not present
        if ! command -v docker &> /dev/null; then
            curl -fsSL https://get.docker.com -o get-docker.sh
            sudo sh get-docker.sh
            rm get-docker.sh
            sudo systemctl enable docker
            sudo systemctl start docker
        fi
        
        # Install Docker Compose if not present
        if ! command -v docker-compose &> /dev/null; then
            sudo apt-get install -y docker-compose
        fi
        
        # Install certbot for SSL
        sudo apt-get install -y certbot python3-certbot-nginx
        
        # Create app directory
        sudo mkdir -p /opt/maarifahub
        sudo chown -R $USER:$USER /opt/maarifahub
ENDSSH
    
    print_success "Droplet setup completed"
    
    # Transfer files
    print_header "Transferring Files"
    
    print_info "Copying application files..."
    
    # Create temp directory for files to transfer
    TEMP_DIR=$(mktemp -d)
    
    # Copy necessary files
    cp docker-compose.digitalocean.yml "$TEMP_DIR/"
    cp nginx.do.conf "$TEMP_DIR/" 2>/dev/null || print_warning "nginx.do.conf not found, will use default"
    cp -r server "$TEMP_DIR/"
    cp -r src "$TEMP_DIR/"
    cp -r public "$TEMP_DIR/"
    cp package*.json "$TEMP_DIR/"
    cp vite.config.js "$TEMP_DIR/"
    cp tailwind.config.js "$TEMP_DIR/"
    cp postcss.config.js "$TEMP_DIR/"
    cp index.html "$TEMP_DIR/"
    cp Dockerfile "$TEMP_DIR/"
    
    # Transfer to droplet
    scp -r "$TEMP_DIR"/* "$SSH_USER@$DROPLET_IP:/opt/maarifahub/"
    
    # Cleanup temp directory
    rm -rf "$TEMP_DIR"
    
    print_success "Files transferred"
    
    # Create environment file
    print_header "Configuring Environment"
    
    # Set CORS and API URL based on domain
    if [ -n "$DOMAIN_NAME" ]; then
        CORS_ORIGIN="https://$DOMAIN_NAME"
        VITE_API_URL="https://$DOMAIN_NAME/api"
    else
        CORS_ORIGIN="http://$DROPLET_IP"
        VITE_API_URL="http://$DROPLET_IP/api"
    fi
    
    # Create .env file
    cat > /tmp/.env.digitalocean << EOF
# Node Environment
NODE_ENV=production

# Server Configuration
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongodb:27017/maarifahub?authSource=admin
MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
MONGO_INITDB_DATABASE=maarifahub

# JWT Configuration
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=${CORS_ORIGIN}

# API URL for Frontend
VITE_API_URL=${VITE_API_URL}
EOF
    
    # Transfer environment file
    scp /tmp/.env.digitalocean "$SSH_USER@$DROPLET_IP:/opt/maarifahub/.env"
    rm /tmp/.env.digitalocean
    
    print_success "Environment configured"
    
    # Deploy application
    print_header "Deploying Application"
    
    print_info "Building and starting containers..."
    ssh "$SSH_USER@$DROPLET_IP" << 'ENDSSH'
        cd /opt/maarifahub
        
        # Load environment variables
        export $(cat .env | xargs)
        
        # Stop any existing containers
        docker-compose -f docker-compose.digitalocean.yml down 2>/dev/null || true
        
        # Build and start
        docker-compose -f docker-compose.digitalocean.yml up -d --build
        
        # Wait for services to be healthy
        echo "Waiting for services to start..."
        sleep 30
        
        # Check status
        docker-compose -f docker-compose.digitalocean.yml ps
ENDSSH
    
    print_success "Application deployed"
    
    # Configure firewall
    print_header "Configuring Firewall"
    
    ssh "$SSH_USER@$DROPLET_IP" << 'ENDSSH'
        # Setup UFW if not already configured
        if ! sudo ufw status | grep -q "Status: active"; then
            sudo ufw --force enable
            sudo ufw allow OpenSSH
            sudo ufw allow 80/tcp
            sudo ufw allow 443/tcp
        fi
ENDSSH
    
    print_success "Firewall configured"
    
    # Setup SSL if domain provided
    if [ -n "$DOMAIN_NAME" ]; then
        print_header "Setting Up SSL Certificate"
        
        print_info "Please ensure your domain $DOMAIN_NAME points to $DROPLET_IP"
        read -p "Press Enter when DNS is configured and ready..."
        
        ssh "$SSH_USER@$DROPLET_IP" << ENDSSH
            # Get SSL certificate
            sudo certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos --register-unsafely-without-email --redirect
ENDSSH
        
        if [ $? -eq 0 ]; then
            print_success "SSL certificate installed"
        else
            print_warning "SSL setup failed. You can run certbot manually later."
        fi
    fi
    
    # Create update script on droplet
    print_header "Creating Update Script"
    
    ssh "$SSH_USER@$DROPLET_IP" << 'ENDSSH'
        cat > /opt/maarifahub/update.sh << 'EOF'
#!/bin/bash
cd /opt/maarifahub
echo "Pulling latest changes..."
# If using git
# git pull

echo "Rebuilding and restarting containers..."
docker-compose -f docker-compose.digitalocean.yml down
docker-compose -f docker-compose.digitalocean.yml up -d --build

echo "Update completed!"
docker-compose -f docker-compose.digitalocean.yml ps
EOF
        chmod +x /opt/maarifahub/update.sh
ENDSSH
    
    print_success "Update script created"
    
    # Create backup script
    print_header "Creating Backup Script"
    
    ssh "$SSH_USER@$DROPLET_IP" << ENDSSH
        cat > /opt/maarifahub/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/maarifahub/backups"
DATE=\$(date +%Y%m%d_%H%M%S)
mkdir -p \$BACKUP_DIR

echo "Creating backup: \$DATE"

docker exec maarifahub-mongodb mongodump \\
  --username $MONGO_USER \\
  --password $MONGO_PASSWORD \\
  --authenticationDatabase admin \\
  --db maarifahub \\
  --out /backup/\$DATE

docker cp maarifahub-mongodb:/backup/\$DATE \$BACKUP_DIR/

# Keep only last 7 days of backups
find \$BACKUP_DIR -type d -mtime +7 -exec rm -rf {} + 2>/dev/null

echo "Backup completed: \$BACKUP_DIR/\$DATE"
EOF
        chmod +x /opt/maarifahub/backup.sh
ENDSSH
    
    print_success "Backup script created"
    
    # Final checks
    print_header "Deployment Complete! 🎉"
    
    echo
    if [ -n "$DOMAIN_NAME" ]; then
        print_success "Your application is now live at: https://$DOMAIN_NAME"
    else
        print_success "Your application is now live at: http://$DROPLET_IP"
    fi
    
    echo
    print_info "Important Next Steps:"
    echo "  1. Test your application thoroughly"
    echo "  2. Setup automated backups (crontab -e)"
    echo "  3. Monitor logs: ssh $SSH_USER@$DROPLET_IP 'cd /opt/maarifahub && docker-compose logs -f'"
    echo "  4. To update: ssh $SSH_USER@$DROPLET_IP '/opt/maarifahub/update.sh'"
    echo "  5. To backup: ssh $SSH_USER@$DROPLET_IP '/opt/maarifahub/backup.sh'"
    
    echo
    print_info "Useful Commands:"
    echo "  • View logs: docker-compose -f docker-compose.digitalocean.yml logs -f"
    echo "  • Restart: docker-compose -f docker-compose.digitalocean.yml restart"
    echo "  • Stop: docker-compose -f docker-compose.digitalocean.yml down"
    echo "  • Start: docker-compose -f docker-compose.digitalocean.yml up -d"
    
    echo
}

# Run main function
main
