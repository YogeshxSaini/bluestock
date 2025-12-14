#!/bin/bash

# Bluestock Oracle Cloud Deployment Script

set -e

echo "🚀 Starting Bluestock deployment on Oracle Cloud..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get Oracle instance public IP
PUBLIC_IP=$(curl -s ifconfig.me)
echo -e "${BLUE}📍 Your Oracle Public IP: ${PUBLIC_IP}${NC}"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "Creating .env from template..."
    cp .env.production .env
    
    # Generate secrets
    JWT_SECRET=$(openssl rand -base64 32)
    POSTGRES_PASSWORD=$(openssl rand -base64 16)
    
    # Update .env file
    sed -i "s|JWT_SECRET=|JWT_SECRET=${JWT_SECRET}|g" .env
    sed -i "s|POSTGRES_PASSWORD=|POSTGRES_PASSWORD=${POSTGRES_PASSWORD}|g" .env
    sed -i "s|YOUR_ORACLE_IP|${PUBLIC_IP}|g" .env
    
    echo -e "${GREEN}✅ .env file created with generated secrets${NC}"
    echo -e "${RED}⚠️  Please update Cloudinary and Firebase credentials in .env file${NC}"
    echo "Then run this script again."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✅ Docker installed. Please logout and login again, then run this script.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${BLUE}Installing Docker Compose...${NC}"
    sudo apt install -y docker-compose
fi

# Stop existing containers
echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Build and start containers
echo -e "${BLUE}🔨 Building and starting containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check container status
echo -e "${BLUE}📊 Container Status:${NC}"
docker-compose -f docker-compose.prod.yml ps

# Display logs
echo -e "${BLUE}📝 Recent logs:${NC}"
docker-compose -f docker-compose.prod.yml logs --tail=20

echo ""
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo -e "${GREEN}🌐 Your application is now running at:${NC}"
echo -e "${BLUE}   http://${PUBLIC_IP}${NC}"
echo ""
echo -e "${BLUE}📊 Useful commands:${NC}"
echo "   View logs:     docker-compose -f docker-compose.prod.yml logs -f"
echo "   Stop app:      docker-compose -f docker-compose.prod.yml down"
echo "   Restart app:   docker-compose -f docker-compose.prod.yml restart"
echo "   Update app:    git pull && ./deploy-oracle.sh"
echo ""
