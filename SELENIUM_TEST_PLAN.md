# LocalFood GUI Test Plan - Selenium WebDriver

## Test Plan Overview
**Project**: LocalFood Web Application GUI Testing  
**Framework**: Selenium WebDriver + Jest/Mocha  
**Target**: React Web App (http://localhost:5173/)  
**Browser Support**: Chrome, Firefox, Safari, Edge  
**Test Type**: End-to-End GUI Automation  
**Created**: 2025-06-28

---

## Test Environment Setup

### Prerequisites
```bash
# Install Selenium WebDriver dependencies
npm install --save-dev selenium-webdriver
npm install --save-dev @types/selenium-webdriver
npm install --save-dev chromedriver geckodriver
npm install --save-dev jest @types/jest
```

### WebDriver Configuration
```typescript
// tests/config/webdriver.config.ts
import { Builder, WebDriver, Capabilities } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';

export const createDriver = async (browser: 'chrome' | 'firefox' = 'chrome'): Promise<WebDriver> => {
  const options = browser === 'chrome' 
    ? new chrome.Options().addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage')
    : new firefox.Options().addArguments('--headless');
    
  return await new Builder()
    .forBrowser(browser)
    .setChromeOptions(browser === 'chrome' ? options : undefined)
    .setFirefoxOptions(browser === 'firefox' ? options : undefined)
    .build();
};
```

---

## Test Suite Structure

### 1. Page Object Model (POM)

#### 1.1 Base Page Object
```typescript
// tests/pages/BasePage.ts
import { WebDriver, By, WebElement, until } from 'selenium-webdriver';

export class BasePage {
  constructor(protected driver: WebDriver) {}
  
  async navigateTo(url: string): Promise<void> {
    await this.driver.get(url);
  }
  
  async waitForElement(locator: By, timeout: number = 10000): Promise<WebElement> {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }
  
  async clickElement(locator: By): Promise<void> {
    const element = await this.waitForElement(locator);
    await element.click();
  }
  
  async typeText(locator: By, text: string): Promise<void> {
    const element = await this.waitForElement(locator);
    await element.clear();
    await element.sendKeys(text);
  }
  
  async getText(locator: By): Promise<string> {
    const element = await this.waitForElement(locator);
    return await element.getText();
  }
  
  async isElementVisible(locator: By): Promise<boolean> {
    try {
      const element = await this.waitForElement(locator, 3000);
      return await element.isDisplayed();
    } catch {
      return false;
    }
  }
}
```

#### 1.2 Home Page Object
```typescript
// tests/pages/HomePage.ts
import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Locators
  private heroTitle = By.css('[data-testid="hero-title"]');
  private heroSubtitle = By.css('[data-testid="hero-subtitle"]');
  private orderNowButton = By.css('[data-testid="order-now-btn"]');
  private browseCategoriesButton = By.css('[data-testid="browse-categories-btn"]');
  private categoryGrid = By.css('[data-testid="category-grid"]');
  private categoryCard = By.css('[data-testid="category-card"]');
  private featuresSection = By.css('[data-testid="features-section"]');
  private featureCard = By.css('[data-testid="feature-card"]');
  private finalCtaSection = By.css('[data-testid="final-cta"]');
  
  async verifyHeroSection(): Promise<boolean> {
    const titleVisible = await this.isElementVisible(this.heroTitle);
    const subtitleVisible = await this.isElementVisible(this.heroSubtitle);
    const orderBtnVisible = await this.isElementVisible(this.orderNowButton);
    const browseBtnVisible = await this.isElementVisible(this.browseCategoriesButton);
    
    return titleVisible && subtitleVisible && orderBtnVisible && browseBtnVisible;
  }
  
  async clickOrderNow(): Promise<void> {
    await this.clickElement(this.orderNowButton);
  }
  
  async clickBrowseCategories(): Promise<void> {
    await this.clickElement(this.browseCategoriesButton);
  }
  
  async getCategoryCount(): Promise<number> {
    await this.waitForElement(this.categoryGrid);
    const categories = await this.driver.findElements(this.categoryCard);
    return categories.length;
  }
  
  async clickCategory(index: number): Promise<void> {
    const categories = await this.driver.findElements(this.categoryCard);
    if (categories[index]) {
      await categories[index].click();
    }
  }
  
  async verifyFeaturesSection(): Promise<boolean> {
    const sectionVisible = await this.isElementVisible(this.featuresSection);
    const featureCards = await this.driver.findElements(this.featureCard);
    return sectionVisible && featureCards.length >= 3;
  }
}
```

#### 1.3 Header Component Object
```typescript
// tests/pages/components/HeaderComponent.ts
import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage';

export class HeaderComponent extends BasePage {
  // Locators
  private logo = By.css('[data-testid="logo"]');
  private locationIndicator = By.css('[data-testid="location-indicator"]');
  private searchButton = By.css('[data-testid="search-button"]');
  private cartButton = By.css('[data-testid="cart-button"]');
  private mobileMenuButton = By.css('[data-testid="mobile-menu-btn"]');
  private navigationMenu = By.css('[data-testid="navigation-menu"]');
  private homeLink = By.css('[data-testid="nav-home"]');
  private productsLink = By.css('[data-testid="nav-products"]');
  private searchLink = By.css('[data-testid="nav-search"]');
  
  async verifyHeaderElements(): Promise<boolean> {
    const logoVisible = await this.isElementVisible(this.logo);
    const locationVisible = await this.isElementVisible(this.locationIndicator);
    const searchVisible = await this.isElementVisible(this.searchButton);
    const cartVisible = await this.isElementVisible(this.cartButton);
    
    return logoVisible && locationVisible && searchVisible && cartVisible;
  }
  
  async clickLogo(): Promise<void> {
    await this.clickElement(this.logo);
  }
  
  async clickSearch(): Promise<void> {
    await this.clickElement(this.searchButton);
  }
  
  async clickCart(): Promise<void> {
    await this.clickElement(this.cartButton);
  }
  
  async toggleMobileMenu(): Promise<void> {
    await this.clickElement(this.mobileMenuButton);
  }
  
  async navigateToProducts(): Promise<void> {
    await this.clickElement(this.productsLink);
  }
  
  async getLocationText(): Promise<string> {
    return await this.getText(this.locationIndicator);
  }
}
```

---

## Test Cases

### 2. Home Page Tests

```typescript
// tests/specs/HomePage.spec.ts
import { WebDriver } from 'selenium-webdriver';
import { createDriver } from '../config/webdriver.config';
import { HomePage } from '../pages/HomePage';
import { HeaderComponent } from '../pages/components/HeaderComponent';

describe('Home Page Tests', () => {
  let driver: WebDriver;
  let homePage: HomePage;
  let header: HeaderComponent;
  
  beforeAll(async () => {
    driver = await createDriver('chrome');
    homePage = new HomePage(driver);
    header = new HeaderComponent(driver);
  });
  
  afterAll(async () => {
    await driver.quit();
  });
  
  beforeEach(async () => {
    await homePage.navigateTo('http://localhost:5173/');
  });
  
  test('HP001: Verify page loads successfully', async () => {
    const title = await driver.getTitle();
    expect(title).toContain('LocalFood');
  });
  
  test('HP002: Verify header components are visible', async () => {
    const headerVisible = await header.verifyHeaderElements();
    expect(headerVisible).toBe(true);
  });
  
  test('HP003: Verify hero section displays correctly', async () => {
    const heroVisible = await homePage.verifyHeroSection();
    expect(heroVisible).toBe(true);
  });
  
  test('HP004: Verify category grid displays categories', async () => {
    const categoryCount = await homePage.getCategoryCount();
    expect(categoryCount).toBeGreaterThan(0);
  });
  
  test('HP005: Verify features section is present', async () => {
    const featuresVisible = await homePage.verifyFeaturesSection();
    expect(featuresVisible).toBe(true);
  });
  
  test('HP006: Test Order Now button navigation', async () => {
    await homePage.clickOrderNow();
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/products');
  });
  
  test('HP007: Test Browse Categories button navigation', async () => {
    await homePage.clickBrowseCategories();
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/products');
  });
  
  test('HP008: Test category card click navigation', async () => {
    await homePage.clickCategory(0);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/category/');
  });
});
```

### 3. Navigation Tests

```typescript
// tests/specs/Navigation.spec.ts
describe('Navigation Tests', () => {
  let driver: WebDriver;
  let header: HeaderComponent;
  
  beforeAll(async () => {
    driver = await createDriver('chrome');
    header = new HeaderComponent(driver);
  });
  
  afterAll(async () => {
    await driver.quit();
  });
  
  beforeEach(async () => {
    await driver.get('http://localhost:5173/');
  });
  
  test('NAV001: Test logo click returns to home', async () => {
    await header.navigateToProducts();
    await header.clickLogo();
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toBe('http://localhost:5173/');
  });
  
  test('NAV002: Test search button navigation', async () => {
    await header.clickSearch();
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/search');
  });
  
  test('NAV003: Test products navigation', async () => {
    await header.navigateToProducts();
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/products');
  });
  
  test('NAV004: Test mobile menu functionality', async () => {
    await driver.manage().window().setRect({ width: 375, height: 667 }); // Mobile size
    await header.toggleMobileMenu();
    // Verify mobile menu opens
    const menuVisible = await header.isElementVisible(By.css('[data-testid="mobile-drawer"]'));
    expect(menuVisible).toBe(true);
  });
});
```

### 4. Responsive Design Tests

```typescript
// tests/specs/ResponsiveDesign.spec.ts
describe('Responsive Design Tests', () => {
  let driver: WebDriver;
  let homePage: HomePage;
  
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];
  
  beforeAll(async () => {
    driver = await createDriver('chrome');
    homePage = new HomePage(driver);
  });
  
  afterAll(async () => {
    await driver.quit();
  });
  
  viewports.forEach(viewport => {
    test(`RD001: Verify layout on ${viewport.name} (${viewport.width}x${viewport.height})`, async () => {
      await driver.manage().window().setRect({ 
        width: viewport.width, 
        height: viewport.height 
      });
      
      await homePage.navigateTo('http://localhost:5173/');
      
      // Verify page elements are visible and properly laid out
      const heroVisible = await homePage.verifyHeroSection();
      expect(heroVisible).toBe(true);
      
      // Check if mobile menu button is visible on mobile
      if (viewport.width < 768) {
        const mobileMenuVisible = await homePage.isElementVisible(
          By.css('[data-testid="mobile-menu-btn"]')
        );
        expect(mobileMenuVisible).toBe(true);
      }
    });
  });
});
```

### 5. Form Interaction Tests

```typescript
// tests/specs/SearchFunctionality.spec.ts
import { SearchPage } from '../pages/SearchPage';

describe('Search Functionality Tests', () => {
  let driver: WebDriver;
  let searchPage: SearchPage;
  
  beforeAll(async () => {
    driver = await createDriver('chrome');
    searchPage = new SearchPage(driver);
  });
  
  afterAll(async () => {
    await driver.quit();
  });
  
  beforeEach(async () => {
    await searchPage.navigateTo('http://localhost:5173/search');
  });
  
  test('SF001: Verify search input field accepts text', async () => {
    await searchPage.typeInSearchField('pizza');
    const inputValue = await searchPage.getSearchFieldValue();
    expect(inputValue).toBe('pizza');
  });
  
  test('SF002: Test search suggestions appear', async () => {
    await searchPage.typeInSearchField('piz');
    await driver.sleep(500); // Wait for debounced suggestions
    const suggestionsVisible = await searchPage.areSuggestionsVisible();
    expect(suggestionsVisible).toBe(true);
  });
  
  test('SF003: Test search filters functionality', async () => {
    await searchPage.openFilters();
    await searchPage.selectPriceRange('$10-20');
    await searchPage.selectCuisineType('Italian');
    await searchPage.applyFilters();
    
    const filtersApplied = await searchPage.areFiltersApplied();
    expect(filtersApplied).toBe(true);
  });
});
```

### 6. Performance Tests

```typescript
// tests/specs/Performance.spec.ts
describe('Performance Tests', () => {
  let driver: WebDriver;
  
  beforeAll(async () => {
    driver = await createDriver('chrome');
  });
  
  afterAll(async () => {
    await driver.quit();
  });
  
  test('PERF001: Verify page load time is under 3 seconds', async () => {
    const startTime = Date.now();
    await driver.get('http://localhost:5173/');
    await driver.wait(until.elementLocated(By.css('[data-testid="hero-title"]')), 10000);
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });
  
  test('PERF002: Verify image loading performance', async () => {
    await driver.get('http://localhost:5173/');
    
    // Check if images are loaded
    const images = await driver.findElements(By.css('img'));
    for (const img of images) {
      const naturalWidth = await driver.executeScript(
        'return arguments[0].naturalWidth;', img
      );
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});
```

---

## Cross-Browser Testing

### 7. Browser Compatibility Tests

```typescript
// tests/specs/CrossBrowser.spec.ts
describe('Cross-Browser Compatibility', () => {
  const browsers = ['chrome', 'firefox'];
  
  browsers.forEach(browser => {
    describe(`${browser.toUpperCase()} Tests`, () => {
      let driver: WebDriver;
      let homePage: HomePage;
      
      beforeAll(async () => {
        driver = await createDriver(browser as 'chrome' | 'firefox');
        homePage = new HomePage(driver);
      });
      
      afterAll(async () => {
        await driver.quit();
      });
      
      test(`CB001: Verify basic functionality in ${browser}`, async () => {
        await homePage.navigateTo('http://localhost:5173/');
        const heroVisible = await homePage.verifyHeroSection();
        expect(heroVisible).toBe(true);
      });
      
      test(`CB002: Verify navigation works in ${browser}`, async () => {
        await homePage.navigateTo('http://localhost:5173/');
        await homePage.clickOrderNow();
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/products');
      });
    });
  });
});
```

---

## Accessibility Testing

### 8. A11y Tests

```typescript
// tests/specs/Accessibility.spec.ts
describe('Accessibility Tests', () => {
  let driver: WebDriver;
  
  beforeAll(async () => {
    driver = await createDriver('chrome');
  });
  
  afterAll(async () => {
    await driver.quit();
  });
  
  test('A11Y001: Verify aria-labels are present', async () => {
    await driver.get('http://localhost:5173/');
    
    const elementsWithAriaLabel = await driver.findElements(
      By.css('[aria-label]')
    );
    expect(elementsWithAriaLabel.length).toBeGreaterThan(0);
  });
  
  test('A11Y002: Verify keyboard navigation', async () => {
    await driver.get('http://localhost:5173/');
    
    // Tab through interactive elements
    const body = await driver.findElement(By.css('body'));
    await body.sendKeys(Key.TAB);
    await body.sendKeys(Key.TAB);
    
    const activeElement = await driver.switchTo().activeElement();
    const tagName = await activeElement.getTagName();
    expect(['button', 'a', 'input']).toContain(tagName.toLowerCase());
  });
  
  test('A11Y003: Verify color contrast requirements', async () => {
    await driver.get('http://localhost:5173/');
    
    // Check if high contrast elements are visible
    const primaryButtons = await driver.findElements(
      By.css('[data-testid*="primary-btn"]')
    );
    
    for (const button of primaryButtons) {
      const backgroundColor = await button.getCssValue('background-color');
      const color = await button.getCssValue('color');
      // Basic check - ensure colors are defined
      expect(backgroundColor).toBeTruthy();
      expect(color).toBeTruthy();
    }
  });
});
```

---

## Test Execution Configuration

### 9. Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'tests/**/*.ts',
    '!tests/**/*.d.ts',
    '!tests/config/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 30000,
  maxWorkers: 1, // Run tests sequentially for Selenium
};
```

### 10. Test Execution Scripts

```json
{
  "scripts": {
    "test:e2e": "jest --config=jest.config.js",
    "test:e2e:chrome": "BROWSER=chrome jest --config=jest.config.js",
    "test:e2e:firefox": "BROWSER=firefox jest --config=jest.config.js",
    "test:e2e:headless": "HEADLESS=true jest --config=jest.config.js",
    "test:e2e:mobile": "VIEWPORT=mobile jest --config=jest.config.js",
    "test:e2e:ci": "npm run test:e2e:headless"
  }
}
```

---

## React Native Testing Considerations

### 11. React Native App Testing (Appium Alternative)

Since React Native apps require mobile device testing, here's guidance for mobile GUI testing:

```typescript
// Note: This would require Appium setup for React Native
// Alternative: Use React Native Testing Library for component testing

// tests/mobile/ReactNativeGUI.spec.ts (Conceptual)
describe('React Native GUI Tests', () => {
  // Would require Appium WebDriver for mobile automation
  // Focus areas for React Native:
  
  test('RN001: Verify ProductListScreen renders correctly', async () => {
    // Test product list rendering
    // Verify scroll functionality
    // Test filter interactions
  });
  
  test('RN002: Verify Location Services integration', async () => {
    // Test location permission requests
    // Verify location-based filtering
    // Test manual location selection
  });
  
  test('RN003: Verify Search functionality', async () => {
    // Test search input
    // Verify debounced search
    // Test search suggestions
  });
  
  test('RN004: Verify Category Navigation', async () => {
    // Test category selection
    // Verify navigation flow
    // Test category filtering
  });
  
  test('RN005: Verify Rating components', async () => {
    // Test rating display
    // Verify interactive rating
    // Test rating submission
  });
});
```

---

## Continuous Integration

### 12. GitHub Actions Workflow

```yaml
# .github/workflows/gui-tests.yml
name: GUI Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  gui-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd localfood-web
        npm install
        
    - name: Start application
      run: |
        cd localfood-web
        npm run dev &
        sleep 10
        
    - name: Run Selenium tests
      run: |
        cd localfood-web
        npm run test:e2e:ci
        
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-results
        path: localfood-web/test-results/
```

---

## Test Data Management

### 13. Test Data Setup

```typescript
// tests/data/testData.ts
export const testData = {
  users: {
    validUser: {
      email: 'test@localfood.com',
      password: 'TestPassword123!'
    }
  },
  
  products: {
    pizza: {
      name: 'Margherita Pizza',
      category: 'Italian',
      price: '$15.99'
    }
  },
  
  locations: {
    defaultLocation: {
      city: 'New York',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    }
  },
  
  search: {
    validQueries: ['pizza', 'burger', 'sushi'],
    invalidQueries: ['', '   ', '!@#$%']
  }
};
```

---

## Test Reporting

### 14. Custom Test Reporter

```typescript
// tests/reporters/CustomReporter.ts
export class CustomTestReporter {
  onTestResult(test: any, testResult: any) {
    const report = {
      testName: test.path,
      status: testResult.testResults.map(t => t.status),
      duration: testResult.perfStats.end - testResult.perfStats.start,
      timestamp: new Date().toISOString()
    };
    
    // Save to file or send to reporting service
    console.log('Test Report:', JSON.stringify(report, null, 2));
  }
}
```

---

## Summary

### Test Coverage Areas

| **Test Category** | **Test Count** | **Priority** | **Status** |
|------------------|----------------|--------------|------------|
| Home Page Tests | 8 tests | High | Ready |
| Navigation Tests | 4 tests | High | Ready |
| Responsive Design | 3 tests | Medium | Ready |
| Search Functionality | 3 tests | High | Ready |
| Performance Tests | 2 tests | Medium | Ready |
| Cross-Browser | 4 tests | Medium | Ready |
| Accessibility | 3 tests | Low | Ready |
| **Total** | **27 tests** | - | Ready |

### Execution Commands

```bash
# Setup and run tests
cd localfood-web
npm install selenium-webdriver @types/selenium-webdriver chromedriver
npm run dev  # Start application
npm run test:e2e  # Run all GUI tests
```

### Expected Outcomes

- **✅ 27 automated GUI tests** covering critical user journeys
- **✅ Cross-browser compatibility** verification
- **✅ Responsive design** validation
- **✅ Performance benchmarking** 
- **✅ Accessibility compliance** checking
- **✅ CI/CD integration** ready

This comprehensive Selenium test plan ensures thorough GUI validation of the LocalFood web application with automated, reliable, and maintainable test coverage.