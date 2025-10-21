#!/bin/bash

# Pre-Deployment Checklist Script
# Run this before deploying to production

echo "🚀 PhotoForge AI - Pre-Deployment Checklist"
echo "==========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0
WARN=0

# Check function
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAIL++))
    fi
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARN++))
}

# 1. Check if required files exist
echo "1. Checking project structure..."
[ -f "package.json" ] && check "package.json exists" || check "package.json exists"
[ -f "prisma/schema.prisma" ] && check "Prisma schema exists" || check "Prisma schema exists"
[ -f ".env.example" ] && check ".env.example exists" || check ".env.example exists"
[ -f "next.config.js" ] && check "next.config.js exists" || check "next.config.js exists"
echo ""

# 2. Check for sensitive files in git
echo "2. Checking for sensitive files..."
if git check-ignore .env .env.local .env.production > /dev/null 2>&1; then
    check "Sensitive files are gitignored"
else
    warn "Ensure .env files are in .gitignore"
fi

if git ls-files | grep -q "\.env$\|\.env\.local$\|\.env\.production$"; then
    warn "WARNING: .env files found in git! Remove them immediately!"
else
    check "No .env files committed to git"
fi
echo ""

# 3. Check dependencies
echo "3. Checking dependencies..."
if [ -d "node_modules" ]; then
    check "node_modules exists"
else
    warn "node_modules not found - run 'npm install'"
fi

npm outdated > /dev/null 2>&1
if [ $? -eq 0 ]; then
    check "All dependencies up to date"
else
    warn "Some dependencies are outdated - run 'npm outdated' to review"
fi

# 4. Security audit
echo "4. Running security audit..."
npm audit --production > /dev/null 2>&1
if [ $? -eq 0 ]; then
    check "No vulnerabilities found"
else
    warn "Vulnerabilities detected - run 'npm audit' to review"
fi
echo ""

# 5. TypeScript check
echo "5. Running TypeScript check..."
npm run type-check > /dev/null 2>&1
check "TypeScript type check"
echo ""

# 6. Build test
echo "6. Testing production build..."
npm run build > /dev/null 2>&1
check "Production build successful"
echo ""

# 7. Check environment variables
echo "7. Checking environment variables..."
required_vars=(
    "DATABASE_URL"
    "NEXTAUTH_SECRET"
    "NEXTAUTH_URL"
    "AWS_ACCESS_KEY_ID"
    "AWS_SECRET_ACCESS_KEY"
    "AWS_S3_BUCKET"
    "REDIS_URL"
    "STRIPE_SECRET_KEY"
    "STRIPE_WEBHOOK_SECRET"
    "GOOGLE_AI_API_KEY"
)

if [ -f ".env.local" ]; then
    for var in "${required_vars[@]}"; do
        if grep -q "^$var=" .env.local; then
            check "$var is set"
        else
            warn "$var is not set in .env.local"
        fi
    done
else
    warn ".env.local not found - create it from .env.example"
fi
echo ""

# 8. Database check
echo "8. Checking database..."
if command -v npx &> /dev/null; then
    npx prisma validate > /dev/null 2>&1
    check "Prisma schema is valid"
else
    warn "npx not found - cannot validate Prisma schema"
fi
echo ""

# 9. Check for console.logs and debugger
echo "9. Checking for debug statements..."
if git grep -n "console\\.log" -- '*.ts' '*.tsx' '*.js' '*.jsx' | grep -v "node_modules" > /dev/null 2>&1; then
    warn "console.log statements found - consider removing for production"
else
    check "No console.log statements found"
fi

if git grep -n "debugger" -- '*.ts' '*.tsx' '*.js' '*.jsx' | grep -v "node_modules" > /dev/null 2>&1; then
    warn "debugger statements found - remove before deploying"
else
    check "No debugger statements found"
fi
echo ""

# 10. Check git status
echo "10. Checking git status..."
if git diff-index --quiet HEAD --; then
    check "No uncommitted changes"
else
    warn "You have uncommitted changes"
fi

if git branch | grep -q "main\|master"; then
    check "On main/master branch"
else
    warn "Not on main/master branch"
fi
echo ""

# Summary
echo "==========================================="
echo "Summary:"
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${YELLOW}Warnings: $WARN${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ] && [ $WARN -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready to deploy.${NC}"
    exit 0
elif [ $FAIL -eq 0 ]; then
    echo -e "${YELLOW}⚠ Some warnings found. Review before deploying.${NC}"
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Fix issues before deploying.${NC}"
    exit 1
fi
