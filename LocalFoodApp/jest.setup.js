// Jest setup for React Native testing

// Mock AsyncStorage
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock react-native modules
jest.mock('react-native', () => {
  return {
    StyleSheet: {
      create: jest.fn((styles) => styles),
      flatten: jest.fn((styles) => styles),
    },
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    ScrollView: 'ScrollView',
    SafeAreaView: 'SafeAreaView',
    TextInput: 'TextInput',
    Alert: {
      alert: jest.fn(),
    },
    NativeModules: {},
    Platform: {
      OS: 'ios',
    },
    useColorScheme: jest.fn(() => 'light'),
  };
});

// Mock navigation
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
    }),
  };
});

// Global test timeout
jest.setTimeout(30000);