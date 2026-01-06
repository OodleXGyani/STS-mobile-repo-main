import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Vehicle, Group, Area } from './types';

// ===== CONTEXT STATE =====

interface UIContextState {
  selectedVehicle: Vehicle | null;
  selectedGroup: Group | null;
  selectedArea: Area | null;
}

// ===== CONTEXT ACTIONS =====

interface UIContextActions {
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  setSelectedGroup: (group: Group | null) => void;
  setSelectedArea: (area: Area | null) => void;
  clearSelections: () => void;
}

// ===== CONTEXT TYPE =====

type UIContextType = UIContextState & UIContextActions;

// ===== INITIAL STATE =====

const initialState: UIContextState = {
  selectedVehicle: null,
  selectedGroup: null,
  selectedArea: null,
};

// ===== CONTEXT CREATION =====

const UIContext = createContext<UIContextType | undefined>(undefined);

// ===== PROVIDER COMPONENT =====

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [state, setState] = useState<UIContextState>(initialState);

  // ===== ACTIONS =====
  
  const setSelectedVehicle = (vehicle: Vehicle | null) => {
    setState(prev => ({ ...prev, selectedVehicle: vehicle }));
  };

  const setSelectedGroup = (group: Group | null) => {
    setState(prev => ({ ...prev, selectedGroup: group }));
  };

  const setSelectedArea = (area: Area | null) => {
    setState(prev => ({ ...prev, selectedArea: area }));
  };

  const clearSelections = () => {
    setState(initialState);
  };

  // ===== CONTEXT VALUE =====
  
  const contextValue: UIContextType = {
    ...state,
    setSelectedVehicle,
    setSelectedGroup,
    setSelectedArea,
    clearSelections,
  };

  return (
    <UIContext.Provider value={contextValue}>
      {children}
    </UIContext.Provider>
  );
};

// ===== HOOK =====

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
