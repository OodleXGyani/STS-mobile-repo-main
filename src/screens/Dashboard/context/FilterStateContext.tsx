import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { FilterState, SortState } from './types';

// ===== CONTEXT STATE =====

interface FilterStateContextState {
  filters: FilterState;
  sort: SortState;
}

// ===== CONTEXT ACTIONS =====

interface FilterStateContextActions {
  updateFilters: (filters: Partial<FilterState>) => void;
  updateSort: (sort: Partial<SortState>) => void;
  resetFilters: () => void;
  resetSort: () => void;
  getCurrentFilters: () => FilterState;
  getCurrentSort: () => SortState;
}

// ===== CONTEXT TYPE =====

type FilterStateContextType = FilterStateContextState & FilterStateContextActions;

// ===== INITIAL STATE =====

const initialState: FilterStateContextState = {
  filters: {
    status: [],
    location: [],
    vehicleType: [],
    governorateSelected: 0,
    search_text: null,
  },
  sort: {
    sortBy: 'name',
    sortType: 'ascending',
    groupBy: 'status',
  },
};

// ===== CONTEXT CREATION =====

const FilterStateContext = createContext<FilterStateContextType | undefined>(undefined);

// ===== PROVIDER COMPONENT =====

interface FilterStateProviderProps {
  children: ReactNode;
}

export const FilterStateProvider: React.FC<FilterStateProviderProps> = ({ children }) => {
  const [state, setState] = useState<FilterStateContextState>(initialState);

  // ===== ACTIONS =====
  
  const updateFilters = useCallback((filters: Partial<FilterState>) => {
    setState(prev => ({ 
      ...prev, 
      filters: { ...prev.filters, ...filters }
    }));
  }, []);

  const updateSort = useCallback((sort: Partial<SortState>) => {
    setState(prev => ({ 
      ...prev, 
      sort: { ...prev.sort, ...sort }
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      filters: initialState.filters 
    }));
  }, []);

  const resetSort = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      sort: initialState.sort 
    }));
  }, []);

  const getCurrentFilters = useCallback(() => {
    return state.filters;
  }, [state.filters]);

  const getCurrentSort = useCallback(() => {
    return state.sort;
  }, [state.sort]);

  // ===== CONTEXT VALUE =====
  
  const contextValue: FilterStateContextType = useMemo(() => ({
    ...state,
    updateFilters,
    updateSort,
    resetFilters,
    resetSort,
    getCurrentFilters,
    getCurrentSort,
  }), [state, updateFilters, updateSort, resetFilters, resetSort, getCurrentFilters, getCurrentSort]);

  return (
    <FilterStateContext.Provider value={contextValue}>
      {children}
    </FilterStateContext.Provider>
  );
};

// ===== HOOK =====

export const useFilterState = (): FilterStateContextType => {
  const context = useContext(FilterStateContext);
  if (context === undefined) {
    throw new Error('useFilterState must be used within a FilterStateProvider');
  }
  return context;
};
