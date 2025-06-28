import { gql } from '@apollo/client';
import { client, saveAuthToken, removeAuthToken } from './apollo';

// GraphQL Mutations for authentication
export const TOKEN_CREATE = gql`
  mutation TokenCreate($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      refreshToken
      csrfToken
      user {
        id
        email
        firstName
        lastName
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const TOKEN_REFRESH = gql`
  mutation TokenRefresh($refreshToken: String!) {
    tokenRefresh(refreshToken: $refreshToken) {
      token
      errors {
        field
        message
        code
      }
    }
  }
`;

export const ACCOUNT_REGISTER = gql`
  mutation AccountRegister($input: AccountRegisterInput!) {
    accountRegister(input: $input) {
      user {
        id
        email
        firstName
        lastName
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      addresses {
        id
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
        postalCode
        country {
          code
          country
        }
      }
    }
  }
`;

// Authentication service functions
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  errors?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

export const login = async ({ email, password }: LoginInput): Promise<AuthResponse> => {
  try {
    const { data } = await client.mutate({
      mutation: TOKEN_CREATE,
      variables: { email, password }
    });

    const { token, user, errors } = data.tokenCreate;

    if (errors && errors.length > 0) {
      return {
        success: false,
        errors
      };
    }

    if (token && user) {
      await saveAuthToken(token);
      return {
        success: true,
        user,
        token
      };
    }

    return {
      success: false,
      errors: [{ field: 'general', message: 'Login failed', code: 'LOGIN_FAILED' }]
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      errors: [{ field: 'general', message: 'Network error', code: 'NETWORK_ERROR' }]
    };
  }
};

export const register = async ({ email, password, firstName, lastName }: RegisterInput): Promise<AuthResponse> => {
  try {
    const { data } = await client.mutate({
      mutation: ACCOUNT_REGISTER,
      variables: {
        input: {
          email,
          password,
          firstName,
          lastName
        }
      }
    });

    const { user, errors } = data.accountRegister;

    if (errors && errors.length > 0) {
      return {
        success: false,
        errors
      };
    }

    if (user) {
      // After successful registration, automatically log in
      return await login({ email, password });
    }

    return {
      success: false,
      errors: [{ field: 'general', message: 'Registration failed', code: 'REGISTRATION_FAILED' }]
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      errors: [{ field: 'general', message: 'Network error', code: 'NETWORK_ERROR' }]
    };
  }
};

export const logout = async (): Promise<void> => {
  try {
    await removeAuthToken();
    // Clear Apollo cache
    await client.clearStore();
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data } = await client.query({
      query: ME_QUERY,
      fetchPolicy: 'network-only'
    });

    return data.me;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};