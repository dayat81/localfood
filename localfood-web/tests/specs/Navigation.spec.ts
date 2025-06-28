import { WebDriver, By } from 'selenium-webdriver';
import { createDriver } from '../config/webdriver.config';
import { HeaderComponent } from '../pages/components/HeaderComponent';

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