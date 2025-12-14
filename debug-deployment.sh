#!/bin/bash

echo "🔍 Checking Bluestock Deployment Status..."
echo ""

echo "1️⃣ Container Status:"
docker-compose -f docker-compose.prod.yml ps
echo ""

echo "2️⃣ Nginx Logs (last 20 lines):"
docker-compose -f docker-compose.prod.yml logs --tail=20 nginx
echo ""

echo "3️⃣ Frontend Logs (last 20 lines):"
docker-compose -f docker-compose.prod.yml logs --tail=20 frontend
echo ""

echo "4️⃣ Backend Logs (last 20 lines):"
docker-compose -f docker-compose.prod.yml logs --tail=20 backend
echo ""

echo "5️⃣ Database Logs (last 20 lines):"
docker-compose -f docker-compose.prod.yml logs --tail=20 postgres
echo ""

echo "6️⃣ Network Connections:"
sudo netstat -tlnp | grep -E ':(80|443|4000|5173)' || echo "No services listening on expected ports"
echo ""

echo "7️⃣ Firewall Rules:"
sudo iptables -L INPUT -n --line-numbers | grep -E '(80|443)' || echo "No firewall rules for ports 80/443"
echo ""

echo "8️⃣ Check if containers are accessible:"
echo "- Testing nginx: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:80 || echo 'Failed')"
echo "- Testing frontend: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:5173 || echo 'Failed')"
echo "- Testing backend: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:4000/api || echo 'Failed')"
