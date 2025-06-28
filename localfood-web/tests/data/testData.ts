export const testData = {
  users: {
    validUser: {
      email: 'test@localfood.com',
      password: 'TestPassword123!'
    }
  },
  
  products: {
    pizza: {
      name: 'Margherita Pizza',
      category: 'Italian',
      price: '$15.99'
    }
  },
  
  locations: {
    defaultLocation: {
      city: 'New York',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    }
  },
  
  search: {
    validQueries: ['pizza', 'burger', 'sushi'],
    invalidQueries: ['', '   ', '!@#$%']
  }
};