import React, { ReactNode } from 'react';
import { LiveTrackProvider, useLiveTrack } from './LiveTrackContext';
import { FilterProvider, useFilter } from './FilterContext';
import { SortProvider, useSort } from './SortContext';
import { UIProvider, useUI } from './UIContext';
import { FilterStateProvider } from './FilterStateContext';

// ===== MAIN PROVIDER COMPONENT =====

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  return (
    <FilterStateProvider>
      <LiveTrackProvider>
        <FilterProvider>
          <SortProvider>
            <UIProvider>
              {children}
            </UIProvider>
          </SortProvider>
        </FilterProvider>
      </LiveTrackProvider>
    </FilterStateProvider>
  );
};

// ===== RE-EXPORT ALL HOOKS FOR EASY ACCESS =====

// LiveTrack
export { useLiveTrack } from './LiveTrackContext';

// Filter
export { useFilter } from './FilterContext';

// Sort
export { useSort } from './SortContext';

// UI
export { useUI } from './UIContext';

// ===== CONVENIENCE HOOKS =====

// Filter + Sort together
export const useDashboardFilters = () => {
  const filterContext = useFilter();
  const sortContext = useSort();

  return {
    ...filterContext,
    ...sortContext,
  };
};



// Sort only (backward compatibility)
export const useDashboardSort = () => {
  return useSort();
};

// LiveTrack data
export const useDashboardLiveTrack = () => {
  return useLiveTrack();
};

// ✅ READ-ONLY processed groups
export const useDashboardProcessedGroups = () => {
  const { processedGroups } = useLiveTrack();

  return {
    processedGroups,
  };
};
