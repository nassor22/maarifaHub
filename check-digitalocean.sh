#!/bin/bash

#############################################
# Pre-Deployment Checklist for Digital Ocean
# Run this before deploying to catch issues
#############################################

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Digital Ocean Deployment - Pre-Flight Check${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"

ERRORS=0
WARNINGS=0

# Check if required files exist
echo -e "${BLUE}[1/8] Checking required files...${NC}"

FILES=(
    "docker-compose.digitalocean.yml"
    "nginx.do.conf"
    ".env.digitalocean.example"
    "deploy-digitalocean.sh"
    "server/package.json"
    "server/server.js"
    "package.json"
    "Dockerfile"
    "server/Dockerfile"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file ${RED}(missing)${NC}"
        ((ERRORS++))
    fi
done

# Check if scripts are executable
echo -e "\n${BLUE}[2/8] Checking script permissions...${NC}"

if [ -x "deploy-digitalocean.sh" ]; then
    echo -e "  ${GREEN}✓${NC} deploy-digitalocean.sh is executable"
else
    echo -e "  ${YELLOW}⚠${NC} deploy-digitalocean.sh is not executable"
    echo -e "     Fix: chmod +x deploy-digitalocean.sh"
    ((WARNINGS++))
fi

# Check if SSH is available
echo -e "\n${BLUE}[3/8] Checking SSH client...${NC}"

if command -v ssh &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} SSH client installed"
else
    echo -e "  ${RED}✗${NC} SSH client not found"
    echo -e "     Install: apt install openssh-client (Ubuntu/Debian)"
    ((ERRORS++))
fi

if command -v scp &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} SCP available"
else
    echo -e "  ${RED}✗${NC} SCP not found"
    ((ERRORS++))
fi

# Check SSH keys
echo -e "\n${BLUE}[4/8] Checking SSH keys...${NC}"

if [ -f "$HOME/.ssh/id_rsa" ] || [ -f "$HOME/.ssh/id_ed25519" ]; then
    echo -e "  ${GREEN}✓${NC} SSH key found"
else
    echo -e "  ${YELLOW}⚠${NC} No SSH key found"
    echo -e "     Generate: ssh-keygen -t ed25519 -C \"your_email@example.com\""
    ((WARNINGS++))
fi

# Check if .env file is configured
echo -e "\n${BLUE}[5/8] Checking environment configuration...${NC}"

if [ -f ".env.digitalocean" ]; then
    echo -e "  ${YELLOW}⚠${NC} .env.digitalocean already exists"
    echo -e "     Make sure it contains your production values"
    ((WARNINGS++))
else
    echo -e "  ${GREEN}✓${NC} .env.digitalocean not present (will be created during deployment)"
fi

# Check Docker images
echo -e "\n${BLUE}[6/8] Checking local Docker setup (optional)...${NC}"

if command -v docker &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Docker installed locally"
    
    if docker ps &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Docker daemon is running"
    else
        echo -e "  ${YELLOW}⚠${NC} Docker daemon not running (not required for remote deploy)"
    fi
else
    echo -e "  ${YELLOW}⚠${NC} Docker not installed locally (not required for remote deploy)"
fi

# Check Git status
echo -e "\n${BLUE}[7/8] Checking Git repository...${NC}"

if command -v git &> /dev/null; then
    if [ -d ".git" ]; then
        echo -e "  ${GREEN}✓${NC} Git repository detected"
        
        # Check for uncommitted changes
        if [ -n "$(git status --porcelain)" ]; then
            echo -e "  ${YELLOW}⚠${NC} You have uncommitted changes"
            echo -e "     Consider committing before deployment"
            ((WARNINGS++))
        else
            echo -e "  ${GREEN}✓${NC} Working directory clean"
        fi
    else
        echo -e "  ${YELLOW}⚠${NC} Not a git repository"
    fi
else
    echo -e "  ${YELLOW}⚠${NC} Git not installed"
fi

# Check network connectivity
echo -e "\n${BLUE}[8/8] Checking network connectivity...${NC}"

if ping -c 1 google.com &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Internet connection active"
else
    echo -e "  ${RED}✗${NC} No internet connection"
    ((ERRORS++))
fi

# Summary
echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready to deploy.${NC}\n"
    echo -e "Run: ${BLUE}./deploy-digitalocean.sh${NC}\n"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    echo -e "You can proceed, but review the warnings above.\n"
    echo -e "Run: ${BLUE}./deploy-digitalocean.sh${NC}\n"
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s) found${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    fi
    echo -e "\nPlease fix the errors above before deploying.\n"
    exit 1
fi
