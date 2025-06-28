import { saveAuthToken, removeAuthToken, getAuthToken } from '../src/services/apollo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage is set up in jest.setup.js

describe('Authentication Service', () => {
  beforeEach(async () => {
    // Clear AsyncStorage before each test
    await AsyncStorage.clear();
  });

  test('should store and retrieve auth tokens', async () => {
    const testToken = 'test-jwt-token-12345';
    
    // Test saving token
    await saveAuthToken(testToken);
    
    // Test retrieving token
    const retrieved = await getAuthToken();
    expect(retrieved).toBe(testToken);
  });

  test('should remove auth tokens', async () => {
    const testToken = 'test-jwt-token-67890';
    
    // Store a token first
    await saveAuthToken(testToken);
    let retrieved = await getAuthToken();
    expect(retrieved).toBe(testToken);
    
    // Remove the token
    await removeAuthToken();
    retrieved = await getAuthToken();
    expect(retrieved).toBeNull();
  });

  test('should handle empty storage gracefully', async () => {
    const retrieved = await getAuthToken();
    expect(retrieved).toBeNull();
  });

  test('should handle token storage errors gracefully', async () => {
    // Mock AsyncStorage to throw an error
    const mockSetItem = jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage error'));
    
    // Should not throw error, but handle gracefully
    await expect(saveAuthToken('test-token')).resolves.toBeUndefined();
    
    mockSetItem.mockRestore();
  });
});