// User types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  postalCode: string;
  country: {
    code: string;
    country: string;
  };
}

// Product types
export interface Product {
  id: string;
  name: string;
  description?: string;
  thumbnail?: {
    url: string;
  };
  pricing?: {
    priceRange: {
      start: {
        gross: {
          amount: number;
          currency: string;
        };
      };
    };
  };
  category?: {
    id: string;
    name: string;
  };
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  pricing?: {
    price?: {
      gross: {
        amount: number;
        currency: string;
      };
    };
  };
  product: Product;
}

// Cart types
export interface CartItem {
  variantId: string;
  productName: string;
  variantName?: string;
  quantity: number;
  price: number;
  currency: string;
  thumbnail?: string;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  currency: string;
}

// Order types
export interface Order {
  id: string;
  number: string;
  status: string;
  created: string;
  total: {
    gross: {
      amount: number;
      currency: string;
    };
  };
  lines: OrderLine[];
  shippingAddress?: Address;
}

export interface OrderLine {
  id: string;
  productName: string;
  variantName?: string;
  quantity: number;
  totalPrice: {
    gross: {
      amount: number;
      currency: string;
    };
  };
}

// Restaurant types
export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  cuisineType?: string;
  rating?: number;
  deliveryTime?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  operatingHours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ProductList: { categoryId?: string };
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  Orders: undefined;
  Profile: undefined;
};

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

// App state types
export interface AppState {
  auth: {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
  };
  cart: CartState;
  products: {
    items: Product[];
    loading: boolean;
    categories: Category[];
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}