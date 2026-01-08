import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { FilterState } from './types';
import { useLiveTrack } from './LiveTrackContext';
import { useFilterState } from './FilterStateContext';

// ===== CONTEXT STATE =====

interface FilterContextState {
  filterModalVisible: boolean;
}

// ===== CONTEXT ACTIONS =====

interface FilterContextActions {
  filters: FilterState; // Add filters property
  updateFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  resetFilters: () => void;
  toggleStatusFilter: (statusKey: string) => void;
  toggleLocationFilter: (areaName: string) => void;
  toggleVehicleTypeFilter: (vehicleType: string) => void;
  updateGovernorateSelection: (index: number) => void;
  updateSearchText: (text: string | null) => void;
  setFilterModalVisible: (visible: boolean) => void;
  applyFilters: () => Promise<FilterState>;
}

// ===== CONTEXT TYPE =====

type FilterContextType = FilterContextState & FilterContextActions;

// ===== INITIAL STATE =====

const initialState: FilterContextState = {
  filterModalVisible: false,
};

// ===== CONTEXT CREATION =====

const FilterContext = createContext<FilterContextType | undefined>(undefined);

// ===== PROVIDER COMPONENT =====

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [state, setState] = useState<FilterContextState>(initialState);
  
  // Get the fetchLiveTrackData function from LiveTrack context
  const { fetchLiveTrackData } = useLiveTrack();
  
  // Get filter state management from FilterStateContext
  const { filters, updateFilters: updateFilterState, resetFilters: resetFilterState } = useFilterState();

  // ===== ACTIONS =====
  
  const updateFilters = (filters: Partial<FilterState>) => {
    updateFilterState(filters);
  };

  const clearFilters = () => {
    resetFilterState();
  };

  const resetFilters = () => {
    resetFilterState();
  };

  const toggleStatusFilter = (statusKey: string) => {
    const newStatus = filters.status.includes(statusKey)
      ? filters.status.filter(s => s !== statusKey)
      : [...filters.status, statusKey];
    
    updateFilterState({ status: newStatus });
  };

  const toggleLocationFilter = (areaName: string) => {
    const newLocation = filters.location.includes(areaName)
      ? filters.location.filter(a => a !== areaName)
      : [...filters.location, areaName];
    
    updateFilterState({ location: newLocation });
  };

  const toggleVehicleTypeFilter = (vehicleType: string) => {
    const newVehicleType = filters.vehicleType.includes(vehicleType)
      ? filters.vehicleType.filter(t => t !== vehicleType)
      : [...filters.vehicleType, vehicleType];
    
    updateFilterState({ vehicleType: newVehicleType });
  };

  const updateGovernorateSelection = (index: number) => {
    updateFilterState({ governorateSelected: index });
  };

  const updateSearchText = (text: string | null) => {
    updateFilterState({ search_text: text });
  };

  const setFilterModalVisible = (visible: boolean) => {
    setState(prev => ({ ...prev, filterModalVisible: visible }));
  };

  const applyFilters = useCallback(async (): Promise<FilterState> => {
    try {
      // Fetch LiveTrack data with current filters
      await fetchLiveTrackData(filters);
      return filters;
    } catch (error) {
      throw error;
    }
  }, [filters, fetchLiveTrackData]);

  // ===== CONTEXT VALUE =====
  
  const contextValue: FilterContextType = {
    ...state,
    filters, // Get filters from FilterStateContext
    updateFilters,
    clearFilters,
    resetFilters,
    toggleStatusFilter,
    toggleLocationFilter,
    toggleVehicleTypeFilter,
    updateGovernorateSelection,
    updateSearchText,
    setFilterModalVisible,
    applyFilters,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

// ===== HOOK =====

export const useFilter = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
