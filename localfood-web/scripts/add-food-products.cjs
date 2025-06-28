const { default: fetch } = require('node-fetch');

const SALEOR_ENDPOINT = 'https://store-4bpwsmd6.saleor.cloud/graphql/';
const APP_TOKEN = '889c9f68459b4adea2b28b7d18670a6e.qh4yhYByf4b1Q5Zcq5NsvkvCtEmPgycg129mDpOi8QfDjyLn';
const BASIC_AUTH = 'Basic YWRtaW46YWRtaW4=';

async function executeGraphQL(query, variables = {}, requiresAuth = true) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': BASIC_AUTH,
  };
  
  // Use the successful authentication pattern from the logs
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

// Get category IDs that we know exist
async function getExistingCategories() {
  console.log('📂 Getting category IDs...');
  
  const query = `
    query {
      categories(first: 20) {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
    }
  `;
  
  const result = await executeGraphQL(query);
  
  if (result.success) {
    const categories = {};
    result.data.categories.edges.forEach(edge => {
      categories[edge.node.name.toLowerCase()] = edge.node.id;
    });
    
    console.log('✅ Found categories:', Object.keys(categories));
    return categories;
  } else {
    console.log('❌ Failed to get categories');
    return {};
  }
}

// Get product types
async function getProductTypes() {
  console.log('📦 Getting product types...');
  
  const query = `
    query {
      productTypes(first: 10) {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
    }
  `;
  
  const result = await executeGraphQL(query);
  
  if (result.success) {
    const types = {};
    result.data.productTypes.edges.forEach(edge => {
      types[edge.node.name.toLowerCase()] = edge.node.id;
    });
    
    console.log('✅ Found product types:', Object.keys(types));
    return types;
  } else {
    console.log('❌ Failed to get product types');
    return {};
  }
}

// Create realistic food products for existing categories
const FOOD_PRODUCTS = [
  // Beverages/Juices (we know this category exists)
  {
    name: "Fresh Orange Juice",
    slug: "fresh-orange-juice",
    description: "Freshly squeezed Valencia oranges packed with vitamin C. Perfect for breakfast or post-workout refreshment.",
    category: "juices",
    price: 4.99,
    sku: "JUICE-ORA-001"
  },
  {
    name: "Green Detox Smoothie", 
    slug: "green-detox-smoothie",
    description: "Energizing blend of spinach, kale, green apple, cucumber, and lemon. Your daily dose of greens!",
    category: "juices",
    price: 6.99,
    sku: "JUICE-GRN-001"
  },
  {
    name: "Tropical Mango Smoothie",
    slug: "tropical-mango-smoothie", 
    description: "Creamy mango smoothie with coconut milk and a hint of lime. Taste the tropics!",
    category: "juices",
    price: 5.99,
    sku: "JUICE-MAN-001"
  },
  {
    name: "Protein Berry Blast",
    slug: "protein-berry-blast",
    description: "Mixed berry smoothie with plant-based protein powder. Perfect post-workout recovery drink.",
    category: "juices", 
    price: 7.99,
    sku: "JUICE-PRO-001"
  },
  {
    name: "Cold Brew Coffee",
    slug: "cold-brew-coffee",
    description: "Smooth, rich cold brew coffee steeped for 24 hours. Refreshing caffeine kick without the bitterness.",
    category: "juices",
    price: 3.99,
    sku: "JUICE-COF-001"
  },
  
  // If we can use other categories
  {
    name: "Classic Cheeseburger",
    slug: "classic-cheeseburger",
    description: "Juicy beef patty with melted cheddar, lettuce, tomato, and special sauce on a toasted brioche bun.",
    category: "default category",
    price: 12.99,
    sku: "FOOD-BUR-001"
  },
  {
    name: "Margherita Pizza (12\")",
    slug: "margherita-pizza-12",
    description: "Traditional Italian pizza with fresh mozzarella, tomato sauce, and basil on hand-stretched dough.",
    category: "default category", 
    price: 16.99,
    sku: "FOOD-PIZ-001"
  },
  {
    name: "Caesar Salad",
    slug: "caesar-salad",
    description: "Crisp romaine lettuce with parmesan cheese, croutons, and our house-made Caesar dressing.",
    category: "default category",
    price: 9.99,
    sku: "FOOD-SAL-001"
  },
  {
    name: "Chicken Tacos (3pc)",
    slug: "chicken-tacos-3pc",
    description: "Three soft corn tortillas filled with seasoned grilled chicken, lettuce, cheese, and salsa.",
    category: "default category",
    price: 11.99,
    sku: "FOOD-TAC-001"
  },
  {
    name: "Chocolate Brownie",
    slug: "chocolate-brownie",
    description: "Rich, fudgy brownie made with premium Belgian chocolate. Served warm with a scoop of vanilla ice cream.",
    category: "default category",
    price: 6.99,
    sku: "FOOD-DES-001"
  }
];

async function createProduct(productData, categoryId, productTypeId) {
  console.log(`Creating product: ${productData.name}...`);
  
  const mutation = `
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
      name: productData.name,
      slug: productData.slug,
      description: JSON.stringify({
        time: Date.now(),
        blocks: [{
          id: Math.random().toString(36).substr(2, 10),
          data: {
            text: productData.description
          },
          type: "paragraph"
        }]
      }),
      category: categoryId,
      productType: productTypeId,
      weight: 0.5
      // Removed isPublished field as it's not supported in this mutation
    }
  };
  
  const result = await executeGraphQL(mutation, productInput);
  
  if (result.success && result.data.productCreate.product) {
    console.log(`✅ Created: ${productData.name}`);
    
    // Now create a variant for this product
    await createProductVariant(result.data.productCreate.product.id, productData);
    
    return result.data.productCreate.product;
  } else {
    console.log(`❌ Failed to create ${productData.name}`);
    if (result.data?.productCreate?.errors) {
      console.log('  Errors:', result.data.productCreate.errors);
    }
    if (result.errors) {
      console.log('  GraphQL Errors:', result.errors);
    }
    return null;
  }
}

async function createProductVariant(productId, productData) {
  console.log(`  Creating variant for ${productData.name}...`);
  
  const mutation = `
    mutation CreateProductVariant($input: ProductVariantCreateInput!) {
      productVariantCreate(input: $input) {
        productVariant {
          id
          name
          sku
        }
        errors {
          field
          message
          code
        }
      }
    }
  `;
  
  const variantInput = {
    input: {
      product: productId,
      sku: productData.sku,
      trackInventory: false,
      weight: 0.5
    }
  };
  
  const result = await executeGraphQL(mutation, variantInput);
  
  if (result.success && result.data.productVariantCreate.productVariant) {
    console.log(`  ✅ Created variant: ${productData.sku}`);
    
    // Set pricing for the variant
    await setVariantPricing(result.data.productVariantCreate.productVariant.id, productData.price);
    
    return result.data.productVariantCreate.productVariant;
  } else {
    console.log(`  ❌ Failed to create variant for ${productData.name}`);
    if (result.data?.productVariantCreate?.errors) {
      console.log('    Errors:', result.data.productVariantCreate.errors);
    }
    return null;
  }
}

async function setVariantPricing(variantId, price) {
  console.log(`  Setting price: $${price}...`);
  
  const mutation = `
    mutation UpdateChannelListing($id: ID!, $input: [ProductVariantChannelListingAddInput!]!) {
      productVariantChannelListingUpdate(id: $id, input: $input) {
        variant {
          id
          channelListings {
            price {
              amount
              currency
            }
          }
        }
        errors {
          field
          message
          code
        }
      }
    }
  `;
  
  const pricingInput = {
    id: variantId,
    input: [{
      channelSlug: "default-channel",
      price: price.toString()
    }]
  };
  
  const result = await executeGraphQL(mutation, pricingInput);
  
  if (result.success) {
    console.log(`  ✅ Set price: $${price}`);
  } else {
    console.log(`  ⚠️ Price setting may have failed (permissions)`);
  }
}

async function main() {
  console.log('🍕 Adding Food Products to LocalFood Backend\n');
  
  // Get existing data structure
  const categories = await getExistingCategories();
  const productTypes = await getProductTypes();
  
  if (Object.keys(categories).length === 0 || Object.keys(productTypes).length === 0) {
    console.log('❌ Cannot proceed without categories and product types');
    return;
  }
  
  console.log('\n🛠️ Creating Food Products...\n');
  
  let successCount = 0;
  let totalCount = 0;
  
  for (const productData of FOOD_PRODUCTS) {
    totalCount++;
    
    // Find appropriate category
    let categoryId = categories[productData.category];
    if (!categoryId) {
      categoryId = categories['default category'] || Object.values(categories)[0];
    }
    
    // Use first available product type
    const productTypeId = Object.values(productTypes)[0];
    
    const product = await createProduct(productData, categoryId, productTypeId);
    if (product) {
      successCount++;
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`\n📊 Results Summary:`);
  console.log(`- Products Attempted: ${totalCount}`);
  console.log(`- Products Created: ${successCount}`);
  console.log(`- Success Rate: ${((successCount/totalCount)*100).toFixed(1)}%`);
  
  if (successCount > 0) {
    console.log('\n✅ Successfully added food products to LocalFood backend!');
    console.log('The GUI should now show more realistic food items.');
  } else {
    console.log('\n⚠️ No products were created. Check permissions and API setup.');
  }
}

main().catch(console.error);