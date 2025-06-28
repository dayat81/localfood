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