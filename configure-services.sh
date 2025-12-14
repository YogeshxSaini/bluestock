#!/bin/bash

# Cloudinary Configuration Helper
# This script helps you configure Cloudinary credentials

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}☁️  Cloudinary Configuration${NC}"
echo "=============================="
echo ""

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env not found. Creating from template...${NC}"
    cp backend/.env.example backend/.env
fi

echo ""
echo -e "${GREEN}Step 1: Cloudinary Configuration${NC}"
echo "================================="
echo ""
echo "Please follow docs/CLOUDINARY_SETUP.md to:"
echo "1. Create a Cloudinary account"
echo "2. Get your Cloud Name, API Key, and API Secret"
echo ""
read -p "Have you completed Cloudinary setup? (y/n): " cloudinary_ready

if [ "$cloudinary_ready" = "y" ]; then
    echo ""
    echo "Enter Cloudinary credentials:"
    read -p "Cloud Name: " cloudinary_cloud_name
    read -p "API Key: " cloudinary_api_key
    read -sp "API Secret: " cloudinary_api_secret
    echo ""
    
    # Update backend .env
    sed -i.bak "s|CLOUDINARY_CLOUD_NAME=.*|CLOUDINARY_CLOUD_NAME=$cloudinary_cloud_name|" backend/.env
    sed -i.bak "s|CLOUDINARY_API_KEY=.*|CLOUDINARY_API_KEY=$cloudinary_api_key|" backend/.env
    sed -i.bak "s|CLOUDINARY_API_SECRET=.*|CLOUDINARY_API_SECRET=$cloudinary_api_secret|" backend/.env
    
    rm -f backend/.env.bak
    
    echo -e "${GREEN}✅ Cloudinary configured!${NC}"
else
    echo -e "${YELLOW}⏭️  Skipping Cloudinary configuration${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Configuration Complete!${NC}"
echo "=========================="
echo ""
echo "Next steps:"
echo "1. Restart your backend server: cd backend && npm run dev"
echo "2. Restart your frontend server: cd frontend && npm run dev"
echo "3. Test the configuration"
echo ""
echo "Verify:"
echo "- Backend should show: ✅ Cloudinary configured successfully"
echo ""
echo "Documentation:"
echo "- Cloudinary: docs/CLOUDINARY_SETUP.md"
