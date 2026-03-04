# How to Run F1 Track Designer

This guide provides instructions for running the application in various environments.

## 📦 Docker Installation

### 1. Prerequisites
- Docker and Docker Compose installed on your system.

### 2. Setup
Create a `docker-compose.yml` file:
```yaml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: f1_tracks
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/f1_tracks
      SESSION_SECRET: your_secret_here
    depends_on:
      - db
volumes:
  postgres_data:
```

### 3. Run
```bash
docker-compose up -d
```

---

## ☁️ VPS Deployment (Ubuntu/Debian)

### 1. Install Dependencies
```bash
sudo apt update
sudo apt install nodejs npm postgresql postgresql-contrib
```

### 2. Configure Database
```bash
sudo -u postgres psql
CREATE DATABASE f1_tracks;
CREATE USER f1_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE f1_tracks TO f1_user;
\q
```

### 3. Application Setup
```bash
git clone <your-repo-url>
cd f1-track-designer
npm install
export DATABASE_URL=postgresql://f1_user:password@localhost:5432/f1_tracks
export SESSION_SECRET=your_secret
npm run db:push
npm run build
npm run start
```

### 4. Process Management (PM2)
```bash
npm install -g pm2
pm2 start dist/server/index.js --name f1-designer
```

---

## 🌐 Domain & SSL (Nginx)

### 1. Nginx Config
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. SSL with Certbot
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 🛠 Development
To run in development mode with hot-reload:
```bash
npm run dev
```
