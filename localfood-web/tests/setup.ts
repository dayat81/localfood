// Global test setup
beforeAll(() => {
  console.log('Starting Selenium WebDriver tests...');
});

afterAll(() => {
  console.log('Selenium WebDriver tests completed');
});

// Set default test timeout
jest.setTimeout(30000);