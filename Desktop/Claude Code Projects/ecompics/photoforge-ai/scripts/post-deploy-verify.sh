#!/bin/bash

# Post-Deployment Verification Script
# Run this after deploying to production to verify everything works

echo "🔍 PhotoForge AI - Post-Deployment Verification"
echo "=============================================="
echo ""

# Check if URL is provided
if [ -z "$1" ]; then
    echo "Usage: ./scripts/post-deploy-verify.sh <production-url>"
    echo "Example: ./scripts/post-deploy-verify.sh https://photoforge.vercel.app"
    exit 1
fi

URL=$1
# Remove trailing slash
URL=${URL%/}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0

# Check function
check_endpoint() {
    local endpoint=$1
    local expected_status=${2:-200}

    response=$(curl -s -o /dev/null -w "%{http_code}" "$URL$endpoint" --max-time 10)

    if [ "$response" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓${NC} $endpoint (HTTP $response)"
        ((PASS++))
        return 0
    else
        echo -e "${RED}✗${NC} $endpoint (HTTP $response, expected $expected_status)"
        ((FAIL++))
        return 1
    fi
}

check_json_field() {
    local endpoint=$1
    local field=$2
    local expected=$3

    response=$(curl -s "$URL$endpoint" --max-time 10)
    value=$(echo "$response" | grep -o "\"$field\":\"[^\"]*\"" | cut -d'"' -f4)

    if [ "$value" == "$expected" ]; then
        echo -e "${GREEN}✓${NC} $endpoint - $field: $value"
        ((PASS++))
        return 0
    else
        echo -e "${RED}✗${NC} $endpoint - $field: $value (expected $expected)"
        ((FAIL++))
        return 1
    fi
}

echo "Testing URL: $URL"
echo ""

# 1. Basic connectivity
echo "1. Testing basic connectivity..."
check_endpoint "/" 200
check_endpoint "/api/health" 200
echo ""

# 2. Health checks
echo "2. Testing health check endpoints..."
check_json_field "/api/health" "status" "healthy"
check_json_field "/api/health/db" "status" "healthy"
check_json_field "/api/health/redis" "status" "healthy"
echo ""

# 3. Public pages
echo "3. Testing public pages..."
check_endpoint "/" 200
check_endpoint "/pricing" 200
check_endpoint "/auth/signin" 200
check_endpoint "/auth/signup" 200
echo ""

# 4. Protected pages (should redirect to signin)
echo "4. Testing protected pages (should redirect)..."
check_endpoint "/dashboard" 307
check_endpoint "/upload" 307
check_endpoint "/jobs" 307
check_endpoint "/billing" 307
check_endpoint "/settings" 307
echo ""

# 5. API endpoints
echo "5. Testing API endpoints..."
check_endpoint "/api/auth/csrf" 200
echo ""

# 6. Security headers
echo "6. Checking security headers..."
headers=$(curl -s -I "$URL" --max-time 10)

if echo "$headers" | grep -q "Strict-Transport-Security"; then
    echo -e "${GREEN}✓${NC} Strict-Transport-Security header present"
    ((PASS++))
else
    echo -e "${RED}✗${NC} Strict-Transport-Security header missing"
    ((FAIL++))
fi

if echo "$headers" | grep -q "X-Frame-Options"; then
    echo -e "${GREEN}✓${NC} X-Frame-Options header present"
    ((PASS++))
else
    echo -e "${RED}✗${NC} X-Frame-Options header missing"
    ((FAIL++))
fi

if echo "$headers" | grep -q "X-Content-Type-Options"; then
    echo -e "${GREEN}✓${NC} X-Content-Type-Options header present"
    ((PASS++))
else
    echo -e "${RED}✗${NC} X-Content-Type-Options header missing"
    ((FAIL++))
fi
echo ""

# 7. SSL/HTTPS check
echo "7. Checking SSL/HTTPS..."
if [[ $URL == https://* ]]; then
    echo -e "${GREEN}✓${NC} Using HTTPS"
    ((PASS++))

    # Check SSL certificate
    domain=$(echo "$URL" | sed -e 's|^https://||' -e 's|/.*||')
    expiry=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)

    if [ -n "$expiry" ]; then
        echo -e "${GREEN}✓${NC} SSL certificate expires: $expiry"
        ((PASS++))
    else
        echo -e "${YELLOW}⚠${NC} Could not check SSL certificate expiry"
    fi
else
    echo -e "${RED}✗${NC} NOT using HTTPS - this is required for production!"
    ((FAIL++))
fi
echo ""

# 8. Response time check
echo "8. Checking response times..."
start_time=$(date +%s%N)
curl -s "$URL" > /dev/null
end_time=$(date +%s%N)
response_time=$(( (end_time - start_time) / 1000000 ))

if [ $response_time -lt 2000 ]; then
    echo -e "${GREEN}✓${NC} Response time: ${response_time}ms (excellent)"
    ((PASS++))
elif [ $response_time -lt 5000 ]; then
    echo -e "${GREEN}✓${NC} Response time: ${response_time}ms (good)"
    ((PASS++))
else
    echo -e "${YELLOW}⚠${NC} Response time: ${response_time}ms (slow)"
fi
echo ""

# Summary
echo "=============================================="
echo "Summary:"
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Your application is live and healthy.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Test user signup and login"
    echo "  2. Test Stripe payment flow"
    echo "  3. Test image upload and processing"
    echo "  4. Set up monitoring alerts"
    echo "  5. Share with first users!"
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Review and fix issues.${NC}"
    echo ""
    echo "Common issues:"
    echo "  - Database not migrated: Run 'npx prisma migrate deploy'"
    echo "  - Redis not connected: Check REDIS_URL"
    echo "  - Environment variables missing: Check Vercel settings"
    exit 1
fi
