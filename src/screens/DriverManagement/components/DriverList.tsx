import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import {
  Screen,
  Row,
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
} from './driver-styles';
import {
  GetAllDriverResponse,
  useGetAllDriversQuery,
  useGetPagedDriversQuery,
} from '../../../services/drivers';
import { useDebounce } from '../../../hooks/useDebounce';

const DriverRow: React.FC<{ item: GetAllDriverResponse }> = ({ item }) => (
  <Row>
    <ColName>
      <NameText numberOfLines={1} ellipsizeMode="tail">
        {item.name || 'N/A'}
      </NameText>
    </ColName>
    <ColType>
      <RegText numberOfLines={1} ellipsizeMode="tail">
        {item.cpr || 'N/A'}
      </RegText>
    </ColType>
    <ColReg>
      <RegText numberOfLines={1} ellipsizeMode="tail">
        {item.employee_id || 'N/A'}
      </RegText>
    </ColReg>
  </Row>
);

interface DriverListProps {
  searchQuery: string;
  sortBy: 'name' | 'cpr' | 'employee_id';
  sortType: 'asc' | 'desc';
}

const DriverList: React.FC<DriverListProps> = ({ searchQuery, sortBy, sortType }) => {
  // const pageSize = 10;
  // const [pageIndex, setPageIndex] = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, error, isLoading, isFetching, refetch } =
    useGetAllDriversQuery();
    console.log('🔍 DriverList data:', data);

  // Handle direct array data
  const driverData = Array.isArray(data) ? data : [];

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Commented out pagination logic since we're getting all data at once
  // const totalPages = data
  //   ? Math.max(
  //       1,
  //       Math.ceil((data.totalCount ?? 0) / (data.pageSize ?? pageSize)),
  //     )
  //   : 1;
  // const currentPage = data?.pageIndex ?? pageIndex;

  // useEffect(() => {
  //   setPageIndex(1);
  // }, [debouncedSearch]);

  const sortedData = React.useMemo(() => {
    if (!driverData?.length) return [];

    return [...driverData].sort((a, b) => {
      let valA = '';
      let valB = '';

      if (sortBy === 'name') {
        valA = a.name || '';
        valB = b.name || '';
      } else if (sortBy === 'cpr') {
        valA = a.cpr || '';
        valB = b.cpr || '';
      } else if (sortBy === 'employee_id') {
        // ✅ Numeric sort for employee IDs if they're digits only
        const numA = Number(a.employee_id) || 0;
        const numB = Number(b.employee_id) || 0;
        return sortType === 'asc' ? numA - numB : numB - numA;
      }

      valA = valA.toLowerCase();
      valB = valB.toLowerCase();

      if (valA < valB) return sortType === 'asc' ? -1 : 1;
      if (valA > valB) return sortType === 'asc' ? 1 : -1;
      return 0;
    });
  }, [driverData, sortBy, sortType]);

  if (error) {
    return (
      <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ErrorText>Failed to load drivers</ErrorText>
      </Screen>
    );
  }

  return (
    <Screen>
      {/* Header */}
      <HeaderRow>
        <ColName>
          <HeaderText>Name</HeaderText>
        </ColName>
        <ColType>
          <HeaderText>CPR</HeaderText>
        </ColType>
        <ColReg>
          <HeaderText>Employee{'\n'}ID</HeaderText>
        </ColReg>
      </HeaderRow>

      {isFetching &&
        !isLoading &&
        debouncedSearch !== '' && (
          <OverlayLoader>
            <ActivityIndicator size="large" color="#007AFF" />
          </OverlayLoader>
        )}

      <FlatList
        data={sortedData || []}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <DriverRow item={item} />}
        ListEmptyComponent={
          isLoading ? (
            <LoaderContainer>
              <ActivityIndicator size="large" color="#007AFF" />
            </LoaderContainer>
          ) : (
            <EmptyText>No drivers found</EmptyText>
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        // ListFooterComponent={
        //   isFetching && pageIndex > 1 ? (
        //     <FooterLoader>
        //       <ActivityIndicator size="small" color="#007AFF" />
        //     </FooterLoader>
        //   ) : null
        // }
      />

      {/* Pagination Controls - Commented out since we're getting all data at once */}
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

export default DriverList;
