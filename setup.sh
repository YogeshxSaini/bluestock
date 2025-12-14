#!/bin/bash

# Company Registration & Verification Module - Setup Script
# This script automates the initial setup process

set -e  # Exit on error

echo "🚀 Company Registration & Verification Module Setup"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 20 or higher from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${YELLOW}⚠️  Node.js version $NODE_VERSION detected. Version 20+ recommended${NC}"
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    echo "Please install PostgreSQL 15 or higher"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Setup backend
echo "📦 Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your configuration${NC}"
fi

echo "Installing backend dependencies..."
npm install
echo -e "${GREEN}✅ Backend setup complete${NC}"
echo ""

# Setup frontend
echo "📦 Setting up frontend..."
cd ../frontend

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit frontend/.env with your configuration${NC}"
fi

echo "Installing frontend dependencies..."
npm install
echo -e "${GREEN}✅ Frontend setup complete${NC}"
echo ""

# Database setup
cd ..
echo "💾 Setting up database..."
echo ""
echo "Please enter PostgreSQL details:"
read -p "PostgreSQL username [company_user]: " DB_USER
DB_USER=${DB_USER:-company_user}

read -sp "PostgreSQL password [company_password]: " DB_PASSWORD
echo ""
DB_PASSWORD=${DB_PASSWORD:-company_password}

read -p "Database name [company_db]: " DB_NAME
DB_NAME=${DB_NAME:-company_db}

echo ""
echo "Creating database..."

# Create database
PGPASSWORD=$DB_PASSWORD psql -U postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database may already exist"
PGPASSWORD=$DB_PASSWORD psql -U postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "User may already exist"
PGPASSWORD=$DB_PASSWORD psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Import schema
echo "Importing database schema..."
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -f company_db.sql

echo -e "${GREEN}✅ Database setup complete${NC}"
echo ""

# Update .env files with database credentials
echo "Updating configuration files..."
sed -i.bak "s/DB_USER=.*/DB_USER=$DB_USER/" backend/.env
sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" backend/.env
sed -i.bak "s/DB_NAME=.*/DB_NAME=$DB_NAME/" backend/.env
rm backend/.env.bak 2>/dev/null || true

echo -e "${GREEN}✅ Configuration updated${NC}"
echo ""

# Summary
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your Cloudinary credentials (optional)"
echo "2. Edit frontend/.env with your API URL if needed"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "The application will be available at:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:4000"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
