import { WebDriver, By, until } from 'selenium-webdriver';
import { createDriver } from '../config/webdriver.config';

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