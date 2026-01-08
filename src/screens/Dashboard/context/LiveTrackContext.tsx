import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';

import {
  LiveTrackData,
  ProcessedGroup,
  Vehicle,
} from './types';

import { useGetLiveTrackDataMutation } from '../../../services/liveTrack';
import { useFilterState } from './FilterStateContext';
import { normalizeApiResponse } from '../utils/vehicleNormalizer';

// =======================
// CONTEXT STATE
// =======================

interface LiveTrackContextState {
  liveTrackData: LiveTrackData | null;
  liveTrackLoading: boolean;
  liveTrackError: string | null;
  processedGroups: ProcessedGroup[];

  searchQuery: string;
  searchActive: boolean;

  autoRefreshEnabled: boolean;
}

// =======================
// CONTEXT ACTIONS
// =======================

interface LiveTrackContextActions {
  fetchLiveTrackData: () => Promise<void>;
  refreshLiveTrackData: () => void;

  setSearchQuery: (query: string) => void;
  setSearchActive: (active: boolean) => void;
  clearSearch: () => void;

  toggleAutoRefresh: () => void;
}

// =======================
// CONTEXT TYPE
// =======================

type LiveTrackContextType =
  LiveTrackContextState & LiveTrackContextActions;

// =======================
// INITIAL STATE
// =======================

const initialState: LiveTrackContextState = {
  liveTrackData: null,
  liveTrackLoading: false,
  liveTrackError: null,
  processedGroups: [],

  searchQuery: '',
  searchActive: false,

  autoRefreshEnabled: true,
};

// =======================
// CONTEXT CREATION
// =======================

const LiveTrackContext = createContext<
  LiveTrackContextType | undefined
>(undefined);

// =======================
// PROVIDER
// =======================

interface LiveTrackProviderProps {
  children: ReactNode;
}

export const LiveTrackProvider: React.FC<LiveTrackProviderProps> = ({
  children,
}) => {
  const [state, setState] =
    useState<LiveTrackContextState>(initialState);

  const [getLiveTrackData, { isLoading }] =
    useGetLiveTrackDataMutation();

  const { filters, sort } = useFilterState();

  // =======================
  // FETCH LIVE TRACK DATA
  // =======================

  const fetchLiveTrackData = useCallback(async () => {
    try {
      setState(prev => ({
        ...prev,
        liveTrackLoading: true,
        liveTrackError: null,
      }));

      const sortType: 'asc' | 'desc' =
        sort?.sortType === 'ascending' ? 'asc' : 'desc';

      const payload = {
        sort_by: sort?.sortBy ?? 'name',
        sort_type: sortType,
        group_by: sort?.groupBy ?? 'status',

        status: filters?.status ?? [],
        location: filters?.location ?? [],
        vehicle_type: filters?.vehicleType ?? [],
        search_text:
          filters?.search_text ?? state.searchQuery ?? null,
      };

      const rawResponse = await getLiveTrackData(payload).unwrap();

      // Normalize the API response to our canonical structure
      const normalizedData = normalizeApiResponse(rawResponse);

      // Create processed groups for UI consumption
      const processedGroups: ProcessedGroup[] = (normalizedData.groups ?? [])
        .map(group => ({
          key: group.id,
          name: group.name,
          count: group.vehicles?.length ?? 0,
          vehicles: group.vehicles ?? [],
        }));

      setState(prev => ({
        ...prev,
        liveTrackData: normalizedData,
        processedGroups,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'LiveTrack fetch failed';

      setState(prev => ({
        ...prev,
        liveTrackError: errorMessage,
        processedGroups: [],
      }));
    } finally {
      setState(prev => ({
        ...prev,
        liveTrackLoading: false,
      }));
    }
  }, [getLiveTrackData, filters, sort, state.searchQuery]);

  // =======================
  // MANUAL REFRESH
  // =======================

  const refreshLiveTrackData = useCallback(() => {
    fetchLiveTrackData();
  }, [fetchLiveTrackData]);

  // =======================
  // AUTO REFRESH (30s)
  // =======================

  useEffect(() => {
    if (!state.autoRefreshEnabled) return;

    const interval = setInterval(fetchLiveTrackData, 30000);
    return () => clearInterval(interval);
  }, [state.autoRefreshEnabled, fetchLiveTrackData]);

  // =======================
  // AUTO FETCH ON FILTER / SORT CHANGE
  // =======================

  useEffect(() => {
    fetchLiveTrackData();
  }, [filters, sort, fetchLiveTrackData]);

  // =======================
  // SEARCH ACTIONS
  // =======================

  const setSearchQuery = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  };

  const setSearchActive = (active: boolean) => {
    setState(prev => ({
      ...prev,
      searchActive: active,
      searchQuery: active ? prev.searchQuery : '',
    }));
  };

  const clearSearch = () => {
    setState(prev => ({
      ...prev,
      searchQuery: '',
      searchActive: false,
    }));
  };

  // =======================
  // AUTO REFRESH TOGGLE
  // =======================

  const toggleAutoRefresh = () => {
    setState(prev => ({
      ...prev,
      autoRefreshEnabled: !prev.autoRefreshEnabled,
    }));
  };

  // =======================
  // CONTEXT VALUE
  // =======================

  const value: LiveTrackContextType = {
    ...state,
    liveTrackLoading: isLoading,

    fetchLiveTrackData,
    refreshLiveTrackData,

    setSearchQuery,
    setSearchActive,
    clearSearch,

    toggleAutoRefresh,
  };

  return (
    <LiveTrackContext.Provider value={value}>
      {children}
    </LiveTrackContext.Provider>
  );
};

// =======================
// HOOK
// =======================

export const useLiveTrack = (): LiveTrackContextType => {
  const context = useContext(LiveTrackContext);
  if (!context) {
    throw new Error(
      'useLiveTrack must be used within LiveTrackProvider'
    );
  }
  return context;
};
