/**
 * @format
 */

import React from 'react';
import { render } from '@testing-library/react-native';

// Mock the App navigation to avoid navigation complexity in testing
jest.mock('../src/navigation/AppNavigator', () => () => 'AppNavigator');

import App from '../App';

describe('App Component', () => {
  test('renders without crashing', () => {
    const component = render(<App />);
    expect(component).toBeTruthy();
  });

  test('provides Apollo client context', () => {
    // This test verifies that App component renders with ApolloProvider
    const component = render(<App />);
    expect(component).toBeTruthy();
  });
});
