import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import {
  Screen,
  Row,
  Icon,
  HeaderRow,
  HeaderText,
  ColType,
  ColName,
  ColReg,
  NameText,
  RegText,
  ErrorText,
  EmptyText,
  LoaderContainer,
  OverlayLoader,
  FooterLoader,
  PaginationContainer,
  PaginationButton,
  PaginationLabel,
  PaginationButtonText,
} from './vehicle-styles';
import {
  useGetVehiclesQuery,
  VehicleInterface,
} from '../../../services/vehicles';
import { useDebounce } from '../../../hooks/useDebounce';

interface VehicleListProps {
  searchQuery: string;
  sortBy: 'name' | 'reg_no';
  sortType: 'asc' | 'desc';
}

const VehicleRow: React.FC<{ item: VehicleInterface }> = ({ item }) => (
  <Row>
    <ColType>
      <Icon
        source={require('../../../assets/icons/vehicles/car/car_blue.png')}
        resizeMode="contain"
      />
    </ColType>
    <ColName>
      <NameText numberOfLines={1} ellipsizeMode="tail">
        {item.alias || 'N/A'}
      </NameText>
    </ColName>
    <ColReg>
      <RegText numberOfLines={1} ellipsizeMode="tail">
        {item.number || 'N/A'}
      </RegText>
    </ColReg>
  </Row>
);

const VehicleList: React.FC<VehicleListProps> = ({ searchQuery, sortBy, sortType }) => {
  const pageSize = 10;
  const [pageIndex, setPageIndex] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, error, isLoading, isFetching, refetch } = useGetVehiclesQuery({
    pageIndex,
    pageSize,
    searchText: debouncedSearch,
  });

  console.log('🔍 VehicleList data:', data);

  // Handle direct array data or wrapped response
  const vehicleData = Array.isArray(data) ? data : data?.items || [];

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    setPageIndex(1);
    await refetch();
    setRefreshing(false);
  };

  const totalPages = Array.isArray(data)
    ? 1 // Direct array data - no pagination info
    : data
      ? Math.max(
        1,
        Math.ceil((data.totalCount ?? 0) / (data.pageSize ?? pageSize)),
      )
      : 1;

  const currentPage = Array.isArray(data) ? 1 : data?.pageIndex ?? pageIndex;

  // Reset to first page when search query changes
  useEffect(() => {
    setPageIndex(1);
  }, [debouncedSearch]);

  if (error) {
    return (
      <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ErrorText>Failed to load vehicles</ErrorText>
      </Screen>
    );
  }

  const sortedData = React.useMemo(() => {
    if (!vehicleData?.length) return [];

    return [...vehicleData].sort((a, b) => {
      if (sortBy === 'reg_no') {
        // ✅ Numeric sort
        const numA = Number(a.number) || 0;
        const numB = Number(b.number) || 0;
        return sortType === 'asc' ? numA - numB : numB - numA;
      } else {
        // ✅ Alphabetical sort for name
        const valA = (a.alias || '').toLowerCase();
        const valB = (b.alias || '').toLowerCase();

        if (valA < valB) return sortType === 'asc' ? -1 : 1;
        if (valA > valB) return sortType === 'asc' ? 1 : -1;
        return 0;
      }
    });
  }, [vehicleData, sortBy, sortType]);

  return (
    <Screen>
      {/* Header */}
      <HeaderRow>
        <ColType>
          <HeaderText>Vehicle{'\n'}Type</HeaderText>
        </ColType>
        <ColName>
          <HeaderText>Name</HeaderText>
        </ColName>
        <ColReg>
          <HeaderText>Reg. No.</HeaderText>
        </ColReg>
      </HeaderRow>

      {isFetching &&
        !isLoading &&
        pageIndex === 1 &&
        debouncedSearch !== '' && (
          <OverlayLoader>
            <ActivityIndicator size="large" color="#007AFF" />
          </OverlayLoader>
        )}

      <FlatList
        data={sortedData || []}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <VehicleRow item={item} />}
        ListEmptyComponent={
          isLoading ? (
            <LoaderContainer>
              <ActivityIndicator size="large" color="#007AFF" />
            </LoaderContainer>
          ) : (
            <EmptyText>No vehicles found</EmptyText>
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={
          isFetching && pageIndex > 1 ? (
            <FooterLoader>
              <ActivityIndicator size="small" color="#007AFF" />
            </FooterLoader>
          ) : null
        }
      />

      {/* Pagination Controls */}
      {/* <PaginationContainer>
        <PaginationButton
          disabled={pageIndex === 1 || isFetching}
          onPress={() => setPageIndex(prev => Math.max(prev - 1, 1))}
          active={!(pageIndex === 1 || isFetching)}
        >
          <PaginationButtonText>Previous</PaginationButtonText>
        </PaginationButton>

        <PaginationLabel>
          Page {currentPage} / {totalPages}
        </PaginationLabel>

        <PaginationButton
          disabled={isFetching || (data && pageIndex >= totalPages)}
          onPress={() => setPageIndex(prev => prev + 1)}
          active={!(isFetching || (data && pageIndex >= totalPages))}
        >
          <PaginationButtonText>Next</PaginationButtonText>
        </PaginationButton>
      </PaginationContainer> */}
    </Screen>
  );
};

export default VehicleList;
