/**
 * LocalFood App - F&B Ordering Platform
 * Built with Saleor Cloud Integration
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { client } from './src/services/apollo';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppNavigator />
      </ApolloProvider>
    </Provider>
  );
}

export default App;
