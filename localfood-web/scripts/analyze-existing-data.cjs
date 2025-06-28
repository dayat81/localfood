const { default: fetch } = require('node-fetch');

const SALEOR_ENDPOINT = 'https://store-4bpwsmd6.saleor.cloud/graphql/';
const BASIC_AUTH = 'Basic YWRtaW46YWRtaW4=';

async function executeGraphQL(query, variables = {}) {
  try {
    const response = await fetch(SALEOR_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': BASIC_AUTH,
      },
      body: JSON.stringify({ query, variables })
    });
    
    const result = await response.json();
    return { success: !result.errors, data: result.data, errors: result.errors };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function getChannels() {
  console.log('📺 Getting available channels...');
  
  const query = `
    query {
      channels {
        id
        name
        slug
        currencyCode
        isActive
      }
    }
  `;
  
  const result = await executeGraphQL(query);
  if (result.success) {
    console.log('Available channels:', result.data.channels);
    return result.data.channels;
  } else {
    console.log('❌ Cannot get channels (permissions needed)');
    return [];
  }
}

async function getExistingProducts() {
  console.log('🛍️ Getting existing products...');
  
  // Try without channel first
  let query = `
    query {
      products(first: 20) {
        edges {
          node {
            id
            name
            slug
            description
            category {
              id
              name
            }
            thumbnail {
              url
            }
            defaultVariant {
              id
              name
              sku
            }
          }
        }
      }
    }
  `;
  
  let result = await executeGraphQL(query);
  
  if (!result.success && result.errors?.some(e => e.message.includes('channel'))) {
    console.log('Need to specify channel, trying with default channel...');
    
    // Try with channel specification
    query = `
      query {
        products(first: 20, channel: "default-channel") {
          edges {
            node {
              id
              name
              slug
              description
              category {
                id
                name
              }
              thumbnail {
                url
              }
              defaultVariant {
                id
                name
                sku
              }
            }
          }
        }
      }
    `;
    
    result = await executeGraphQL(query);
  }
  
  if (result.success) {
    const products = result.data.products.edges;
    console.log(`✅ Found ${products.length} existing products:`);
    
    products.forEach((productEdge, index) => {
      const product = productEdge.node;
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Category: ${product.category?.name || 'None'}`);
      console.log(`   Description: ${product.description?.substring(0, 100) || 'No description'}...`);
      console.log(`   Default Variant: ${product.defaultVariant?.name || 'None'}`);
      console.log('');
    });
    
    return products;
  } else {
    console.log('❌ Failed to get products');
    console.log('Errors:', result.errors);
    return [];
  }
}

async function getExistingCategories() {
  console.log('📂 Getting detailed category information...');
  
  const query = `
    query {
      categories(first: 50) {
        edges {
          node {
            id
            name
            slug
            description
            level
            parent {
              id
              name
            }
            children(first: 20) {
              edges {
                node {
                  id
                  name
                  slug
                }
              }
            }
            products(first: 5) {
              totalCount
              edges {
                node {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  `;
  
  const result = await executeGraphQL(query);
  
  if (result.success) {
    const categories = result.data.categories.edges;
    console.log(`✅ Found ${categories.length} categories:`);
    
    // Group by level for better display
    const rootCategories = categories.filter(cat => cat.node.level === 0);
    const subCategories = categories.filter(cat => cat.node.level > 0);
    
    console.log('\n🌳 Category Hierarchy:');
    rootCategories.forEach(catEdge => {
      const cat = catEdge.node;
      console.log(`📁 ${cat.name} (${cat.products.totalCount} products)`);
      console.log(`   ID: ${cat.id}, Slug: ${cat.slug}`);
      if (cat.description) {
        console.log(`   Description: ${cat.description.substring(0, 80)}...`);
      }
      
      // Show children
      cat.children.edges.forEach(childEdge => {
        const child = childEdge.node;
        console.log(`   └─ ${child.name} (${child.slug})`);
      });
      console.log('');
    });
    
    return categories;
  } else {
    console.log('❌ Failed to get categories');
    console.log('Errors:', result.errors);
    return [];
  }
}

async function checkFoodSuitableCategories(categories) {
  console.log('🍕 Analyzing food-suitable categories...');
  
  const foodRelated = categories.filter(catEdge => {
    const cat = catEdge.node;
    const name = cat.name.toLowerCase();
    return name.includes('food') || 
           name.includes('groceries') || 
           name.includes('juice') || 
           name.includes('beverage') ||
           name.includes('restaurant') ||
           name.includes('meal');
  });
  
  if (foodRelated.length > 0) {
    console.log('✅ Found food-related categories:');
    foodRelated.forEach(catEdge => {
      const cat = catEdge.node;
      console.log(`- ${cat.name} (${cat.products.totalCount} products)`);
    });
    return foodRelated;
  } else {
    console.log('⚠️ No obvious food-related categories found');
    console.log('Available categories for food data:');
    categories.slice(0, 5).forEach(catEdge => {
      const cat = catEdge.node;
      console.log(`- ${cat.name} (${cat.products.totalCount} products)`);
    });
    return categories.slice(0, 5); // Return first 5 as fallback
  }
}

async function main() {
  console.log('🔍 Analyzing Existing Saleor Data for LocalFood\n');
  
  // Get channels (may fail due to permissions)
  await getChannels();
  console.log('');
  
  // Get existing products
  const products = await getExistingProducts();
  console.log('');
  
  // Get categories
  const categories = await getExistingCategories();
  console.log('');
  
  // Find food-suitable categories
  const suitableCategories = await checkFoodSuitableCategories(categories);
  
  console.log('\n📊 Data Analysis Summary:');
  console.log(`- Total Products: ${products.length}`);
  console.log(`- Total Categories: ${categories.length}`);
  console.log(`- Food-Suitable Categories: ${suitableCategories.length}`);
  
  console.log('\n💡 Recommendations:');
  if (suitableCategories.length > 0) {
    console.log('✅ Use existing food categories for immediate data population');
    console.log('✅ Add food products to existing "Groceries" and related categories');
  } else {
    console.log('⚠️ Consider using existing categories as temporary food containers');
  }
  
  console.log('✅ Work with existing product structure to add food items');
  console.log('✅ Focus on product creation rather than category creation');
}

main().catch(console.error);