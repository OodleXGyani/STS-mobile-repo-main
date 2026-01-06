import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

interface HeaderProps {
  title: string;
  onClose: () => void;
  theme: any;
}

export const Header: React.FC<HeaderProps> = ({ title, onClose, theme }) => {
  return (
    <HeaderContainer>
      <Title theme={theme}>{title}</Title>
      <CloseButton onPress={onClose}>
        <CloseButtonText theme={theme}>✕</CloseButtonText>
      </CloseButton>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${scale(16)}px;
  border-bottom-width: 1px;
  border-bottom-color: #E5E5EA;
`;

const Title = styled.Text<{ theme: any }>`
  font-size: ${moderateScale(18)}px;
  font-weight: 600;
  color: ${props => props.theme.textColor};
`;

const CloseButton = styled.TouchableOpacity`
  width: ${scale(32)}px;
  height: ${scale(32)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${scale(16)}px;
  background-color: #F2F2F7;
`;

const CloseButtonText = styled.Text<{ theme: any }>`
  font-size: ${moderateScale(16)}px;
  color: ${props => props.theme.textColor};
`;