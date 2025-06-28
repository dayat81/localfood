import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch?: (query: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  autoFocus?: boolean;
  showCancelButton?: boolean;
  onCancel?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search for food, restaurants...',
  value = '',
  onChangeText,
  onSearch,
  onFocus,
  onBlur,
  onClear,
  autoFocus = false,
  showCancelButton = false,
  onCancel,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const handleSubmit = useCallback(() => {
    if (value.trim()) {
      onSearch?.(value.trim());
    }
  }, [value, onSearch]);

  const handleClear = useCallback(() => {
    onChangeText?.('');
    onClear?.();
  }, [onChangeText, onClear]);

  const handleCancel = useCallback(() => {
    onChangeText?.('');
    setIsFocused(false);
    onCancel?.();
  }, [onChangeText, onCancel]);

  return (
    <View style={styles.container}>
      <View style={[
        styles.searchContainer,
        isFocused && styles.searchContainerFocused
      ]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999999"
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmit}
          autoFocus={autoFocus}
          returnKeyType="search"
          clearButtonMode="never" // We'll handle clear manually
        />
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      {(showCancelButton || isFocused) && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchContainerFocused: {
    borderColor: '#007AFF',
    backgroundColor: '#FFFFFF',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#666666',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 0, // Remove default padding
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  clearIcon: {
    fontSize: 14,
    color: '#999999',
  },
  cancelButton: {
    marginLeft: 12,
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default SearchBar;