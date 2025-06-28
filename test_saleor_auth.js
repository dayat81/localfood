const axios = require('axios');

const SALEOR_URL = 'https://store-4bpwsmd6.saleor.cloud/graphql/';
const APP_TOKEN = '889c9f68459b4adea2b28b7d18670a6e.qh4yhYByf4b1Q5Zcq5NsvkvCtEmPgycg129mDpOi8QfDjyLn';
const BASIC_AUTH = Buffer.from('admin:admin').toString('base64');

async function testAuthentication() {
  console.log('Testing Saleor authentication methods...\n');

  // Test 1: Basic Auth only (public endpoint)
  console.log('1. Testing Basic Auth (public endpoint):');
  try {
    const response = await axios.post(SALEOR_URL, {
      query: 'query { shop { name } }'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${BASIC_AUTH}`
      }
    });
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.log('❌ Failed:', error.response?.data || error.message);
  }

  console.log('\n2. Testing App Token only (admin endpoint):');
  try {
    const response = await axios.post(SALEOR_URL, {
      query: 'query { channels { id name slug } }'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APP_TOKEN}`
      }
    });
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.log('❌ Failed:', error.response?.data || error.message);
  }

  console.log('\n3. Testing Basic Auth + App Token via proxy:');
  try {
    // Simulate what a proxy would do - first Basic Auth to get through Cloud protection
    // Then app token for actual operation
    console.log('This would require a proxy server to handle dual authentication');
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }

  console.log('\n4. Testing App Token with different formats:');
  
  // Test various header combinations
  const testHeaders = [
    { 'Authorization': `Bearer ${APP_TOKEN}`, 'X-Basic-Auth': `Basic ${BASIC_AUTH}` },
    { 'Authorization': `Bearer ${APP_TOKEN}`, 'Cookie': `basicAuth=${BASIC_AUTH}` },
    { 'Saleor-App-Token': APP_TOKEN, 'Authorization': `Basic ${BASIC_AUTH}` }
  ];

  for (let i = 0; i < testHeaders.length; i++) {
    console.log(`\n4.${i + 1}. Testing header combination ${i + 1}:`);
    try {
      const response = await axios.post(SALEOR_URL, {
        query: 'query { channels { id name slug } }'
      }, {
        headers: {
          'Content-Type': 'application/json',
          ...testHeaders[i]
        }
      });
      console.log('✅ Success:', response.data);
    } catch (error) {
      console.log('❌ Failed:', error.response?.status, error.response?.statusText);
    }
  }
}

// Check if we're running this script directly
if (require.main === module) {
  testAuthentication().catch(console.error);
}

module.exports = { testAuthentication };