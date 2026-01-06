import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, Modal, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../../../../../constants/colors';

interface YearMonthSelectionProps {
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

const YearMonthSelection: React.FC<YearMonthSelectionProps> = ({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}) => {
  const [showYearModal, setShowYearModal] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);

  // Generate years from current year down to 2000
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

  // Generate months (1-12)
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  // Filter months based on selected year
  const getAvailableMonths = () => {
    if (selectedYear === currentYear) {
      // For current year, only show months up to one month before current month
      const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11, we need 1-12
      return months.filter(month => month.value < currentMonth);
    } else {
      // For previous years, show all months
      return months;
    }
  };

  const availableMonths = getAvailableMonths();

  const handleYearSelect = (year: number) => {
    onYearChange(year);
    setShowYearModal(false);
    
    // If selected month is not available for the new year, reset to first available month
    const newAvailableMonths = months.filter(month => {
      if (year === currentYear) {
        const currentMonth = new Date().getMonth() + 1;
        return month.value < currentMonth;
      }
      return true;
    });
    
    if (!newAvailableMonths.some(month => month.value === selectedMonth)) {
      onMonthChange(newAvailableMonths[0]?.value || 1);
    }
  };

  const handleMonthSelect = (month: number) => {
    onMonthChange(month);
    setShowMonthModal(false);
  };

  const renderYearItem = ({ item }: { item: number }) => (
    <DropdownItem
      onPress={() => handleYearSelect(item)}
      isSelected={item === selectedYear}
    >
      <DropdownItemText isSelected={item === selectedYear}>
        {item}
      </DropdownItemText>
    </DropdownItem>
  );

  const renderMonthItem = ({ item }: { item: { value: number; label: string } }) => (
    <DropdownItem
      onPress={() => handleMonthSelect(item.value)}
      isSelected={item.value === selectedMonth}
    >
      <DropdownItemText isSelected={item.value === selectedMonth}>
        {item.label}
      </DropdownItemText>
    </DropdownItem>
  );

  return (
    <Section>
      <SectionLabel>Select Year & Month</SectionLabel>
      <DropdownRow>
        {/* Year Dropdown */}
        <DropdownContainer>
          <DropdownButton onPress={() => setShowYearModal(true)}>
            <DropdownButtonText>{selectedYear}</DropdownButtonText>
          </DropdownButton>
        </DropdownContainer>

        {/* Month Dropdown */}
        <DropdownContainer>
          <DropdownButton onPress={() => setShowMonthModal(true)}>
            <DropdownButtonText>
              {months.find(m => m.value === selectedMonth)?.label || 'Select Month'}
            </DropdownButtonText>
          </DropdownButton>
        </DropdownContainer>
      </DropdownRow>

      {/* Year Modal */}
      <Modal
        visible={showYearModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowYearModal(false)}
      >
        <ModalOverlay onPress={() => setShowYearModal(false)}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Select Year</ModalTitle>
              <CloseButton onPress={() => setShowYearModal(false)}>
                <CloseButtonText>✕</CloseButtonText>
              </CloseButton>
            </ModalHeader>
            <FlatList
              data={years}
              renderItem={renderYearItem}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: verticalScale(300) }}
            />
          </ModalContent>
        </ModalOverlay>
      </Modal>

      {/* Month Modal */}
      <Modal
        visible={showMonthModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthModal(false)}
      >
        <ModalOverlay onPress={() => setShowMonthModal(false)}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Select Month</ModalTitle>
              <CloseButton onPress={() => setShowMonthModal(false)}>
                <CloseButtonText>✕</CloseButtonText>
              </CloseButton>
            </ModalHeader>
            <FlatList
              data={availableMonths}
              renderItem={renderMonthItem}
              keyExtractor={(item) => item.value.toString()}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: verticalScale(300) }}
            />
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Section>
  );
};

const Section = styled.View`
  margin-bottom: ${verticalScale(24)}px;
`;

const SectionLabel = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-weight: 600;
  color: #333333;
  margin-bottom: ${verticalScale(12)}px;
`;

const DropdownRow = styled.View`
  flex-direction: row;
  gap: ${scale(12)}px;
`;

const DropdownContainer = styled.View`
  flex: 1;
`;

const DropdownButton = styled.TouchableOpacity`
  background-color: #e3f2fd;
  padding: ${verticalScale(16)}px ${scale(20)}px;
  border-radius: ${scale(8)}px;
  align-items: center;
`;

const DropdownButtonText = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-weight: 500;
  color: ${Colors.primary_blue_color};
`;

const ModalOverlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: ${verticalScale(20)}px;
`;

const ModalContent = styled.View`
  background-color: #ffffff;
  border-radius: ${scale(12)}px;
  width: 100%;
  max-width: ${scale(300)}px;
  max-height: ${verticalScale(400)}px;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${verticalScale(16)}px ${scale(20)}px;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
`;

const ModalTitle = styled.Text`
  font-size: ${moderateScale(18)}px;
  font-weight: 600;
  color: #333333;
`;

const CloseButton = styled.TouchableOpacity`
  padding: ${verticalScale(4)}px;
`;

const CloseButtonText = styled.Text`
  font-size: ${moderateScale(18)}px;
  color: #666666;
`;

const DropdownItem = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding: ${verticalScale(16)}px ${scale(20)}px;
  background-color: ${({ isSelected }) => (isSelected ? '#e3f2fd' : 'transparent')};
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const DropdownItemText = styled.Text<{ isSelected: boolean }>`
  font-size: ${moderateScale(16)}px;
  color: ${({ isSelected }) => (isSelected ? Colors.primary_blue_color : '#333333')};
  font-weight: ${({ isSelected }) => (isSelected ? '600' : '400')};
`;

export default YearMonthSelection;
