import { WebDriver } from 'selenium-webdriver';
import { createDriver } from '../config/webdriver.config';
import { SearchPage } from '../pages/SearchPage';

describe('Search Functionality Tests', () => {
  let driver: WebDriver;
  let searchPage: SearchPage;
  
  beforeAll(async () => {
    driver = await createDriver('chrome');
    searchPage = new SearchPage(driver);
  });
  
  afterAll(async () => {
    await driver.quit();
  });
  
  beforeEach(async () => {
    await searchPage.navigateTo('http://localhost:5173/search');
  });
  
  test('SF001: Verify search input field accepts text', async () => {
    await searchPage.typeInSearchField('pizza');
    const inputValue = await searchPage.getSearchFieldValue();
    expect(inputValue).toBe('pizza');
  });
  
  test('SF002: Test search suggestions appear', async () => {
    await searchPage.typeInSearchField('piz');
    await driver.sleep(500); // Wait for debounced suggestions
    const suggestionsVisible = await searchPage.areSuggestionsVisible();
    expect(suggestionsVisible).toBe(true);
  });
  
  test('SF003: Test search filters functionality', async () => {
    await searchPage.openFilters();
    await searchPage.selectPriceRange('$10-20');
    await searchPage.selectCuisineType('Italian');
    await searchPage.applyFilters();
    
    const filtersApplied = await searchPage.areFiltersApplied();
    expect(filtersApplied).toBe(true);
  });
});