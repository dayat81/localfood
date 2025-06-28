import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../types';
import { AppDispatch, RootState } from '../../store';
import { fetchCategories } from '../../store/slices/productSlice';
import CategoryList from '../../components/categories/CategoryList';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to LocalFood</Text>
          <Text style={styles.subtitle}>
            Discover amazing local restaurants and order your favorite meals
          </Text>
        </View>

        <View style={styles.categorySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProductList', {})}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <CategoryList 
            categories={categories.slice(0, 6)}
            horizontal={true}
            showProductCount={false}
          />
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search', {})}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchButtonText}>Search for food, restaurants...</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('ProductList', {})}
          >
            <Text style={styles.primaryButtonText}>Browse Restaurants</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.secondaryButtonText}>View Cart</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.authContainer}>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.authButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.authButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Orders')}
          >
            <Text style={styles.actionButtonText}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.actionButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  categorySection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  seeAllText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#999999',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  secondaryButtonText: {
    color: '#2E7D32',
    fontSize: 18,
    fontWeight: 'bold',
  },
  authContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  authButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  actionButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default HomeScreen;