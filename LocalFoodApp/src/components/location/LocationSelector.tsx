import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  fetchCurrentLocation,
  setCurrentLocation,
  requestPermission,
} from '../../store/slices/locationSlice';
import { formatDistance } from '../../utils/location';

interface LocationSelectorProps {
  onLocationChange?: () => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentLocation, loading, permissionStatus } = useSelector(
    (state: RootState) => state.location
  );
  const [showModal, setShowModal] = useState(false);
  const [manualAddress, setManualAddress] = useState('');

  const handleUseCurrentLocation = async () => {
    if (permissionStatus !== 'granted') {
      const granted = await dispatch(requestPermission()).unwrap();
      if (!granted) {
        return;
      }
    }

    await dispatch(fetchCurrentLocation());
    setShowModal(false);
    onLocationChange?.();
  };

  const handleManualLocation = () => {
    // In a real app, this would geocode the address
    // For now, we'll just set a dummy location
    dispatch(setCurrentLocation({
      latitude: 37.7749,
      longitude: -122.4194,
    }));
    setShowModal(false);
    onLocationChange?.();
  };

  const getLocationText = () => {
    if (currentLocation) {
      return `Current Location`;
    }
    return 'Set Location';
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setShowModal(true)}
      >
        <View style={styles.locationIcon}>
          <Text style={styles.locationIconText}>📍</Text>
        </View>
        <Text style={styles.locationText}>{getLocationText()}</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Delivery Location</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.locationOption}
              onPress={handleUseCurrentLocation}
              disabled={loading}
            >
              <View style={styles.optionIcon}>
                <Text style={styles.optionIconText}>📍</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Use Current Location</Text>
                <Text style={styles.optionSubtitle}>
                  {loading ? 'Getting location...' : 'Enable location services'}
                </Text>
              </View>
              {loading && <ActivityIndicator size="small" color="#007AFF" />}
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.manualSection}>
              <Text style={styles.sectionTitle}>Or enter address manually</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your address"
                value={manualAddress}
                onChangeText={setManualAddress}
                returnKeyType="done"
                onSubmitEditing={handleManualLocation}
              />
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !manualAddress && styles.confirmButtonDisabled
                ]}
                onPress={handleManualLocation}
                disabled={!manualAddress}
              >
                <Text style={styles.confirmButtonText}>Confirm Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  locationIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  locationIconText: {
    fontSize: 18,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  chevron: {
    fontSize: 20,
    color: '#999999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#999999',
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionIconText: {
    fontSize: 20,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  manualSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 12,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LocationSelector;