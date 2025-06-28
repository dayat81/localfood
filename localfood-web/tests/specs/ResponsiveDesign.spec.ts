import { WebDriver, By } from 'selenium-webdriver';
import { createDriver } from '../config/webdriver.config';
import { HomePage } from '../pages/HomePage';

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