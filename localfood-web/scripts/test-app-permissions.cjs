const { default: fetch } = require('node-fetch');

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
  
  console.log('Headers being sent:', Object.keys(headers));
  
  try {
    const response = await fetch(SALEOR_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables })
    });
    
    console.log('Response status:', response.status);
    const result = await response.json();
    return { success: !result.errors, data: result.data, errors: result.errors };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testAppPermissions() {
  console.log('🔍 Testing App Authentication and Permissions\n');
  
  // Test 1: Basic shop query (should work)
  console.log('Test 1: Shop Query (Basic Auth only)');
  const shopQuery = `
    query {
      shop {
        name
        domain { host }
      }
    }
  `;
  
  const shopResult = await executeGraphQL(shopQuery, {}, false);
  console.log('Shop query result:', shopResult.success ? '✅ SUCCESS' : '❌ FAILED');
  if (!shopResult.success) {
    console.log('Shop errors:', shopResult.errors);
  }
  console.log('');
  
  // Test 2: App info query (should show permissions)
  console.log('Test 2: App Info Query (Basic Auth + App Token)');
  const appQuery = `
    query {
      app {
        id
        name
        permissions {
          name
          code
        }
      }
    }
  `;
  
  const appResult = await executeGraphQL(appQuery, {}, true);
  console.log('App query result:', appResult.success ? '✅ SUCCESS' : '❌ FAILED');
  if (appResult.success) {
    console.log('App info:', appResult.data.app);
  } else {
    console.log('App errors:', appResult.errors);
  }
  console.log('');
  
  // Test 3: Try a simple admin operation (category creation test)
  console.log('Test 3: Simple Category Creation Test');
  const categoryTestQuery = `
    mutation {
      categoryCreate(input: {
        name: "Test Food Category"
        slug: "test-food-category"
        description: "A test category for food items"
      }) {
        category {
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
  
  const categoryResult = await executeGraphQL(categoryTestQuery, {}, true);
  console.log('Category creation result:', categoryResult.success ? '✅ SUCCESS' : '❌ FAILED');
  
  if (categoryResult.success && categoryResult.data.categoryCreate.category) {
    console.log('✅ Category created successfully!');
    console.log('Category:', categoryResult.data.categoryCreate.category);
  } else {
    if (categoryResult.data?.categoryCreate?.errors) {
      console.log('Category creation errors:', categoryResult.data.categoryCreate.errors);
    }
    if (categoryResult.errors) {
      console.log('GraphQL errors:', categoryResult.errors);
    }
  }
  console.log('');
  
  // Test 4: Check channels (should show permission error)
  console.log('Test 4: Channels Query (Should show permission requirements)');
  const channelsQuery = `
    query {
      channels {
        id
        name
        slug
      }
    }
  `;
  
  const channelsResult = await executeGraphQL(channelsQuery, {}, true);
  console.log('Channels query result:', channelsResult.success ? '✅ SUCCESS' : '❌ FAILED');
  if (!channelsResult.success) {
    console.log('Channels errors:', channelsResult.errors);
  } else {
    console.log('Channels data:', channelsResult.data.channels);
  }
}

async function main() {
  console.log('🚀 Testing Saleor App Permissions with Fixed Authentication\n');
  console.log('Using authentication pattern from successful logs:\n');
  console.log('- Basic Auth: admin:admin (for Cloud access)');
  console.log('- Saleor-App-Token: Custom header for app authentication\n');
  
  await testAppPermissions();
  
  console.log('\n📋 Summary:');
  console.log('If app info query shows permissions, authentication is working.');
  console.log('If category creation fails with permissions error, app needs MANAGE_PRODUCTS permission.');
  console.log('If getting JSON parsing errors, there may be a server/network issue.');
}

main().catch(console.error);