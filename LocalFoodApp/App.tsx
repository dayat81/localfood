/**
 * LocalFood App - F&B Ordering Platform
 * Built with Saleor Cloud Integration
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import { client } from './src/services/apollo';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ApolloProvider client={client}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </ApolloProvider>
  );
}

export default App;
