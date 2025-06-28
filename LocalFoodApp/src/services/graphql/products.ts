import { gql } from '@apollo/client';

// Get products with comprehensive information
export const GET_PRODUCTS = gql`
  query GetProducts(
    $channel: String!
    $first: Int = 20
    $after: String
    $filter: ProductFilterInput
    $sortBy: ProductOrder
  ) {
    products(
      channel: $channel
      first: $first
      after: $after
      filter: $filter
      sortBy: $sortBy
    ) {
      edges {
        node {
          id
          name
          slug
          description
          seoDescription
          seoTitle
          isAvailableForPurchase
          availableForPurchase
          thumbnail(size: 512, format: WEBP) {
            url
            alt
          }
          images {
            id
            url
            alt
          }
          category {
            id
            name
            slug
          }
          productType {
            id
            name
          }
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
                net {
                  amount
                  currency
                }
              }
              stop {
                gross {
                  amount
                  currency
                }
                net {
                  amount
                  currency
                }
              }
            }
          }
          variants {
            id
            name
            sku
            quantityAvailable
            pricing {
              price {
                gross {
                  amount
                  currency
                }
                net {
                  amount
                  currency
                }
              }
            }
          }
          rating
          weight {
            unit
            value
          }
          metadata {
            key
            value
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
`;

// Get single product details
export const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($id: ID!, $channel: String!) {
    product(id: $id, channel: $channel) {
      id
      name
      slug
      description
      seoDescription
      seoTitle
      isAvailableForPurchase
      availableForPurchase
      thumbnail(size: 512, format: WEBP) {
        url
        alt
      }
      images {
        id
        url
        alt
      }
      category {
        id
        name
        slug
        parent {
          id
          name
          slug
        }
      }
      productType {
        id
        name
        hasVariants
      }
      pricing {
        priceRange {
          start {
            gross {
              amount
              currency
            }
            net {
              amount
              currency
            }
          }
          stop {
            gross {
              amount
              currency
            }
            net {
              amount
              currency
            }
          }
        }
        onSale
        discount {
          gross {
            amount
            currency
          }
        }
      }
      variants {
        id
        name
        sku
        quantityAvailable
        pricing {
          price {
            gross {
              amount
              currency
            }
            net {
              amount
              currency
            }
          }
          onSale
          discount {
            gross {
              amount
              currency
            }
          }
        }
        attributes {
          attribute {
            id
            name
            slug
          }
          values {
            id
            name
            slug
            value
          }
        }
      }
      attributes {
        attribute {
          id
          name
          slug
        }
        values {
          id
          name
          slug
          value
        }
      }
      rating
      weight {
        unit
        value
      }
      metadata {
        key
        value
      }
    }
  }
`;

// Search products
export const SEARCH_PRODUCTS = gql`
  query SearchProducts(
    $channel: String!
    $search: String!
    $first: Int = 20
    $after: String
  ) {
    products(
      channel: $channel
      filter: { search: $search }
      first: $first
      after: $after
    ) {
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
          category {
            id
            name
            slug
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
`;

// Get products by category
export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory(
    $channel: String!
    $categoryId: ID!
    $first: Int = 20
    $after: String
    $sortBy: ProductOrder
  ) {
    category(id: $categoryId) {
      id
      name
      slug
      description
      products(
        channel: $channel
        first: $first
        after: $after
        sortBy: $sortBy
      ) {
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

// Product variant details for cart
export const GET_PRODUCT_VARIANT = gql`
  query GetProductVariant($id: ID!, $channel: String!) {
    productVariant(id: $id, channel: $channel) {
      id
      name
      sku
      quantityAvailable
      product {
        id
        name
        slug
        thumbnail(size: 256, format: WEBP) {
          url
          alt
        }
      }
      pricing {
        price {
          gross {
            amount
            currency
          }
          net {
            amount
            currency
          }
        }
        onSale
        discount {
          gross {
            amount
            currency
          }
        }
      }
      attributes {
        attribute {
          id
          name
          slug
        }
        values {
          id
          name
          slug
          value
        }
      }
      weight {
        unit
        value
      }
    }
  }
`;