# Deploy Without a Domain

You have **3 options** to expose your app on the internet without a domain:

---

## Option 1: 🌐 Use Your Public IP Address (Recommended for LAN/VPS)

### Step 1: Find your public IP
```bash
curl ifconfig.me
```

### Step 2: Configure nginx
The `nginx.conf` is already configured to accept all connections.

**On macOS:**
```bash
sudo cp nginx.conf /opt/homebrew/etc/nginx/servers/bluestock.conf
sudo nginx -t
sudo brew services restart nginx
```

**On Linux:**
```bash
sudo cp nginx.conf /etc/nginx/sites-available/bluestock
sudo ln -s /etc/nginx/sites-available/bluestock /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 3: Update frontend API URL
Edit `frontend/.env`:
```env
VITE_API_URL=http://YOUR_PUBLIC_IP/api
```

### Step 4: Rebuild frontend
```bash
cd frontend && npm run build
```

### Step 5: Start backend
```bash
cd backend && npm start
```

### Step 6: Open firewall (if needed)
```bash
# Ubuntu/Debian
sudo ufw allow 80/tcp

# macOS - System Preferences > Security & Privacy > Firewall
```

**Access your app:** `http://YOUR_PUBLIC_IP`

---

## Option 2: 🚀 Use ngrok (Easiest - No nginx needed!)

ngrok creates a secure tunnel to your localhost and gives you a temporary public URL.

### Step 1: Install ngrok
```bash
# macOS
brew install ngrok

# Or download from https://ngrok.com/download
```

### Step 2: Start your backend
```bash
cd backend && npm start  # Runs on port 4000
```

### Step 3: In another terminal, start frontend dev server
```bash
cd frontend && npm run dev  # Runs on port 5173
```

### Step 4: Create tunnels for both

**Terminal 1 (Frontend):**
```bash
ngrok http 5173
```

**Terminal 2 (Backend API):**
```bash
ngrok http 4000
```

### Step 5: Update frontend API URL
ngrok will give you URLs like:
- Frontend: `https://abc123.ngrok-free.app`
- Backend: `https://xyz789.ngrok-free.app`

Update `frontend/.env`:
```env
VITE_API_URL=https://xyz789.ngrok-free.app/api
```

Then restart the frontend dev server.

**Access your app:** Use the frontend ngrok URL in your browser!

> **Note:** Free ngrok URLs change every time you restart. For persistent URLs, sign up at ngrok.com (free plan available).

---

## Option 3: 🆓 Use a Free Subdomain Service

Services that provide free subdomains:

### A) Cloudflare Tunnel (Free)
1. Sign up at cloudflare.com
2. Install cloudflared: `brew install cloudflare/cloudflare/cloudflared`
3. Run: `cloudflared tunnel --url http://localhost:80`
4. Get a free `*.trycloudflare.com` URL

### B) LocalTunnel (Free)
```bash
npm install -g localtunnel

# Start your services, then:
lt --port 80
```

### C) Serveo (Free, no signup)
```bash
ssh -R 80:localhost:80 serveo.net
```

---

## 🎯 Quick Comparison

| Option | Pros | Cons |
|--------|------|------|
| **Public IP** | Permanent, full control | Need server/VPS, manual firewall |
| **ngrok** | Easiest, HTTPS included | URL changes (free), need 2 terminals |
| **Free Subdomain** | No installation | Less reliable, temporary |

---

## 🔒 Security Notes

⚠️ **Before exposing to internet:**

1. **Use environment variables** for sensitive data
2. **Enable HTTPS** (ngrok provides this automatically)
3. **Add rate limiting** to prevent abuse
4. **Enable CORS properly** in backend
5. **Use strong passwords** for all accounts
6. **Keep dependencies updated**

For production, consider:
- Digital Ocean ($5/month) with your own domain
- AWS/GCP free tier
- Heroku (free tier available)
- Vercel (free for frontend)
- Railway (free tier)
