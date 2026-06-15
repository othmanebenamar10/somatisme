# 🚀 Guide de Déploiement - SOMATISME

Guide complet pour déployer le site SOMATISME en production.

## 📋 Prérequis

- Node.js 18+ et pnpm
- Compte Vercel ou serveur VPS
- Domaine personnalisé (optionnel)
- Certificat SSL/TLS

## 🌐 Option 1 : Déploiement sur Vercel (Recommandé)

### Étape 1 : Préparation du Code

```bash
# Vérifier que tout compile correctement
pnpm build

# Vérifier les erreurs TypeScript
pnpm check
```

### Étape 2 : Connecter à Vercel

1. Créer un compte sur [vercel.com](https://vercel.com)
2. Installer Vercel CLI :
```bash
npm i -g vercel
```

3. Déployer le projet :
```bash
vercel
```

### Étape 3 : Configuration d'Environnement

Ajouter les variables d'environnement dans Vercel Dashboard :

```env
NODE_ENV=production
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

### Étape 4 : Domaine Personnalisé

1. Aller dans Project Settings → Domains
2. Ajouter votre domaine personnalisé
3. Configurer les DNS records selon les instructions Vercel

## 🖥️ Option 2 : Déploiement sur VPS (Nginx + Node.js)

### Étape 1 : Préparation du Serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer pnpm
npm install -g pnpm

# Installer Nginx
sudo apt install -y nginx

# Installer Certbot pour SSL
sudo apt install -y certbot python3-certbot-nginx
```

### Étape 2 : Cloner et Configurer le Projet

```bash
# Créer un répertoire pour l'application
mkdir -p /var/www/somatisme
cd /var/www/somatisme

# Cloner le repository
git clone <your-repo-url> .

# Installer les dépendances
pnpm install

# Builder l'application
pnpm build
```

### Étape 3 : Configurer Nginx

Créer `/etc/nginx/sites-available/somatisme` :

```nginx
upstream somatisme {
    server localhost:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name somatisme.com www.somatisme.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name somatisme.com www.somatisme.com;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/somatisme.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/somatisme.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    gzip_min_length 1024;

    # Proxy Configuration
    location / {
        proxy_pass http://somatisme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }
}
```

Activer la configuration :

```bash
sudo ln -s /etc/nginx/sites-available/somatisme /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Étape 4 : Configurer SSL avec Certbot

```bash
sudo certbot certonly --nginx -d somatisme.com -d www.somatisme.com
```

### Étape 5 : Configurer PM2 pour Node.js

```bash
# Installer PM2 globalement
sudo npm install -g pm2

# Créer un fichier de configuration PM2
cat > /var/www/somatisme/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'somatisme',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
EOF

# Démarrer l'application avec PM2
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
```

### Étape 6 : Configuration du Firewall

```bash
# Activer UFW
sudo ufw enable

# Autoriser SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## 🔍 Vérifications Post-Déploiement

### 1. Vérifier les Headers de Sécurité

```bash
curl -I https://somatisme.com
```

Vérifier la présence de :
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`

### 2. Tester la Performance

- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

Objectifs :
- Lighthouse Score: 90+
- FCP: < 1.8s
- LCP: < 2.5s
- CLS: < 0.1

### 3. Vérifier le SEO

- [Google Search Console](https://search.google.com/search-console)
- Soumettre le sitemap.xml
- Vérifier les erreurs d'indexation

### 4. Tester la Sécurité

- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [Security Headers](https://securityheaders.com/)
- [OWASP ZAP](https://www.zaproxy.org/)

## 📊 Monitoring & Maintenance

### Logs

```bash
# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs PM2
pm2 logs somatisme
```

### Mise à Jour

```bash
# Mettre à jour les dépendances
pnpm update

# Rebuilder et redéployer
pnpm build
pm2 restart somatisme
```

### Backup

```bash
# Backup automatique quotidien
0 2 * * * tar -czf /backups/somatisme-$(date +\%Y\%m\%d).tar.gz /var/www/somatisme
```

## 🆘 Troubleshooting

### Port 3000 déjà utilisé

```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 <PID>
```

### Nginx ne démarre pas

```bash
# Vérifier la configuration
sudo nginx -t

# Voir les erreurs
sudo systemctl status nginx
```

### SSL Certificate expiré

```bash
# Renouveler le certificat
sudo certbot renew

# Tester le renouvellement automatique
sudo certbot renew --dry-run
```

## 📞 Support

Pour toute question ou problème :
- 📧 Email : info@somatisme.ma
- 📱 Téléphone : 05 23 30 28 29
- 🌐 Site : https://somatisme.com

---

**Dernière mise à jour** : 18 Avril 2026
