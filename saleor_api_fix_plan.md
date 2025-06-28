# Saleor API Failed Operations Fix Plan

## Overview
This plan addresses the 5 failed operations from the Saleor API test execution:
1. Customer creation (admin) - Authentication required
2. Warehouse/outlet queries - Authentication required  
3. Order listing - Authentication required
4. Channels listing - Authentication required
5. Checkout completion - Missing billing address

## Root Cause Analysis

### Authentication Issues (Operations 1-4)
- **Problem**: Admin operations require authenticated API access
- **Missing**: Valid authentication token with proper permissions
- **Impact**: Cannot perform backend management operations

### Checkout Completion Issue (Operation 5)
- **Problem**: Billing address not set before checkout completion
- **Missing**: Proper address assignment to checkout
- **Impact**: Cannot convert checkout to order

## Fix Implementation Plan

### Phase 1: Authentication Setup

#### 1.1 Research Authentication Methods
**Options Available:**
- **Staff User Token**: Dashboard-generated admin token
- **App Authentication**: OAuth-based app credentials
- **Service Account**: API-only authentication

#### 1.2 Obtain Authentication Credentials

**Important Note**: This Saleor Cloud instance has API password protection (Basic Auth) enabled as an additional security layer. This creates a dual-authentication requirement.

**Method 1: Cloud Instance Basic Auth (Required for ALL requests)**
- Username: admin
- Password: admin
- Header: `Authorization: Basic YWRtaW46YWRtaW4=`
- Purpose: Access protection for the Cloud instance

**Method 2: User Token Authentication (For authenticated operations)**
Generate JWT tokens using the tokenCreate mutation:
```graphql
mutation {
  tokenCreate(email: "user@example.com", password: "password") {
    token
    refreshToken
    user {
      id
      email
      isStaff
    }
    errors {
      field
      message
    }
  }
}
```

**Method 3: App Authentication (Recommended for Production)**
Long-living tokens for server-to-server communication:
1. Create app in Dashboard: Apps > Create App
2. Assign necessary permissions
3. Use generated app token
4. App tokens bypass user session limitations

**Authentication Conflict Resolution**:
Since Basic Auth and Bearer tokens both use the Authorization header, solutions include:
1. **Proxy Server**: Handle dual authentication server-side
2. **Disable Basic Auth**: Contact Saleor support to remove Cloud protection
3. **Use Cookies**: Send user token as cookie instead of header

#### 1.3 Test Authentication
```graphql
# Test query with authentication header
query {
  me {
    id
    email
    firstName
    lastName
    permissions {
      code
      name
    }
  }
}
```

### Phase 2: Fix Specific Operations

**Note**: Due to the authentication header conflict, use one of these approaches:

#### Approach A: Proxy Server Solution
```javascript
// proxy-server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.post('/graphql', async (req, res) => {
  const isAdminOp = req.headers['x-requires-auth'] === 'true';
  const userToken = req.headers['x-user-token'];
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': isAdminOp && userToken 
      ? `Bearer ${userToken}`
      : `Basic ${Buffer.from('admin:admin').toString('base64')}`
  };
  
  try {
    const response = await axios.post(
      'https://store-4bpwsmd6.saleor.cloud/graphql/',
      req.body,
      { headers }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

app.listen(3000);
```

#### Approach B: Cookie-Based Authentication
```bash
# Send user token as cookie instead of Authorization header
curl -X POST \
  -H "Content-Type: application/json" \
  -u "admin:admin" \
  -H "Cookie: authToken=YOUR_USER_TOKEN" \
  -d '{
    "query": "mutation { customerCreate(input: { firstName: \"John\", lastName: \"Doe\", email: \"john.doe@test.com\" }) { user { id email firstName lastName } errors { field message } } }"
  }' \
  https://store-4bpwsmd6.saleor.cloud/graphql/
```

#### 2.1 Customer Creation (Admin)
**Proxy Implementation:**
```bash
# Using proxy server
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Requires-Auth: true" \
  -H "X-User-Token: YOUR_ADMIN_TOKEN" \
  -d '{
    "query": "mutation { customerCreate(input: { firstName: \"John\", lastName: \"Doe\", email: \"john.doe@test.com\" }) { user { id email firstName lastName } errors { field message } } }"
  }' \
  http://localhost:3000/graphql
```

#### 2.2 Warehouse/Outlet Queries
**Direct Implementation (if Basic Auth disabled):**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "query": "query { warehouses(first: 5) { edges { node { id name slug email address { streetAddress1 city country { country } } } } } }"
  }' \
  https://store-4bpwsmd6.saleor.cloud/graphql/
```

#### 2.3 Order Listing
**Fixed Implementation:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "query": "query { orders(first: 5, channel: \"default-channel\") { edges { node { id number status total { gross { amount currency } } user { email } } } } }"
  }' \
  https://store-4bpwsmd6.saleor.cloud/graphql/
```

#### 2.4 Channels Listing
**Fixed Implementation:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "query": "query { channels { id name slug currencyCode } }"
  }' \
  https://store-4bpwsmd6.saleor.cloud/graphql/
```

#### 2.5 Checkout Completion with Billing Address
**Fixed Implementation:**

**Step 1: Add Billing Address to Existing Checkout**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { checkoutBillingAddressUpdate(checkoutId: \"YOUR_CHECKOUT_ID\", billingAddress: { firstName: \"John\", lastName: \"Doe\", streetAddress1: \"123 Main St\", city: \"New York\", postalCode: \"10001\", country: \"US\" }) { checkout { id billingAddress { firstName lastName streetAddress1 } } errors { field message } } }"
  }' \
  https://store-4bpwsmd6.saleor.cloud/graphql/
```

**Step 2: Complete Checkout**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { checkoutComplete(checkoutId: \"YOUR_CHECKOUT_ID\") { order { id number status total { gross { amount currency } } } errors { field message } } }"
  }' \
  https://store-4bpwsmd6.saleor.cloud/graphql/
```

**Alternative: Create Checkout with Billing Address**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { checkoutCreate(input: { channel: \"default-channel\", email: \"test@example.com\", lines: [{ quantity: 1, variantId: \"UHJvZHVjdFZhcmlhbnQ6Mzc2\" }], billingAddress: { firstName: \"John\", lastName: \"Doe\", streetAddress1: \"123 Main St\", city: \"New York\", postalCode: \"10001\", country: \"US\" } }) { checkout { id email totalPrice { gross { amount currency } } billingAddress { firstName lastName } } errors { field message } } }"
  }' \
  https://store-4bpwsmd6.saleor.cloud/graphql/
```

### Phase 3: Validation and Testing

#### 3.1 Authentication Validation Script
```bash
#!/bin/bash
# validate_auth.sh

TOKEN="YOUR_ADMIN_TOKEN"
ENDPOINT="https://store-4bpwsmd6.saleor.cloud/graphql/"

echo "Testing authentication..."
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "query { me { id email permissions { code } } }"}' \
  $ENDPOINT
```

#### 3.2 Complete Test Suite
```bash
#!/bin/bash
# run_fixed_tests.sh

TOKEN="YOUR_ADMIN_TOKEN"
ENDPOINT="https://store-4bpwsmd6.saleor.cloud/graphql/"

# Test 1: Customer Creation
echo "Testing customer creation..."
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "mutation { customerCreate(input: { firstName: \"Test\", lastName: \"Customer\", email: \"testcustomer@example.com\" }) { user { id email } errors { field message } } }"}' \
  $ENDPOINT

# Test 2: Warehouses
echo "Testing warehouse query..."
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "query { warehouses(first: 5) { edges { node { id name } } } }"}' \
  $ENDPOINT

# Test 3: Orders
echo "Testing orders query..."
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "query { orders(first: 5, channel: \"default-channel\") { edges { node { id number } } } }"}' \
  $ENDPOINT

# Test 4: Channels
echo "Testing channels query..."
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "query { channels { id name slug } }"}' \
  $ENDPOINT

# Test 5: Complete Checkout Flow
echo "Testing complete checkout with billing address..."
# Create checkout with billing address
CHECKOUT_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { checkoutCreate(input: { channel: \"default-channel\", email: \"checkout@example.com\", lines: [{ quantity: 1, variantId: \"UHJvZHVjdFZhcmlhbnQ6Mzc2\" }], billingAddress: { firstName: \"John\", lastName: \"Doe\", streetAddress1: \"123 Main St\", city: \"New York\", postalCode: \"10001\", country: \"US\" } }) { checkout { id } errors { field message } } }"}' \
  $ENDPOINT)

echo "Checkout creation response: $CHECKOUT_RESPONSE"

# Extract checkout ID and complete it
# Note: This would need JSON parsing in a real script
```

## Implementation Steps

### Step 1: Choose Authentication Strategy

#### Option 1: Request Basic Auth Removal (Recommended)
1. Contact Saleor Cloud support
2. Request removal of API password protection
3. Once removed, use standard Bearer token authentication

#### Option 2: Implement Proxy Server
1. Create Node.js proxy server (see code above)
2. Deploy proxy to handle dual authentication
3. Route all API calls through proxy

#### Option 3: Use App Tokens
1. Access Dashboard: `https://store-4bpwsmd6.saleor.cloud/dashboard/`
2. Navigate to Apps > Create App
3. Name: "F&B Admin API"
4. Permissions: Select all MANAGE_* permissions
5. Generate app token
6. Test if app tokens work with Basic Auth

### Step 2: Generate Authentication Tokens

#### For User Tokens:
```bash
# With Basic Auth enabled
curl -X POST \
  -H "Content-Type: application/json" \
  -u "admin:admin" \
  -d '{
    "query": "mutation { tokenCreate(email: \"staff@example.com\", password: \"password\") { token refreshToken errors { field message } } }"
  }' \
  https://store-4bpwsmd6.saleor.cloud/graphql/
```

#### For Token Refresh:
```graphql
mutation {
  tokenRefresh(refreshToken: "YOUR_REFRESH_TOKEN") {
    token
    errors {
      field
      message
    }
  }
}
```

### Step 3: Update API Implementation
1. Implement chosen authentication strategy
2. Fix checkout flow to include billing address with countryArea
3. Update test scripts with proper authentication

### Step 3: Validate All Operations
1. Run authentication test
2. Execute each fixed operation
3. Log results with timestamps
4. Update success metrics

### Step 4: Document Working Examples
1. Create comprehensive API examples
2. Include error handling
3. Provide production-ready code samples

## Expected Results After Fixes

### Before Fixes
- Total Tests: 9
- Passed: 4 ✅ (44%)
- Failed: 5 ❌ (56%)

### After Fixes (Expected)
- Total Tests: 9
- Passed: 9 ✅ (100%)
- Failed: 0 ❌ (0%)

## Production Considerations

### Security
- Store admin tokens securely (environment variables)
- Use app-based authentication for production
- Implement token rotation policies
- Log authentication attempts

### Error Handling
- Implement retry logic for token expiration
- Handle permission errors gracefully
- Validate input data before API calls
- Monitor API rate limits

### Performance
- Cache frequently accessed data (channels, categories)
- Implement efficient pagination for large datasets
- Use GraphQL query optimization
- Monitor API response times

## Monitoring and Maintenance

### Health Checks
- Regular authentication validation
- API endpoint availability monitoring
- Permission verification tests
- Token expiration tracking

### Documentation Updates
- Keep API examples current with Saleor versions
- Update authentication guides
- Maintain troubleshooting documentation
- Document permission requirements

## Next Steps
1. Execute this fix plan systematically
2. Update original test log with corrected results
3. Create production-ready API integration code
4. Implement proper error handling and logging
5. Set up monitoring for API operations

---

**Plan Created**: 2025-06-28 12:10:00 UTC
**Estimated Fix Time**: 2-4 hours
**Priority**: High - Required for F&B app backend operations