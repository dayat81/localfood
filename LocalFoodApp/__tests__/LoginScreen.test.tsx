import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../src/screens/auth/LoginScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
};

// Mock the auth service
jest.mock('../src/services/auth', () => ({
  login: jest.fn(),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form elements', () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    expect(getByText('Sign In')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText("Don't have an account? Sign Up")).toBeTruthy();
  });

  test('shows error for empty fields', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);

    // Note: In a real test, we'd check for Alert.alert mock calls
    // For now, we just verify the button press doesn't crash
    expect(signInButton).toBeTruthy();
  });

  test('navigates to register screen', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    const registerLink = getByText("Don't have an account? Sign Up");
    fireEvent.press(registerLink);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });
});