import { useState, useCallback } from 'react';
import { FilterState } from '../types';

const INITIAL_FILTER_STATE: FilterState = {
  status: [],
  location: [],
  vehicleType: [],
  governorateSelected: 0
};

export const useFilterState = () => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [isLoading, setIsLoading] = useState(false);

  const updateFilter = useCallback((type: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  }, []);

  const handleStatusToggle = useCallback((statusKey: string) => {
    console.log('🔄 Status toggle called for:', statusKey);
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(statusKey)
        ? prev.status.filter(s => s !== statusKey)
        : [...prev.status, statusKey]
    }));
  }, []);

  const handleAreaToggle = useCallback((areaName: string) => {
    console.log('🔄 Area toggle called for:', areaName);
    setFilters(prev => ({
      ...prev,
      location: prev.location.includes(areaName)
        ? prev.location.filter(a => a !== areaName)
        : [...prev.location, areaName]
    }));
  }, []);

  const handleTypeToggle = useCallback((vehicleType: string) => {
    console.log('🔄 Type toggle called for:', vehicleType);
    setFilters(prev => ({
      ...prev,
      vehicleType: prev.vehicleType.includes(vehicleType)
        ? prev.vehicleType.filter(t => t !== vehicleType)
        : [...prev.vehicleType, vehicleType]
    }));
  }, []);

  const handleGovernorateChange = useCallback((index: number) => {
    console.log('🔄 Governorate change called for index:', index);
    setFilters(prev => {
      const newState = {
        ...prev,
        governorateSelected: index
        // Removed location reset - now users can select areas from multiple governorates
      };
      console.log('✅ Governorate changed, preserving area selections:', prev.location);
      return newState;
    });
  }, []);

  const resetFilters = useCallback(() => {
    console.log('🔄 Reset filters called');
    setFilters(INITIAL_FILTER_STATE);
  }, []);

  const applyFilters = useCallback(async () => {
    console.log('🔄 Apply filters called with:', filters);
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
      console.log('✅ Filters applied successfully:', filters);
      return filters;
    } catch (error) {
      console.error('❌ Error applying filters:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  return {
    filters,
    isLoading,
    updateFilter,
    handleStatusToggle,
    handleAreaToggle,
    handleTypeToggle,
    handleGovernorateChange,
    resetFilters,
    applyFilters
  };
};
