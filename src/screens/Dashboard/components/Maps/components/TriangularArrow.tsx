import styled from 'styled-components/native';
import React from 'react';
import { View } from 'react-native';

// Main Arrow
const Arrow = styled.View<{ color: string }>`
  width: 0px;
  height: 0px;
  background-color: transparent;
  border-left-width: 18px;
  border-right-width: 18px;
  border-bottom-width: 38px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: ${(props) => props.color};
`;

// Bottom Mask to simulate indented base
const BottomMask = styled.View`
  position: absolute;
  top: 26px;         // Move upwards so tip is masked only at base
  left: -7px;        // Center horizontally
  width: 0px;
  height: 0px;
  border-left-width: 11px;
  border-right-width: 11px;
  border-top-width: 9px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: white; // Should match map background
`;

export const TriangleArrow: React.FC<{ color: string }> = ({ color }) => (
  <View style={{ width: 36, height: 38 }}>
    <Arrow color={color} />
    <BottomMask />
  </View>
);
