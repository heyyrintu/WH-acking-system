# Deployment Guide

Deploy your Warehouse Capacity Calculator to production.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)

Vercel is the creator of Next.js and offers the best deployment experience.

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Connect GitHub repo (optional)
# - Configure project settings
# - Deploy!
```

**Deployment URL**: Your app will be live at `https://your-project.vercel.app`

**Automatic Features**:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Instant rollbacks
- ✅ Preview deployments for PRs
- ✅ Zero configuration

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod

# Or drag-and-drop the .next folder in Netlify UI
```

### Option 3: AWS (S3 + CloudFront)

```bash
# Build static export (modify next.config.js first)
npm run build
npm run export

# Upload 'out' folder to S3
aws s3 sync out/ s3://your-bucket-name --delete

# Configure CloudFront for CDN
```

### Option 4: Docker

```dockerfile
# Use provided Dockerfile
docker build -t warehouse-calculator .
docker run -p 3000:3000 warehouse-calculator
```

### Option 5: Traditional Server (PM2)

```bash
# Build for production
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "warehouse-calc" -- start

# Save PM2 config
pm2 save
pm2 startup
```

## 📋 Pre-Deployment Checklist

- [ ] Run tests: `npm test`
- [ ] Build successfully: `npm run build`
- [ ] Check for linting errors: `npm run lint`
- [ ] Test production build locally: `npm start`
- [ ] Review environment variables
- [ ] Update README with production URL
- [ ] Configure analytics (if desired)

## 🔧 Configuration for Production

### 1. Update next.config.js

```javascript
module.exports = {
  reactStrictMode: true,
  
  // Enable if deploying to subdirectory
  // basePath: '/warehouse-calculator',
  
  // Enable for better performance
  swcMinify: true,
  
  // Configure images (if using next/image)
  images: {
    domains: ['yourdomain.com'],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: 'https://your-domain.com',
  },
}
```

### 2. Environment Variables

Create `.env.production`:

```bash
NEXT_PUBLIC_APP_NAME="Warehouse Capacity Calculator"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_ENABLE_PDF_EXPORT=true
```

### 3. Add Google Analytics (Optional)

```javascript
// pages/_app.js
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>
      <Component {...pageProps} />
    </>
  )
}
```

## 🐳 Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t warehouse-calculator .
docker run -p 3000:3000 warehouse-calculator
```

## ⚙️ Server Requirements

### Minimum Requirements

- **CPU**: 1 core
- **RAM**: 512 MB
- **Storage**: 100 MB
- **Node.js**: 18.x or higher

### Recommended for Production

- **CPU**: 2 cores
- **RAM**: 2 GB
- **Storage**: 1 GB
- **Node.js**: 18.x LTS

## 🔒 Security Considerations

### 1. HTTPS Only

Ensure all production deployments use HTTPS:

```javascript
// middleware.js (optional)
export function middleware(request) {
  if (process.env.NODE_ENV === 'production' && 
      request.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}`,
      301
    )
  }
}
```

### 2. Security Headers

Add to `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}
```

### 3. Content Security Policy

```javascript
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self';
`

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          },
        ],
      },
    ]
  },
}
```

## 📊 Performance Optimization

### 1. Enable Compression

```javascript
// next.config.js
module.exports = {
  compress: true,
}
```

### 2. Image Optimization

```javascript
// Use next/image for images
import Image from 'next/image'

<Image src="/warehouse.jpg" width={500} height={300} alt="Warehouse" />
```

### 3. Code Splitting

Already enabled by default in Next.js!

### 4. Caching Strategy

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

## 🔍 Monitoring

### 1. Vercel Analytics

Built-in for Vercel deployments:

```javascript
// pages/_app.js
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

### 2. Custom Monitoring

```javascript
// lib/analytics.js
export function trackEvent(name, properties) {
  if (typeof window !== 'undefined') {
    // Send to your analytics service
    console.log('Event:', name, properties)
  }
}

// Usage in components
import { trackEvent } from '../lib/analytics'

function handleCalculation() {
  trackEvent('calculation_completed', {
    bayCount: results.bayCount,
    totalCBM: results.totalCBM,
  })
}
```

## 🚦 Health Checks

Create `pages/api/health.js`:

```javascript
export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📱 Mobile Optimization

Already responsive thanks to Tailwind CSS!

Test on:
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Tablet (iPad)
- [ ] Desktop browsers

## 🌐 Custom Domain

### Vercel

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS with provided records

### Netlify

1. Go to Domain Settings
2. Add custom domain
3. Update DNS records

## 📈 Scaling Considerations

For high-traffic scenarios:

1. **Enable CDN**: Use Cloudflare or similar
2. **Add caching**: Redis for API responses (if added)
3. **Load balancing**: Multiple server instances
4. **Database**: Not needed for this app (client-side only)

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Module Not Found

```bash
# Ensure all dependencies installed
npm install
```

### Out of Memory

```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## 📞 Support

For deployment issues:

1. Check build logs
2. Verify environment variables
3. Test locally first: `npm run build && npm start`
4. Check platform-specific docs (Vercel, Netlify, etc.)

---

**Deployment Checklist Summary**

- [ ] Tests pass
- [ ] Build succeeds
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Custom domain configured (if needed)
- [ ] Analytics setup (optional)
- [ ] Monitoring enabled
- [ ] Security headers added
- [ ] Performance optimized
- [ ] Mobile tested

🎉 **Ready to Deploy!**

**Recommended**: Deploy to Vercel for zero-config, optimal Next.js experience.

```bash
npx vercel --prod
```

Done! Your Warehouse Capacity Calculator is now live! 🚀

