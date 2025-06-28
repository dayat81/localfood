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
  slug: string;
  description?: string;
  seoDescription?: string;
  seoTitle?: string;
  isAvailableForPurchase?: boolean;
  availableForPurchase?: string;
  thumbnail?: {
    url: string;
    alt?: string;
  };
  images?: Array<{
    id: string;
    url: string;
    alt?: string;
  }>;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  productType?: {
    id: string;
    name: string;
    hasVariants?: boolean;
  };
  pricing?: {
    priceRange: {
      start: {
        gross: {
          amount: number;
          currency: string;
        };
        net: {
          amount: number;
          currency: string;
        };
      };
      stop: {
        gross: {
          amount: number;
          currency: string;
        };
        net: {
          amount: number;
          currency: string;
        };
      };
    };
    onSale?: boolean;
    discount?: {
      gross: {
        amount: number;
        currency: string;
      };
    };
  };
  variants?: ProductVariant[];
  attributes?: Array<{
    attribute: {
      id: string;
      name: string;
      slug: string;
    };
    values: Array<{
      id: string;
      name: string;
      slug: string;
      value?: string;
    }>;
  }>;
  rating?: number;
  weight?: {
    unit: string;
    value: number;
  };
  metadata?: Array<{
    key: string;
    value: string;
  }>;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  quantityAvailable?: number;
  pricing?: {
    price?: {
      gross: {
        amount: number;
        currency: string;
      };
      net: {
        amount: number;
        currency: string;
      };
    };
    onSale?: boolean;
    discount?: {
      gross: {
        amount: number;
        currency: string;
      };
    };
  };
  attributes?: Array<{
    attribute: {
      id: string;
      name: string;
      slug: string;
    };
    values: Array<{
      id: string;
      name: string;
      slug: string;
      value?: string;
    }>;
  }>;
  weight?: {
    unit: string;
    value: number;
  };
  product?: Product;
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
  Category: { categoryId: string; categoryName: string };
  Search: { initialQuery?: string };
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
  description?: string;
  seoDescription?: string;
  seoTitle?: string;
  backgroundImage?: {
    url: string;
    alt?: string;
  };
  level?: number;
  parent?: {
    id: string;
    name: string;
    slug: string;
  };
  children?: Category[];
  productCount?: number;
}