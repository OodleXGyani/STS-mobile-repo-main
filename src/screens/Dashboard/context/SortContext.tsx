import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { SortState } from './types';
import { useLiveTrack } from './LiveTrackContext';
import { useFilterState } from './FilterStateContext';

// ===== CONTEXT STATE =====

interface SortContextState {
  sortModalVisible: boolean;
}

// ===== CONTEXT ACTIONS =====

interface SortContextActions {
  sort: SortState; // Add sort property
  updateSort: (sort: Partial<SortState>) => void;
  resetSort: () => void;
  setSortModalVisible: (visible: boolean) => void;
}

// ===== CONTEXT TYPE =====

type SortContextType = SortContextState & SortContextActions;

// ===== INITIAL STATE =====

const initialState: SortContextState = {
  sortModalVisible: false,
};

// ===== CONTEXT CREATION =====

const SortContext = createContext<SortContextType | undefined>(undefined);

// ===== PROVIDER COMPONENT =====

interface SortProviderProps {
  children: ReactNode;
}

export const SortProvider: React.FC<SortProviderProps> = ({ children }) => {
  const [state, setState] = useState<SortContextState>(initialState);
  
  // Get the fetchLiveTrackData function from LiveTrack context
  const { fetchLiveTrackData } = useLiveTrack();
  
  // Get sort state management from FilterStateContext
  const { sort, updateSort: updateSortState, resetSort: resetSortState } = useFilterState();

  // ===== ACTIONS =====
  
  const updateSort = useCallback(async (sortUpdate: Partial<SortState>) => {
    try {
      // Update sort state in FilterStateContext
      updateSortState(sortUpdate);
      
      console.log('🚀 Sort updated in FilterStateContext:', sortUpdate);
      console.log('📊 LiveTrackContext will automatically detect the change and fetch new data');
      
      // Don't call fetchLiveTrackData here - let LiveTrackContext handle it automatically
      // when it detects the state change via useFilterState()
      
    } catch (error) {
      console.error('❌ Error updating sort state:', error);
    }
  }, [updateSortState]);

  const resetSort = () => {
    resetSortState();
  };

  const setSortModalVisible = (visible: boolean) => {
    setState(prev => ({ ...prev, sortModalVisible: visible }));
  };

  // ===== CONTEXT VALUE =====
  
  const contextValue: SortContextType = {
    ...state,
    sort, // Get sort from FilterStateContext
    updateSort,
    resetSort,
    setSortModalVisible,
  };

  return (
    <SortContext.Provider value={contextValue}>
      {children}
    </SortContext.Provider>
  );
};

// ===== HOOK =====

export const useSort = (): SortContextType => {
  const context = useContext(SortContext);
  if (context === undefined) {
    throw new Error('useSort must be used within a SortProvider');
  }
  return context;
};
