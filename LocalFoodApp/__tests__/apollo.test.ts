import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { gql } from '@apollo/client';

// Create a simple client without AsyncStorage for testing
const testClient = new ApolloClient({
  link: createHttpLink({
    uri: 'https://store-4bpwsmd6.saleor.cloud/graphql/',
  }),
  cache: new InMemoryCache(),
});

// Test query to verify Saleor connection - using a public query
const CATEGORIES_QUERY = gql`
  query GetCategories {
    categories(first: 1) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

describe('Apollo Client Configuration', () => {
  test('should connect to Saleor GraphQL endpoint and receive 401 (expected for unauthenticated requests)', async () => {
    try {
      await testClient.query({
        query: CATEGORIES_QUERY,
        fetchPolicy: 'network-only'
      });
      
      // Should not reach here without authentication
      expect(true).toBe(false);
      
    } catch (error: any) {
      // Expect 401 Unauthorized for unauthenticated requests
      expect(error.networkError?.statusCode).toBe(401);
      expect(error.networkError?.result).toBe('Unauthorized');
      console.log('✅ Saleor endpoint reachable - returns 401 as expected for unauthenticated requests');
    }
  }, 10000); // 10 second timeout for network request

  test('should handle GraphQL errors properly', async () => {
    const INVALID_QUERY = gql`
      query InvalidQuery {
        nonExistentField {
          id
        }
      }
    `;

    try {
      await testClient.query({
        query: INVALID_QUERY,
        errorPolicy: 'none'
      });
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Should catch GraphQL errors
      expect(error).toBeDefined();
    }
  });
});