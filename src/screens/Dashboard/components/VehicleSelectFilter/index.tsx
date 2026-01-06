import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import {
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verticalScale, moderateScale } from 'react-native-size-matters';

import { Vehicle, SelectVehiclePopupProps } from './types';
import { VehicleItem } from './VehicleItem';
import { SearchBar } from './SearchBar';

import {
  Container,
  Header,
  HeaderTitle,
  CloseButton,
  CloseButtonText,
  SelectAllButton,
  SelectAllButtonText,
} from './styles';

export const SelectVehiclePopup: React.FC<SelectVehiclePopupProps> = ({
  visible,
  onClose,
  onConfirm,
  selectedVehicles = [],
  maxSelection = 10,
  vehicles = [],
}) => {
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [localSelectedVehicles, setLocalSelectedVehicles] =
    useState<Vehicle[]>([]);

  const hasEverInitialized = useRef(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // =======================
  // SAFE VEHICLE SOURCE
  // =======================

  const realVehicles = useMemo(() => vehicles ?? [], [vehicles]);

  // =======================
  // FILTER LOGIC (FIXED)
  // =======================

const filteredVehicles = useMemo(() => {
  const q = searchQuery.trim().toLowerCase();

  if (!q) return realVehicles;

  return realVehicles.filter((vehicle: Vehicle) => {
    const vehicleNumber = vehicle.vehicleNumber ?? '';
    const driver = vehicle.driverName ?? '';
    const location = vehicle.location ?? '';

    return (
      vehicleNumber.toLowerCase().includes(q) ||
      driver.toLowerCase().includes(q) ||
      location.toLowerCase().includes(q)
    );
  });
}, [realVehicles, searchQuery]);




  // =======================
  // SELECTION HANDLING
  // =======================

  const handleVehicleToggle = useCallback((vehicle: Vehicle) => {
    setLocalSelectedVehicles(prev => {
      const exists = prev.some(v => v.id === vehicle.id);
      return exists
        ? prev.filter(v => v.id !== vehicle.id)
        : [...prev, vehicle];
    });
  }, []);

  const isAllSelected =
    filteredVehicles.length > 0 &&
    filteredVehicles.every(v =>
      localSelectedVehicles.some(s => s.id === v.id),
    );

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setLocalSelectedVehicles(prev =>
        prev.filter(
          v => !filteredVehicles.some(f => f.id === v.id),
        ),
      );
    } else {
      setLocalSelectedVehicles(prev => {
        const merged = [...prev];
        filteredVehicles.forEach(v => {
          if (!merged.some(m => m.id === v.id)) {
            merged.push(v);
          }
        });
        return merged.slice(0, maxSelection);
      });
    }
  }, [filteredVehicles, isAllSelected, maxSelection]);

  // =======================
  // CONFIRM / CLOSE
  // =======================

  const handleClose = useCallback(() => {
    onConfirm(localSelectedVehicles);
    setSearchQuery('');
    onClose();
  }, [localSelectedVehicles, onConfirm, onClose]);

  // =======================
  // SYNC FROM DASHBOARD
  // =======================

  useEffect(() => {
    if (selectedVehicles.length > 0) {
      setLocalSelectedVehicles(selectedVehicles);
    }
  }, [selectedVehicles]);

  // =======================
  // FIRST OPEN INITIALIZE
  // =======================

  useEffect(() => {
    if (visible && realVehicles.length > 0 && !hasEverInitialized.current) {
      setLocalSelectedVehicles(realVehicles);
      hasEverInitialized.current = true;
    }
  }, [visible, realVehicles]);

  // =======================
  // SCROLL RESET
  // =======================

  useEffect(() => {
    if (searchQuery && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [searchQuery]);

  // =======================
  // EMPTY STATE
  // =======================

  if (realVehicles.length === 0) {
    return null;
  }

  // =======================
  // RENDER
  // =======================

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={handleClose}
      transparent
    >
      <View
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      />

      <Container
        insets={insets}
        style={{
          margin: moderateScale(15),
          marginTop: moderateScale(60),
          marginBottom: moderateScale(40),
          borderRadius: moderateScale(16),
          maxHeight: '90%',
        }}
      >
        <CloseButton
          onPress={handleClose}
          style={{
            position: 'absolute',
            top: -moderateScale(16),
            left: '50%',
            transform: [{ translateX: -moderateScale(16) }],
            zIndex: 10,
          }}
        >
          <CloseButtonText>✕</CloseButtonText>
        </CloseButton>

        <Header>
          <HeaderTitle>
            Select Vehicles ({realVehicles.length})
          </HeaderTitle>

          <SelectAllButton onPress={handleSelectAll}>
            <SelectAllButtonText>
              {isAllSelected ? 'Unselect All' : 'Select All'}
            </SelectAllButtonText>
          </SelectAllButton>
        </Header>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            ref={scrollViewRef}
            keyboardShouldPersistTaps="handled"
          >
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search vehicles, drivers, locations..."
            />

            <FlatList
              data={filteredVehicles}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <VehicleItem
                  vehicle={item}
                  isSelected={localSelectedVehicles.some(
                    v => v.id === item.id,
                  )}
                  onToggle={() => handleVehicleToggle(item)}
                />
              )}
              scrollEnabled={false}
              contentContainerStyle={{
                paddingBottom: verticalScale(20),
              }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    </Modal>
  );
};
