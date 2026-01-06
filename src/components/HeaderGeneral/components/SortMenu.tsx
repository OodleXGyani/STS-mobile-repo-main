import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import FastImage from 'react-native-fast-image';
import { Colors } from '../../../constants/colors';
import { RadioButton } from '../../SortPopUpMenue/RadioButton';

const sortIcon = require('../../../assets/icons/sort_white.png');

interface SortOption {
  value: string;
  label: string;
}

interface SortMenuProps {
  sortBy: string;
  sortType: string;
  onSelect: (value: string) => void;
  options: SortOption[]; // dynamic fields (e.g., name, cpr, employee_id)
  showTypeOptions?: boolean; // whether to show asc/desc or not
}

const SortMenu: React.FC<SortMenuProps> = ({
  sortBy,
  sortType,
  onSelect,
  options,
  showTypeOptions = true,
}) => {
  return (
    <Menu onSelect={value => onSelect(value)}>
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: TouchableOpacity,
          triggerTouchable: { activeOpacity: 0.5 },
        }}
      >
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          style={styles.icon}
          source={sortIcon}
        />
      </MenuTrigger>

      <MenuOptions customStyles={menuStyles}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionText}>Sort By</Text>
        </View>

        {options.map(opt => (
          <MenuOption
            key={opt.value}
            value={opt.value}
            customStyles={{
              OptionTouchableComponent: TouchableOpacity,
              optionTouchable: { activeOpacity: 0.5 },
            }}
          >
            <View style={styles.optionRow}>
              <RadioButton
                label={opt.label}
                checked={sortBy === opt.value}
                onPress={() => onSelect(opt.value)}
              />
              {/* <Text style={styles.optionText}>{opt.label}</Text> */}
            </View>
          </MenuOption>
        ))}

        {showTypeOptions && (
          <>
            <View style={styles.separator} />
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionText}>Sort Type</Text>
            </View>
            {['asc', 'desc'].map(type => (
              <MenuOption
                key={type}
                value={type}
                customStyles={{
                  OptionTouchableComponent: TouchableOpacity,
                  optionTouchable: { activeOpacity: 0.5 },
                }}
              >
                <View style={styles.optionRow}>
                  <RadioButton
                    label={type === 'asc' ? 'Ascending' : 'Descending'}
                    checked={sortType === type}
                    onPress={() => onSelect(type)}
                  />
                  {/* <Text style={styles.optionText}>
                    {type === 'asc' ? 'Ascending' : 'Descending'}
                  </Text> */}
                </View>
              </MenuOption>
            ))}
          </>
        )}
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  icon: { width: 20, height: 20 },
  sectionHeader: { marginHorizontal: 10, marginVertical: 5 },
  sectionText: {
    fontSize: 14,
    color: Colors.contextMenuBackground,
    textAlign: 'center',
  },
  optionRow: { flexDirection: 'row', alignItems: 'center', margin: 5 },
  optionText: {
    marginLeft: 10,
    fontSize: 12,
    color: Colors.contextMenuBackground,
  },
  separator: {
    width: '100%',
    height: 2,
    marginVertical: 5,
    backgroundColor: Colors.contextMenuBackground,
  },
});

const menuStyles = {
  optionsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    paddingVertical: 8,
    width: 180,
  },
};

export default SortMenu;
