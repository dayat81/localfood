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