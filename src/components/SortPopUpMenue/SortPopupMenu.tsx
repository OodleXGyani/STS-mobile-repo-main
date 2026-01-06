import React from 'react';
import { Menu, MenuTrigger, MenuOptions } from 'react-native-popup-menu';
import {  SectionTitle, Section, Divider } from './SortPopupMenu.styles';
import { RadioButton } from './RadioButton';
import {
  SORT_BY_OPTIONS,
  SORT_TYPE_OPTIONS,
  GROUP_BY_OPTIONS,
} from './radioOptions';
import { SortPopupMenuProps } from './SortPopupMenu.types';

export const SortPopupMenu: React.FC<SortPopupMenuProps> = ({
  visible,
  currentState,
  onChange,
  onClose,
}) => {
  const handleSelect = (field: keyof typeof currentState, key: string) => {
    onChange({ ...currentState, [field]: key });
  };

  if (!visible) return null;

  return (
    <Menu opened={visible} onBackdropPress={onClose}>
      <MenuTrigger></MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsWrapper: {
            position: 'relative',
            zIndex: 1000,
          },
          optionsContainer: {
            borderRadius: 12,
            backgroundColor: '#fff',
            padding: 20,
            elevation: 5,
          },
        }}
      >
        <Section>
          <SectionTitle>Sort By</SectionTitle>
          {SORT_BY_OPTIONS.map(option => (
            <RadioButton
              key={option.key}
              label={option.label}
              checked={currentState.sortBy === option.key}
              onPress={() => handleSelect('sortBy', option.key)}
            />
          ))}
        </Section>
        <Divider/>
        <Section>
          <SectionTitle>Sort Type</SectionTitle>
          {SORT_TYPE_OPTIONS.map(option => (
            <RadioButton
              key={option.key}
              label={option.label}
              checked={currentState.sortType === option.key}
              onPress={() => handleSelect('sortType', option.key)}
            />
          ))}
        </Section>
        <Divider/>

        <Section>
          <SectionTitle>Group By</SectionTitle>
          {GROUP_BY_OPTIONS.map(option => (
            <RadioButton
              key={option.key}
              label={option.label}
              checked={currentState.groupBy === option.key}
              onPress={() => handleSelect('groupBy', option.key)}
            />
          ))}
        </Section>
      </MenuOptions>
    </Menu>
  );
};
