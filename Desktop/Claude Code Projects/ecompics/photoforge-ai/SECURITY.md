# Security Checklist for Production

This document outlines security best practices and configurations for deploying PhotoForge AI to production.

## Pre-Deployment Security Checklist

### Environment Variables & Secrets

- [ ] **Generate unique NEXTAUTH_SECRET** for production
  ```bash
  openssl rand -base64 32
  ```
- [ ] **Generate unique CRON_SECRET** for protected endpoints
  ```bash
  openssl rand -hex 32
  ```
- [ ] **Never commit** `.env`, `.env.local`, or `.env.production` to version control
- [ ] **Use production keys** for all services (not test/development keys)
- [ ] **Rotate secrets** regularly (quarterly recommended)
- [ ] **Store secrets securely** in hosting platform's secret management (Vercel Secrets, AWS Secrets Manager, etc.)

### Database Security

- [ ] **Enable SSL/TLS** for database connections (`?sslmode=require` in DATABASE_URL)
- [ ] **Use strong passwords** (minimum 20 characters, alphanumeric + special chars)
- [ ] **Restrict IP access** to database (whitelist only application servers)
- [ ] **Enable connection pooling** to prevent connection exhaustion attacks
- [ ] **Regular backups** (automated daily backups recommended)
- [ ] **Encrypt backups** before storage
- [ ] **Test backup restoration** monthly

### Redis Security

- [ ] **Enable authentication** (requirepass in Redis config)
- [ ] **Use TLS/SSL** for Redis connections
- [ ] **Restrict network access** (firewall rules, VPC)
- [ ] **Disable dangerous commands** (`CONFIG`, `FLUSHALL`, etc.)
- [ ] **Monitor memory usage** to prevent DoS

### API Security

- [ ] **Rate limiting implemented** on all public API routes
  - Default: 100 requests/minute per IP
  - Auth endpoints: 5 requests/minute
  - Upload endpoints: 10 requests/5 minutes
- [ ] **CORS configured** properly (whitelist specific origins)
- [ ] **Authentication required** for protected routes
- [ ] **Input validation** on all user inputs (Zod schemas)
- [ ] **Sanitize file uploads** (validate file types, scan for malware)
- [ ] **Maximum upload size** enforced (10MB recommended)

### Payment Security (Stripe)

- [ ] **Use live keys** (not test keys)
- [ ] **Verify webhook signatures** (STRIPE_WEBHOOK_SECRET)
- [ ] **Validate amounts** server-side (never trust client)
- [ ] **Log all transactions** for audit trail
- [ ] **Handle failed payments** gracefully
- [ ] **PCI compliance** (let Stripe handle card data, never store cards)

### Authentication Security

- [ ] **OAuth redirect URIs** restricted to production domain only
- [ ] **Session timeout** configured (default: 30 days, adjust as needed)
- [ ] **HTTPS enforced** on all pages
- [ ] **HttpOnly cookies** enabled for session tokens
- [ ] **Secure cookies** enabled in production
- [ ] **SameSite cookies** set to Lax or Strict
- [ ] **Password requirements** enforced (8+ chars, complexity)
- [ ] **bcrypt rounds** set to 12+ for password hashing

### AWS S3 Security

- [ ] **Bucket not publicly listable** (disable public list access)
- [ ] **Public read** only for `processed/` folder
- [ ] **Private uploads** folder (pre-signed URLs for access)
- [ ] **CORS configured** to allow only your domain
- [ ] **IAM user** with minimal permissions (S3 only, specific bucket)
- [ ] **Enable versioning** to prevent accidental deletion
- [ ] **Enable logging** for security audit
- [ ] **Block public access** settings reviewed

### Application Security Headers

All configured in `next.config.js`:

- [x] **Strict-Transport-Security** - Enforces HTTPS
- [x] **X-Frame-Options** - Prevents clickjacking
- [x] **X-Content-Type-Options** - Prevents MIME sniffing
- [x] **X-XSS-Protection** - Legacy XSS protection
- [x] **Referrer-Policy** - Controls referrer information
- [x] **Permissions-Policy** - Restricts browser features
- [x] **Content-Security-Policy** - (Optional but recommended)

### Monitoring & Logging

- [ ] **Error tracking** enabled (Sentry recommended)
- [ ] **Uptime monitoring** configured (UptimeRobot, Pingdom)
- [ ] **Log aggregation** set up (Datadog, Logtail)
- [ ] **Alert on critical errors**:
  - Database connection failures
  - Payment failures
  - Worker crashes
  - High error rates (>1%)
- [ ] **Monitor for suspicious activity**:
  - Multiple failed login attempts
  - Unusual API usage patterns
  - Spike in errors
- [ ] **Do NOT log sensitive data**:
  - Passwords
  - API keys
  - Credit card numbers
  - Session tokens
  - Personal information (PII)

### Code Security

- [ ] **Dependencies up to date** (`npm audit` clean)
- [ ] **No critical vulnerabilities** in dependencies
- [ ] **SQL injection prevented** (use Prisma ORM, never raw SQL with user input)
- [ ] **XSS prevented** (React auto-escapes, validate all user input)
- [ ] **CSRF tokens** implemented for state-changing operations
- [ ] **File upload validation**:
  - File type whitelisting (images only)
  - File size limits (10MB max)
  - Filename sanitization
  - Content-type verification
- [ ] **No secrets in code** (use environment variables)
- [ ] **Error messages** don't expose sensitive info
  - Production: Generic error messages
  - Development: Detailed errors

### Infrastructure Security

- [ ] **HTTPS/SSL certificate** installed and valid
- [ ] **SSL Labs A+ rating**: https://www.ssllabs.com/ssltest/
- [ ] **Firewall rules** configured (block unnecessary ports)
- [ ] **DDoS protection** enabled (Cloudflare, AWS Shield)
- [ ] **CDN configured** for static assets
- [ ] **Auto-scaling** configured for high load
- [ ] **Separate environments** (production, staging, development)
- [ ] **Production database** isolated from dev/staging

## Security Best Practices

### Regular Security Audits

**Weekly:**
- Review error logs for suspicious patterns
- Check failed login attempts
- Monitor API usage for anomalies

**Monthly:**
- Run `npm audit` and fix vulnerabilities
- Review access logs
- Test backup restoration
- Review user permissions

**Quarterly:**
- Full security audit
- Penetration testing (if budget allows)
- Update all dependencies
- Rotate API keys and secrets
- Review and update security policies

### Incident Response Plan

If a security breach occurs:

1. **Immediate Actions:**
   - Isolate affected systems
   - Revoke compromised credentials
   - Block malicious IPs
   - Alert team members

2. **Investigation:**
   - Review logs to determine scope
   - Identify attack vector
   - Document timeline

3. **Remediation:**
   - Fix vulnerability
   - Deploy patches
   - Reset affected user credentials
   - Notify affected users (if required by law)

4. **Post-Mortem:**
   - Document incident
   - Update security procedures
   - Implement preventive measures

### OWASP Top 10 Coverage

- [x] **A01: Broken Access Control** - NextAuth, session validation
- [x] **A02: Cryptographic Failures** - HTTPS, bcrypt, secure cookies
- [x] **A03: Injection** - Prisma ORM, input validation
- [x] **A04: Insecure Design** - Rate limiting, security headers
- [x] **A05: Security Misconfiguration** - This checklist
- [x] **A06: Vulnerable Components** - npm audit, dependency updates
- [x] **A07: Identification/Auth Failures** - NextAuth, strong passwords
- [x] **A08: Software/Data Integrity** - Webhook signature verification
- [x] **A09: Security Logging** - Sentry, access logs
- [x] **A10: SSRF** - Input validation on URLs

## Compliance Considerations

### GDPR (if serving EU users)

- [ ] **Privacy policy** published
- [ ] **Terms of service** published
- [ ] **Cookie consent** implemented
- [ ] **Data export** functionality
- [ ] **Account deletion** functionality
- [ ] **Data retention policy** defined
- [ ] **DPA agreements** with third-party processors (Stripe, AWS, etc.)

### PCI DSS (payment processing)

- [ ] **Never store** credit card numbers
- [ ] **Use Stripe.js** for card collection (client-side)
- [ ] **SAQ A** questionnaire completed (if using Stripe Checkout)
- [ ] **SSL/TLS** enforced

### SOC 2 (for enterprise customers)

- [ ] **Access controls** documented
- [ ] **Audit logging** enabled
- [ ] **Incident response** plan documented
- [ ] **Vendor management** process

## Security Tools & Resources

### Automated Security Scanning

```bash
# Dependency vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Security headers test
curl -I https://yourdomain.com | grep -E '(Strict|X-Frame|X-Content|X-XSS)'

# SSL test
nmap --script ssl-enum-ciphers -p 443 yourdomain.com
```

### Recommended Services

- **Snyk** - Automated dependency scanning
- **GitHub Dependabot** - Automatic PR for dependency updates
- **Sentry** - Error tracking and monitoring
- **Cloudflare** - DDoS protection, WAF
- **UptimeRobot** - Uptime monitoring
- **SSL Labs** - SSL configuration testing

## Contact

For security concerns or to report vulnerabilities:
- Email: security@yourdomain.com
- Bug Bounty: (if applicable)

**Last Updated:** 2025-01-21
**Version:** 1.0.0
