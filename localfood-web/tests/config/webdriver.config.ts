import { Builder, WebDriver, Capabilities } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';
import { Options as FirefoxOptions } from 'selenium-webdriver/firefox';

export const createDriver = async (browser: 'chrome' | 'firefox' = 'chrome'): Promise<WebDriver> => {
  const options = browser === 'chrome' 
    ? new ChromeOptions().addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage')
    : new FirefoxOptions().addArguments('--headless');
    
  return await new Builder()
    .forBrowser(browser)
    .setChromeOptions(browser === 'chrome' ? options as ChromeOptions : undefined)
    .setFirefoxOptions(browser === 'firefox' ? options as FirefoxOptions : undefined)
    .build();
};