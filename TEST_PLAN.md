# LocalFood App - Test Plan

## Overview
This document outlines the comprehensive testing strategy for the LocalFood F&B ordering application built with React Native and Saleor Cloud integration.

**Project**: LocalFood App  
**Platform**: React Native (iOS/Android)  
**Backend**: Saleor Cloud GraphQL API  
**Endpoint**: `https://store-4bpwsmd6.saleor.cloud/graphql/`  
**Created**: 2025-06-28

---

## Testing Strategy

### Test Types
1. **Unit Tests** - Individual component and function testing
2. **Integration Tests** - API integration and service testing
3. **End-to-End Tests** - Complete user journey testing
4. **Performance Tests** - Load times and responsiveness
5. **Security Tests** - Authentication and data protection
6. **Usability Tests** - User experience validation

### Test Environments
- **Development** - Local development testing
- **Staging** - Pre-production testing
- **Production** - Live environment testing

---

## Phase 1: Foundation Testing

### 1.1 Project Setup Verification

#### Test Case: TS001 - Project Structure
**Objective**: Verify project structure and dependencies  
**Priority**: High  
**Type**: Unit Test

**Pre-conditions**:
- LocalFoodApp project exists
- Dependencies installed

**Test Steps**:
1. Navigate to `/home/hek/localfood/LocalFoodApp/`
2. Verify folder structure exists:
   ```
   src/
   ├── components/
   ├── screens/
   ├── navigation/
   ├── services/
   ├── store/
   ├── types/
   └── hooks/
   ```
3. Check package.json dependencies
4. Run `npm install` and verify no errors

**Expected Results**:
- All folders exist as specified
- Dependencies install without errors
- TypeScript compilation successful

**Commands to Run**:
```bash
cd /home/hek/localfood/LocalFoodApp
ls -la src/
npm install
npx tsc --noEmit
```

---

#### Test Case: TS002 - TypeScript Compilation
**Objective**: Ensure all TypeScript files compile without errors  
**Priority**: High  
**Type**: Unit Test

**Test Steps**:
1. Run TypeScript compiler check
2. Verify no compilation errors
3. Check type definitions are properly imported

**Expected Results**:
- Zero TypeScript errors
- All imports resolve correctly

**Commands to Run**:
```bash
npx tsc --noEmit
```

---

### 1.2 Apollo Client Configuration Testing

#### Test Case: TS003 - GraphQL Client Setup
**Objective**: Verify Apollo Client connects to Saleor API  
**Priority**: High  
**Type**: Integration Test

**Pre-conditions**:
- Internet connection available
- Saleor endpoint accessible

**Test Steps**:
1. Import Apollo client configuration
2. Test basic GraphQL query execution
3. Verify authentication headers are set
4. Test error handling

**Expected Results**:
- Client connects to Saleor endpoint
- Queries execute successfully
- Error handling works properly

**Manual Test Code**:
```typescript
// Create test file: __tests__/apollo.test.ts
import { client } from '../src/services/apollo';
import { gql } from '@apollo/client';

const TEST_QUERY = gql`
  query {
    shop {
      name
      description
    }
  }
`;

test('Apollo client connects to Saleor', async () => {
  const result = await client.query({
    query: TEST_QUERY
  });
  expect(result.data).toBeDefined();
  expect(result.data.shop).toBeDefined();
});
```

---

### 1.3 Authentication Service Testing

#### Test Case: TS004 - Authentication Functions
**Objective**: Test all authentication service functions  
**Priority**: High  
**Type**: Unit Test

**Test Steps**:
1. Test token storage functions
2. Test login function (with mock data)
3. Test logout function
4. Test getCurrentUser function
5. Verify error handling

**Expected Results**:
- All functions execute without errors
- Token storage/retrieval works
- Error cases handled properly

**Test Implementation**:
```typescript
// __tests__/auth.test.ts
import { saveAuthToken, removeAuthToken, getAuthToken } from '../src/services/apollo';

describe('Authentication Service', () => {
  test('Token storage functions', async () => {
    const testToken = 'test-jwt-token';
    
    await saveAuthToken(testToken);
    const retrieved = await getAuthToken();
    expect(retrieved).toBe(testToken);
    
    await removeAuthToken();
    const removed = await getAuthToken();
    expect(removed).toBeNull();
  });
});
```

---

### 1.4 Navigation Testing

#### Test Case: TS005 - Navigation Structure
**Objective**: Verify navigation system works correctly  
**Priority**: High  
**Type**: Integration Test

**Test Steps**:
1. Test navigation to each screen
2. Verify back navigation works
3. Test deep linking (if implemented)
4. Check navigation parameters passing

**Expected Results**:
- All screens accessible via navigation
- Back navigation functions correctly
- Parameters pass between screens

**Manual Testing Checklist**:
- [ ] Home → Login navigation
- [ ] Home → Register navigation
- [ ] Home → ProductList navigation
- [ ] Home → Cart navigation
- [ ] ProductList → ProductDetail navigation
- [ ] Cart → Checkout navigation
- [ ] Back button functionality
- [ ] Header navigation styling

---

## Phase 2: Core Features Testing

### 2.1 Authentication Flow Testing

#### Test Case: TS006 - User Registration
**Objective**: Test complete user registration flow  
**Priority**: High  
**Type**: End-to-End Test

**Pre-conditions**:
- App running on device/simulator
- Valid email address available

**Test Steps**:
1. Navigate to Register screen
2. Fill in registration form:
   - Email: `test+${timestamp}@example.com`
   - Password: `TestPass123!`
   - First Name: `Test`
   - Last Name: `User`
3. Submit registration
4. Verify success response
5. Check automatic login

**Expected Results**:
- Registration successful
- User automatically logged in
- Token stored locally
- Navigation to appropriate screen

**Acceptance Criteria**:
- ✅ Form validation works
- ✅ Network request succeeds
- ✅ Error handling displays properly
- ✅ Success flow completes

---

#### Test Case: TS007 - User Login
**Objective**: Test user login functionality  
**Priority**: High  
**Type**: End-to-End Test

**Pre-conditions**:
- Registered user account exists
- Valid credentials available

**Test Steps**:
1. Navigate to Login screen
2. Enter valid credentials:
   - Email: `test@example.com`
   - Password: `TestPass123!`
3. Submit login form
4. Verify authentication success
5. Check token storage
6. Verify navigation to home screen

**Expected Results**:
- Login successful
- JWT token received and stored
- User redirected to main app
- Authenticated state maintained

**Error Test Cases**:
- Invalid email format
- Wrong password
- Non-existent user
- Network connectivity issues

---

#### Test Case: TS008 - Logout Functionality
**Objective**: Test user logout process  
**Priority**: Medium  
**Type**: End-to-End Test

**Test Steps**:
1. Ensure user is logged in
2. Navigate to Profile screen
3. Trigger logout action
4. Verify token removal
5. Check navigation to login screen
6. Verify protected screens inaccessible

**Expected Results**:
- Token removed from storage
- Apollo cache cleared
- User redirected to login
- Protected content not accessible

---

### 2.2 Product Catalog Testing

#### Test Case: TS009 - Product List Display
**Objective**: Test product catalog functionality  
**Priority**: High  
**Type**: Integration Test

**Pre-conditions**:
- Products exist in Saleor backend
- Network connection available

**Test Steps**:
1. Navigate to ProductList screen
2. Verify products load from Saleor API
3. Check product information display:
   - Product name
   - Price
   - Image (if available)
   - Category
4. Test loading states
5. Test error states

**Expected Results**:
- Products fetch successfully
- Loading indicators show appropriately
- Product data displays correctly
- Error handling works

**GraphQL Query Test**:
```graphql
query GetProducts($first: Int, $channel: String!) {
  products(first: $first, channel: $channel) {
    edges {
      node {
        id
        name
        thumbnail { url }
        pricing {
          priceRange {
            start { gross { amount currency } }
          }
        }
      }
    }
  }
}
```

---

#### Test Case: TS010 - Product Detail View
**Objective**: Test individual product detail display  
**Priority**: Medium  
**Type**: Integration Test

**Test Steps**:
1. Navigate to ProductList screen
2. Select a specific product
3. Verify navigation to ProductDetail screen
4. Check product ID parameter passing
5. Verify detailed information display

**Expected Results**:
- Product detail screen loads
- Correct product information displayed
- Navigation parameters work correctly

---

### 2.3 Shopping Cart Testing

#### Test Case: TS011 - Add to Cart
**Objective**: Test adding products to shopping cart  
**Priority**: High  
**Type**: Integration Test

**Test Steps**:
1. Browse products
2. Select product and variant
3. Add item to cart
4. Verify cart state updates
5. Check cart item count
6. Navigate to cart screen
7. Verify item appears in cart

**Expected Results**:
- Item added to cart successfully
- Cart count updates
- Cart screen shows added items
- Price calculations correct

---

#### Test Case: TS012 - Cart Management
**Objective**: Test cart item management  
**Priority**: High  
**Type**: Integration Test

**Test Steps**:
1. Add multiple items to cart
2. Test quantity updates
3. Test item removal
4. Test cart clearing
5. Verify price recalculations

**Expected Results**:
- Quantity changes work correctly
- Items can be removed
- Price updates automatically
- Cart can be cleared

---

### 2.4 Checkout Process Testing

#### Test Case: TS013 - Checkout Flow
**Objective**: Test complete checkout process  
**Priority**: High  
**Type**: End-to-End Test

**Pre-conditions**:
- User logged in
- Items in cart
- Payment method configured

**Test Steps**:
1. Navigate to checkout
2. Enter shipping address
3. Select payment method
4. Review order details
5. Submit order
6. Verify order creation in Saleor
7. Check order confirmation

**Expected Results**:
- Checkout process completes
- Order created successfully
- Confirmation displayed
- Email notification sent (if configured)

---

## Phase 3: Performance Testing

### 3.1 Load Time Testing

#### Test Case: TS014 - App Launch Performance
**Objective**: Measure app startup time  
**Priority**: Medium  
**Type**: Performance Test

**Metrics to Measure**:
- Cold start time
- Warm start time
- Screen transition times
- API response times

**Acceptance Criteria**:
- App launch < 3 seconds
- Screen transitions < 500ms
- API calls < 2 seconds
- Smooth animations (60fps)

**Tools**:
- React Native Performance Monitor
- Flipper
- Chrome DevTools

---

### 3.2 Memory Usage Testing

#### Test Case: TS015 - Memory Management
**Objective**: Verify memory usage within acceptable limits  
**Priority**: Medium  
**Type**: Performance Test

**Test Steps**:
1. Monitor memory usage during app usage
2. Test for memory leaks
3. Check image loading efficiency
4. Verify garbage collection

**Acceptance Criteria**:
- Memory usage < 100MB for typical usage
- No memory leaks detected
- Images properly cached and released

---

## Phase 4: Security Testing

### 4.1 Authentication Security

#### Test Case: TS016 - Token Security
**Objective**: Verify secure token handling  
**Priority**: High  
**Type**: Security Test

**Test Steps**:
1. Verify tokens stored securely (AsyncStorage)
2. Test token expiration handling
3. Check secure HTTP headers
4. Verify no token leakage in logs

**Expected Results**:
- Tokens encrypted in storage
- Expired tokens handled gracefully
- HTTPS used for all API calls
- No sensitive data in logs

---

### 4.2 API Security

#### Test Case: TS017 - API Request Security
**Objective**: Test API security measures  
**Priority**: High  
**Type**: Security Test

**Test Steps**:
1. Verify HTTPS enforcement
2. Test authorization headers
3. Check input validation
4. Test rate limiting (if implemented)

**Expected Results**:
- All requests use HTTPS
- Proper authorization headers sent
- Invalid inputs rejected
- Rate limiting works

---

## Phase 5: Device Testing

### 5.1 Cross-Platform Testing

#### Test Case: TS018 - iOS Device Testing
**Objective**: Verify app functionality on iOS devices  
**Priority**: High  
**Type**: Device Test

**Test Devices**:
- iPhone 12/13/14 (iOS 15+)
- iPad (latest)
- Various screen sizes

**Test Areas**:
- UI rendering
- Navigation
- Touch interactions
- Performance

---

#### Test Case: TS019 - Android Device Testing
**Objective**: Verify app functionality on Android devices  
**Priority**: High  
**Type**: Device Test

**Test Devices**:
- Samsung Galaxy S21/S22
- Google Pixel 6/7
- Various Android versions (API 23+)

**Test Areas**:
- UI rendering
- Navigation
- Touch interactions
- Performance

---

## Test Execution Plan

### Testing Schedule

#### Week 1: Foundation Testing
- [ ] Project setup verification
- [ ] TypeScript compilation
- [ ] Apollo Client configuration
- [ ] Authentication services
- [ ] Navigation structure

#### Week 2: Core Features Testing
- [ ] User registration/login
- [ ] Product catalog
- [ ] Shopping cart
- [ ] Checkout process

#### Week 3: Performance & Security Testing
- [ ] Load time testing
- [ ] Memory usage testing
- [ ] Security testing
- [ ] Cross-platform testing

#### Week 4: User Acceptance Testing
- [ ] End-to-end user journeys
- [ ] Usability testing
- [ ] Bug fixes and retesting

---

## Test Data Requirements

### User Test Data
```json
{
  "testUsers": [
    {
      "email": "test1@localfood.app",
      "password": "TestPass123!",
      "firstName": "Test",
      "lastName": "User1"
    },
    {
      "email": "test2@localfood.app", 
      "password": "TestPass123!",
      "firstName": "Test",
      "lastName": "User2"
    }
  ]
}
```

### Product Test Data
- Minimum 10 products with different categories
- Products with and without images
- Various price ranges
- Different currencies (if supported)

---

## Automated Testing Setup

### Unit Tests Setup
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native

# Run unit tests
npm test

# Run with coverage
npm test -- --coverage
```

### E2E Tests Setup
```bash
# Install Detox for E2E testing
npm install --save-dev detox

# Configure Detox
npx detox init

# Run E2E tests
npx detox test
```

---

## Test Reporting

### Test Metrics to Track
- Test pass/fail rates
- Code coverage percentage
- Performance benchmarks
- Bug discovery rate
- User satisfaction scores

### Reporting Tools
- Jest coverage reports
- Detox test reports
- Performance profiling reports
- Manual testing checklists

---

## Risk Assessment

### High Risk Areas
1. **Saleor API Integration** - Network failures, API changes
2. **Payment Processing** - Security vulnerabilities
3. **Authentication** - Token management issues
4. **Performance** - Slow loading on older devices

### Mitigation Strategies
- Comprehensive error handling
- Offline capability planning
- Security audit
- Performance optimization

---

## Definition of Done

### Feature Complete Criteria
- [ ] All test cases pass
- [ ] Code coverage > 80%
- [ ] Performance metrics met
- [ ] Security requirements satisfied
- [ ] Cross-platform compatibility verified
- [ ] User acceptance criteria met

### Release Readiness
- [ ] All critical bugs resolved
- [ ] Performance benchmarks achieved
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] App store requirements met

---

## Test Environment Setup Commands

### Development Testing
```bash
# Start Metro bundler
npx react-native start

# Run on iOS simulator
npx react-native run-ios

# Run on Android emulator  
npx react-native run-android

# Run tests
npm test

# TypeScript check
npx tsc --noEmit
```

### Testing Checklist Template
```markdown
## Test Execution Checklist

### Pre-Testing Setup
- [ ] Test environment prepared
- [ ] Test data loaded
- [ ] Devices/simulators ready
- [ ] Network connectivity verified

### Test Execution
- [ ] Unit tests run and passed
- [ ] Integration tests completed
- [ ] E2E scenarios executed
- [ ] Performance tests run
- [ ] Security tests completed

### Post-Testing
- [ ] Results documented
- [ ] Bugs logged and triaged
- [ ] Test reports generated
- [ ] Next steps identified
```

This comprehensive test plan covers all aspects of the LocalFood app testing from foundation verification through production readiness.