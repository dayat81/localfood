import { WebDriver } from 'selenium-webdriver';
import { createDriver } from '../config/webdriver.config';
import { HomePage } from '../pages/HomePage';

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