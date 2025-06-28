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