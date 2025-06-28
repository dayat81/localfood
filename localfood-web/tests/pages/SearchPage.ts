import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  // Locators
  private searchField = By.css('[data-testid="search-input"]');
  private searchButton = By.css('[data-testid="search-submit"]');
  private suggestionsContainer = By.css('[data-testid="search-suggestions"]');
  private filtersButton = By.css('[data-testid="filters-button"]');
  private priceFilter = By.css('[data-testid="price-filter"]');
  private cuisineFilter = By.css('[data-testid="cuisine-filter"]');
  private applyFiltersButton = By.css('[data-testid="apply-filters"]');
  private activeFilters = By.css('[data-testid="active-filters"]');
  
  async typeInSearchField(text: string): Promise<void> {
    await this.typeText(this.searchField, text);
  }
  
  async getSearchFieldValue(): Promise<string> {
    const element = await this.waitForElement(this.searchField);
    return await element.getAttribute('value');
  }
  
  async areSuggestionsVisible(): Promise<boolean> {
    return await this.isElementVisible(this.suggestionsContainer);
  }
  
  async openFilters(): Promise<void> {
    await this.clickElement(this.filtersButton);
  }
  
  async selectPriceRange(range: string): Promise<void> {
    const priceOption = By.css(`[data-testid="price-option"][data-value="${range}"]`);
    await this.clickElement(priceOption);
  }
  
  async selectCuisineType(cuisine: string): Promise<void> {
    const cuisineOption = By.css(`[data-testid="cuisine-option"][data-value="${cuisine}"]`);
    await this.clickElement(cuisineOption);
  }
  
  async applyFilters(): Promise<void> {
    await this.clickElement(this.applyFiltersButton);
  }
  
  async areFiltersApplied(): Promise<boolean> {
    return await this.isElementVisible(this.activeFilters);
  }
}