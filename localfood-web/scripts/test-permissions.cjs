const { default: fetch } = require('node-fetch');

// Saleor API Configuration
const SALEOR_ENDPOINT = 'https://store-4bpwsmd6.saleor.cloud/graphql/';
const APP_TOKEN = '889c9f68459b4adea2b28b7d18670a6e.qh4yhYByf4b1Q5Zcq5NsvkvCtEmPgycg129mDpOi8QfDjyLn';
const BASIC_AUTH = 'Basic YWRtaW46YWRtaW4=';

async function executeGraphQL(query, variables = {}, requiresAuth = true) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': BASIC_AUTH,
  };
  
  if (requiresAuth) {
    headers['Saleor-App-Token'] = APP_TOKEN;
  }
  
  try {
    const response = await fetch(SALEOR_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables })
    });
    
    const result = await response.json();
    return { success: !result.errors, data: result.data, errors: result.errors };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testPermissions() {
  console.log('🔍 Testing Saleor App Permissions...\n');
  
  const tests = [
    {
      name: 'Public Products Query',
      query: `query { products(first: 5) { edges { node { id name } } } }`,
      requiresAuth: false
    },
    {
      name: 'Categories Query', 
      query: `query { categories(first: 5) { edges { node { id name } } } }`,
      requiresAuth: false
    },
    {
      name: 'App Info Query',
      query: `query { app { id name permissions { name code } } }`,
      requiresAuth: true
    },
    {
      name: 'Channels Query',
      query: `query { channels { id name } }`,
      requiresAuth: true
    },
    {
      name: 'Warehouses Query',
      query: `query { warehouses(first: 5) { edges { node { id name } } } }`,
      requiresAuth: true
    }
  ];
  
  for (const test of tests) {
    console.log(`Testing: ${test.name}`);
    const result = await executeGraphQL(test.query, {}, test.requiresAuth);
    
    if (result.success) {
      console.log('✅ Success');
      if (test.name === 'App Info Query' && result.data?.app?.permissions) {
        console.log('  App permissions:', result.data.app.permissions.map(p => p.name).join(', '));
      }
    } else {
      console.log('❌ Failed');
      if (result.errors) {
        console.log('  Errors:', result.errors.map(e => e.message).join(', '));
      }
    }
    console.log('');
  }
}

async function createSampleProduct() {
  console.log('🍕 Testing Product Creation...\n');
  
  // First get a category ID
  const categoriesResult = await executeGraphQL(
    `query { categories(first: 1) { edges { node { id name } } } }`,
    {}, false
  );
  
  if (!categoriesResult.success) {
    console.log('❌ Cannot get categories for product creation');
    return;
  }
  
  const categoryId = categoriesResult.data.categories.edges[0]?.node?.id;
  if (!categoryId) {
    console.log('❌ No categories found for product creation');
    return;
  }
  
  console.log(`Using category: ${categoriesResult.data.categories.edges[0].node.name} (${categoryId})`);
  
  // Try to create a simple product
  const productMutation = `
    mutation CreateProduct($input: ProductCreateInput!) {
      productCreate(input: $input) {
        product {
          id
          name
          slug
        }
        errors {
          field
          message
          code
        }
      }
    }
  `;
  
  const productInput = {
    input: {
      name: "Test Pizza Margherita",
      slug: "test-pizza-margherita",
      description: "A test pizza for LocalFood app",
      category: categoryId,
      productType: "UHJvZHVjdFR5cGU6MQ==" // Default product type ID
    }
  };
  
  console.log('Creating test product...');
  const result = await executeGraphQL(productMutation, productInput, true);
  
  if (result.success && result.data.productCreate.product) {
    console.log('✅ Product created successfully!');
    console.log('Product:', result.data.productCreate.product);
  } else {
    console.log('❌ Product creation failed');
    if (result.data?.productCreate?.errors) {
      console.log('Errors:', result.data.productCreate.errors);
    }
    if (result.errors) {
      console.log('GraphQL Errors:', result.errors);
    }
  }
}

async function main() {
  await testPermissions();
  await createSampleProduct();
}

main().catch(console.error);