import { Platform } from 'react-native';

// Shadow utility for consistent styling across components
export const createShadow = (elevation: number = 2, opacity: number = 0.22) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: elevation,
      },
      shadowOpacity: opacity,
      shadowRadius: elevation * 1.11,
    };
  }
  
  return {
    elevation,
  };
};

// Predefined shadow presets
export const shadows = {
  small: createShadow(1, 0.15),
  medium: createShadow(2, 0.22),
  large: createShadow(4, 0.3),
  card: createShadow(3, 0.25),
  button: createShadow(2, 0.2),
};
