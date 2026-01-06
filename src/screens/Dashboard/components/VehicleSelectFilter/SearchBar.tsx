import React from 'react';
import {
  SearchContainer,
  SearchIcon,
  SearchInput,
  ClearButton,
  ClearButtonText,
} from './styles';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder,
}) => {
  return (
    <SearchContainer>
      <SearchInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9E9E9E"
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        blurOnSubmit={false}
        enablesReturnKeyAutomatically={true}
      />
      {value.length > 0 && (
        <ClearButton onPress={() => onChangeText('')}>
          <ClearButtonText>✕</ClearButtonText>
        </ClearButton>
      )}
    </SearchContainer>
  );
};
