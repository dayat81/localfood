import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';

import theme from './styles/theme';
import { store } from './store';
import client from './services/apollo';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));

function App() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Layout>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/category/:id" element={<CategoryPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </Suspense>
            </Layout>
          </Router>
        </ThemeProvider>
      </Provider>
    </ApolloProvider>
  );
}

export default App;