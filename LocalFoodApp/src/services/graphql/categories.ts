import { gql } from '@apollo/client';

// Get all categories
export const GET_CATEGORIES = gql`
  query GetCategories($first: Int = 50) {
    categories(first: $first, level: 0) {
      edges {
        node {
          id
          name
          slug
          description
          seoDescription
          seoTitle
          backgroundImage {
            url
            alt
          }
          level
          parent {
            id
            name
            slug
          }
          children(first: 20) {
            edges {
              node {
                id
                name
                slug
                description
                level
              }
            }
          }
          products(first: 1) {
            totalCount
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// Get category details with products
export const GET_CATEGORY_DETAILS = gql`
  query GetCategoryDetails(
    $id: ID!
    $channel: String!
    $first: Int = 20
    $after: String
  ) {
    category(id: $id) {
      id
      name
      slug
      description
      seoDescription
      seoTitle
      backgroundImage {
        url
        alt
      }
      level
      parent {
        id
        name
        slug
      }
      children(first: 20) {
        edges {
          node {
            id
            name
            slug
            description
            backgroundImage {
              url
              alt
            }
            products(first: 1) {
              totalCount
            }
          }
        }
      }
      products(channel: $channel, first: $first, after: $after) {
        edges {
          node {
            id
            name
            slug
            description
            thumbnail(size: 256, format: WEBP) {
              url
              alt
            }
            pricing {
              priceRange {
                start {
                  gross {
                    amount
                    currency
                  }
                }
              }
            }
            variants {
              id
              quantityAvailable
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        totalCount
      }
    }
  }
`;

// Get category tree structure
export const GET_CATEGORY_TREE = gql`
  query GetCategoryTree {
    categories(first: 100) {
      edges {
        node {
          id
          name
          slug
          level
          parent {
            id
            name
            slug
          }
          children(first: 50) {
            edges {
              node {
                id
                name
                slug
                level
                children(first: 20) {
                  edges {
                    node {
                      id
                      name
                      slug
                      level
                    }
                  }
                }
              }
            }
          }
          products(first: 1) {
            totalCount
          }
        }
      }
    }
  }
`;

// Search categories
export const SEARCH_CATEGORIES = gql`
  query SearchCategories($search: String!, $first: Int = 20) {
    categories(filter: { search: $search }, first: $first) {
      edges {
        node {
          id
          name
          slug
          description
          backgroundImage {
            url
            alt
          }
          level
          products(first: 1) {
            totalCount
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;