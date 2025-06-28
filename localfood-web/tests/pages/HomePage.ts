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