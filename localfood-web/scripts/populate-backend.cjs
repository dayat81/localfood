const { default: fetch } = require('node-fetch');

// Saleor API Configuration
const SALEOR_ENDPOINT = 'https://store-4bpwsmd6.saleor.cloud/graphql/';
const APP_TOKEN = '889c9f68459b4adea2b28b7d18670a6e.qh4yhYByf4b1Q5Zcq5NsvkvCtEmPgycg129mDpOi8QfDjyLn';
const BASIC_AUTH = 'Basic YWRtaW46YWRtaW4='; // admin:admin

// Helper function to make GraphQL requests
async function executeGraphQL(query, variables = {}, requiresAuth = true) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': BASIC_AUTH,
  };
  
  // Use the WORKING authentication pattern from the logs
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
    
    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      return { success: false, errors: result.errors };
    }
    
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Network Error:', error);
    return { success: false, error: error.message };
  }
}

// Test API connectivity
async function testConnection() {
  console.log('Testing Saleor API connection...');
  
  const query = `
    query {
      shop {
        name
        description
        domain {
          host
        }
      }
    }
  `;
  
  const result = await executeGraphQL(query, {}, false);
  
  if (result.success) {
    console.log('✅ Connection successful!');
    console.log('Shop:', result.data.shop);
    return true;
  } else {
    console.log('❌ Connection failed:', result.errors || result.error);
    return false;
  }
}

// Check current categories
async function checkCurrentCategories() {
  console.log('Checking existing categories...');
  
  const query = `
    query {
      categories(first: 50) {
        edges {
          node {
            id
            name
            slug
            children(first: 10) {
              edges {
                node {
                  id
                  name
                  slug
                }
              }
            }
          }
        }
      }
    }
  `;
  
  const result = await executeGraphQL(query, {}, false);
  
  if (result.success) {
    const categories = result.data.categories.edges;
    console.log(`Found ${categories.length} existing categories:`);
    categories.forEach(cat => {
      console.log(`- ${cat.node.name} (${cat.node.slug})`);
      if (cat.node.children.edges.length > 0) {
        cat.node.children.edges.forEach(child => {
          console.log(`  └─ ${child.node.name} (${child.node.slug})`);
        });
      }
    });
    return categories;
  } else {
    console.log('❌ Failed to fetch categories:', result.errors || result.error);
    return [];
  }
}

// Create a category
async function createCategory(name, slug, description, parentId = null) {
  console.log(`Creating category: ${name}...`);
  
  const mutation = `
    mutation CreateCategory($input: CategoryInput!) {
      categoryCreate(input: $input) {
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
  
  const variables = {
    input: {
      name,
      slug,
      description,
      ...(parentId && { parent: parentId })
    }
  };
  
  const result = await executeGraphQL(mutation, variables, true);
  
  if (result.success && result.data.categoryCreate.category) {
    console.log(`✅ Created category: ${name}`);
    return result.data.categoryCreate.category;
  } else {
    console.log(`❌ Failed to create category ${name}:`, 
      result.data?.categoryCreate?.errors || result.errors || result.error);
    return null;
  }
}

// Food Categories Data
const CATEGORIES_DATA = [
  {
    name: "Pizza & Italian",
    slug: "pizza-italian", 
    description: "Authentic Italian cuisine and artisan pizzas",
    subcategories: [
      {name: "Neapolitan Pizza", slug: "neapolitan-pizza", description: "Traditional wood-fired Neapolitan style pizzas"},
      {name: "Pasta Classics", slug: "pasta-classics", description: "Traditional Italian pasta dishes"},
      {name: "Italian Salads", slug: "italian-salads", description: "Fresh Italian-style salads and antipasti"}
    ]
  },
  {
    name: "Burgers & American",
    slug: "burgers-american",
    description: "Classic American burgers, wings, and comfort food",
    subcategories: [
      {name: "Gourmet Burgers", slug: "gourmet-burgers", description: "Premium handcrafted burgers"},
      {name: "Wings & Sides", slug: "wings-sides", description: "Chicken wings and American sides"},
      {name: "BBQ Classics", slug: "bbq-classics", description: "Barbecue specialties and smoked meats"}
    ]
  },
  {
    name: "Asian Cuisine",
    slug: "asian-cuisine",
    description: "Authentic Asian dishes from across the continent",
    subcategories: [
      {name: "Chinese Classics", slug: "chinese-classics", description: "Traditional Chinese dishes"},
      {name: "Thai Specialties", slug: "thai-specialties", description: "Authentic Thai cuisine"},
      {name: "Japanese Favorites", slug: "japanese-favorites", description: "Sushi, ramen, and Japanese specialties"},
      {name: "Korean Dishes", slug: "korean-dishes", description: "Korean BBQ and traditional dishes"}
    ]
  },
  {
    name: "Mexican & Latin",
    slug: "mexican-latin",
    description: "Vibrant Mexican and Latin American flavors",
    subcategories: [
      {name: "Tacos & Burritos", slug: "tacos-burritos", description: "Authentic tacos and burritos"},
      {name: "Mexican Appetizers", slug: "mexican-appetizers", description: "Nachos, guacamole, and starters"},
      {name: "Latin Specialties", slug: "latin-specialties", description: "Latin American regional dishes"}
    ]
  },
  {
    name: "Healthy & Salads",
    slug: "healthy-salads",
    description: "Fresh, nutritious, and health-conscious options",
    subcategories: [
      {name: "Power Bowls", slug: "power-bowls", description: "Nutritious grain and protein bowls"},
      {name: "Fresh Salads", slug: "fresh-salads", description: "Garden fresh salads and greens"},
      {name: "Smoothie Bowls", slug: "smoothie-bowls", description: "Acai and fruit smoothie bowls"}
    ]
  },
  {
    name: "Desserts & Sweets",
    slug: "desserts-sweets",
    description: "Delicious desserts and sweet treats",
    subcategories: [
      {name: "Cakes & Pastries", slug: "cakes-pastries", description: "Freshly baked cakes and pastries"},
      {name: "Ice Cream", slug: "ice-cream", description: "Premium ice cream and frozen treats"},
      {name: "Cookies & Brownies", slug: "cookies-brownies", description: "Homemade cookies and brownies"}
    ]
  },
  {
    name: "Beverages",
    slug: "beverages",
    description: "Refreshing drinks and specialty beverages",
    subcategories: [
      {name: "Coffee & Tea", slug: "coffee-tea", description: "Artisan coffee and premium teas"},
      {name: "Fresh Juices", slug: "fresh-juices", description: "Freshly squeezed juices and smoothies"},
      {name: "Soft Drinks", slug: "soft-drinks", description: "Sodas and carbonated beverages"}
    ]
  },
  {
    name: "Breakfast & Brunch",
    slug: "breakfast-brunch",
    description: "Morning favorites and brunch specialties",
    subcategories: [
      {name: "Pancakes & Waffles", slug: "pancakes-waffles", description: "Fluffy pancakes and Belgian waffles"},
      {name: "Breakfast Classics", slug: "breakfast-classics", description: "Eggs, bacon, and morning staples"}
    ]
  }
];

// Create all categories
async function createCategoryHierarchy() {
  console.log('\n=== Creating Category Hierarchy ===');
  
  const createdCategories = [];
  
  for (const categoryData of CATEGORIES_DATA) {
    // Create parent category
    const parentCategory = await createCategory(
      categoryData.name,
      categoryData.slug,
      categoryData.description
    );
    
    if (parentCategory) {
      createdCategories.push(parentCategory);
      
      // Create subcategories
      for (const subcat of categoryData.subcategories) {
        const subcategory = await createCategory(
          subcat.name,
          subcat.slug,
          subcat.description,
          parentCategory.id
        );
        
        if (subcategory) {
          createdCategories.push(subcategory);
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Add delay between parent categories
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n✅ Created ${createdCategories.length} categories total`);
  return createdCategories;
}

// Main execution function
async function main() {
  console.log('🚀 Starting LocalFood Backend Data Population');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Target: Saleor Cloud Backend\n');
  
  // Test connection
  const connected = await testConnection();
  if (!connected) {
    console.log('❌ Cannot proceed without API connection');
    return;
  }
  
  // Check existing categories
  await checkCurrentCategories();
  
  // Create category hierarchy
  await createCategoryHierarchy();
  
  // Check final state
  console.log('\n=== Final Category Check ===');
  await checkCurrentCategories();
  
  console.log('\n🎉 Phase 1 Complete: Category hierarchy created!');
  console.log('Timestamp:', new Date().toISOString());
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  executeGraphQL,
  testConnection,
  createCategory,
  createCategoryHierarchy
};