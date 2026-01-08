# List Tab Flow - Complete Step-by-Step Guide

## Overview
The List Tab is part of the Dashboard screen that displays vehicles in a grouped accordion list format with filtering and sorting capabilities.

---

## Step-by-Step Flow

### Step 1: App Initialization
```
App.tsx
    ↓
DashboardStack.tsx (Navigation)
    ↓
Dashboard.tsx (Screen)
    ↓
DashboardProvider (Context Wrapper)
    ↓
DashboardContent (Main Component)
```

**File**: `src/screens/Dashboard/Dashboard.tsx`

```typescript
// Initial state
const [tabActive, setTabActive] = useState<'list' | 'map'>('list');
```

---

### Step 2: Context Providers Setup

**File**: `src/screens/Dashboard/context/DashboardContext.tsx`

```
DashboardProvider
    ├── FilterStateProvider (manages filter/sort state)
    ├── LiveTrackProvider (manages vehicle data)
    ├── FilterProvider (manages filter modal UI)
    ├── SortProvider (manages sort state)
    └── UIProvider (manages UI state)
```

---

### Step 3: Initial Data Fetch (useEffect)

**File**: `src/screens/Dashboard/Dashboard.tsx`

```typescript
useEffect(() => {
  fetchLiveTrackData();
}, [fetchLiveTrackData]);
```

---

### Step 4: API Call - Get LiveTrack Data

**API Endpoint**: `POST /api/LiveTrack`

**Service File**: `src/services/liveTrack.ts`

```typescript
// Request Body Interface
interface LiveTrackRequest {
  sort_by: string;              // e.g., 'name', 'status', 'speed'
  sort_type: 'asc' | 'desc';
  group_by: string;             // e.g., 'status', 'location', 'vehicleType'
  status: string[];             // e.g., ['on', 'idle', 'off']
  location: string[];           // e.g., ['Area1', 'Area2']
  vehicle_type: string[];       // e.g., ['Car', 'Truck']
  search_text: string | null;   // search query
}

// Response Interface
interface LiveTrackResponse {
  groups: LiveTrackApiGroup[];
  summary: StatusSummary;
  location_summary: LocationSummary[];
  vehicle_types: VehicleTypeSummary[];
}

// API Group Interface
interface LiveTrackApiGroup {
  id: string;
  name: string;                 // Group name (e.g., "On", "Idle", "Off")
  summary: StatusSummary;
  vehicles: Vehicle[];
}

// Vehicle Interface
interface Vehicle {
  id: number;
  name?: string;                // normalized: unitAlias or vehicleNumber
  vehicle_Number?: string;
  status: string;               // 'on', 'idle', 'off', 'no_signal'
  speed?: string;
  driver_name?: string;
  driver_rating?: number;
  location?: string;
  status_time?: string;
  coordinates: [number, number];
  rotation?: number;
  vehicleType?: string;
}

// Status Summary Interface
interface StatusSummary {
  on: number;
  idle: number;
  off: number;
  longoff: number;
  overspeed: number;
  no_signal: number;
  filtered: number;
  total: number;
}
```

**Base URL**: `https://test.smarttrack-sts.com/api`

---

### Step 5: API Request Execution

**File**: `src/screens/Dashboard/context/LiveTrackContext.tsx`

```typescript
const fetchLiveTrackData = useCallback(async () => {
  const payload = {
    sort_by: sort?.sortBy ?? 'name',
    sort_type: sortType, // 'asc' or 'desc'
    group_by: sort?.groupBy ?? 'status',
    status: filters?.status ?? [],
    location: filters?.location ?? [],
    vehicle_type: filters?.vehicleType ?? [],
    search_text: filters?.search_text ?? state.searchQuery ?? null,
  };

  const response = await getLiveTrackData(payload).unwrap();
  
  // Process response
  const processedGroups = response.groups.map(group => ({
    key: group.id,
    name: group.name,
    count: group.vehicles?.length ?? 0,
    vehicles: group.vehicles.map(v => ({
      ...v,
      name: v.unitAlias ?? v.vehicleNumber ?? `Vehicle-${v.id}`,
      status: typeof v.status === 'string' ? v.status.toLowerCase() : 'off',
    })),
  }));
  
  setState({ processedGroups, liveTrackData: response });
}, [getLiveTrackData, filters, sort, state.searchQuery]);
```

---

### Step 6: Accordion List State Management

**File**: `src/screens/Dashboard/components/AccordianList/hooks/useAccordionState.ts`

```typescript
const useAccordionState = () => {
  const { liveTrackData, refreshLiveTrackData, liveTrackLoading } = useDashboardLiveTrack();
  const { sort } = useDashboardSort();
  
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const currentGroupBy = sort?.groupBy ?? 'status';
  
  // Extract groups from liveTrackData
  const groups = useMemo(() => {
    if (!liveTrackData?.groups) return [];
    return liveTrackData.groups.map(group => ({
      key: group.id,
      name: group.name,
      count: group.vehicles?.length ?? 0,
      vehicles: group.vehicles ?? [],
    }));
  }, [liveTrackData]);
  
  // Toggle group expansion
  const toggle = (groupKey: string) => {
    setOpened(prev => ({ [groupKey]: !prev[groupKey] }));
  };
  
  return { groups, totals: liveTrackData?.summary, opened, toggle, currentGroupBy, liveTrackLoading };
};
```

---

### Step 7: Accordion List Rendering

**File**: `src/screens/Dashboard/components/AccordianList/AccordionList.tsx`

```typescript
const AccordionList: React.FC = () => {
  const { groups, totals, opened, toggle, currentGroupBy, liveTrackLoading } = useAccordionState();
  
  return (
    <Screen>
      <Content>
        <ScrollView refreshControl={<RefreshControl refreshing={liveTrackLoading} onRefresh={refreshLiveTrackData} />}>
          {groups.map(group => (
            <React.Fragment key={group.key}>
              <VehicleGroupHeader
                group={group}
                isOpen={!!opened[group.key]}
                onToggle={toggle}
              />
              {opened[group.key] &&
                group.vehicles.map((vehicle: Vehicle) => (
                  <VehicleItem key={vehicle.id} vehicle={vehicle} />
                ))}
            </React.Fragment>
          ))}
        </ScrollView>
      </Content>
      <FilterBar totals={totals} />
    </Screen>
  );
};
```

---

### Step 8: Vehicle Item Rendering

**File**: `src/screens/Dashboard/components/AccordianList/components/VehicleItem.tsx`

```typescript
const VehicleItem: React.FC = ({ vehicle }) => {
  // Displays:
  // - Status icon (car icon based on status)
  // - Speed or status text
  // - Driver name with rating stars
  // - Vehicle name/number
  // - Location
  // - Last updated time (timeAgo)
  
  const handlePress = () => {
    navigation.navigate('DetailPage', { item: vehicle });
  };
  
  return <StyledVehicleItem onPress={handlePress}>...</StyledVehicleItem>;
};
```

---

### Step 9: Filter Modal Flow

**File**: `src/screens/Dashboard/components/HomeFilter/HomeFilter.tsx`

```
User taps filter button
    ↓
HomeFilter modal opens
    ↓
User selects filters:
  - Status (on, idle, off, no_signal)
  - Location (by governorate/area)
  - Vehicle Type
    ↓
User taps "Apply"
    ↓
FilterContext.applyFilters() called
    ↓
fetchLiveTrackData() called with new filters
    ↓
API called with updated request body
    ↓
List refreshes with filtered data
```

**Filter State Interface** (`src/screens/Dashboard/context/types.ts`):
```typescript
interface FilterState {
  status: string[];
  location: string[];
  vehicleType: string[];
  governorateSelected?: number;
  search_text: string | null;
}
```

---

### Step 10: Auto-Refresh

**File**: `src/screens/Dashboard/context/LiveTrackContext.tsx`

```typescript
useEffect(() => {
  if (!state.autoRefreshEnabled) return;
  
  const interval = setInterval(fetchLiveTrackData, 30000); // 30 seconds
  return () => clearInterval(interval);
}, [state.autoRefreshEnabled, fetchLiveTrackData]);
```

---

### Step 11: Pull-to-Refresh

**File**: `src/screens/Dashboard/components/AccordianList/AccordionList.tsx`

```typescript
<RefreshControl
  refreshing={liveTrackLoading}
  onRefresh={handleRefresh}
  colors={['#007AFF']}
  tintColor="#007AFF"
/>
```

---

### Step 12: Navigation to Detail Page

**File**: `src/screens/Dashboard/components/VehicleDetailSection/VehicleDetail.tsx`

```
User taps on VehicleItem
    ↓
navigation.navigate('DetailPage', { item: vehicle })
    ↓
VehicleDetail.tsx renders with selected vehicle
```

---

## Complete API Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    DASHBOARD SCREEN                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  DASHBOARDCONTENT COMPONENT                  │
│              tabActive = 'list' (default)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    useEffect (mount)                         │
│              fetchLiveTrackData()                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               LIVETRACK CONTEXT                              │
│  useGetLiveTrackDataMutation() → POST /api/LiveTrack         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API REQUEST                             │
│  {                                                           │
│    sort_by: 'name',                                          │
│    sort_type: 'asc',                                         │
│    group_by: 'status',                                       │
│    status: [],                                               │
│    location: [],                                             │
│    vehicle_type: [],                                         │
│    search_text: null                                         │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API RESPONSE                            │
│  {                                                           │
│    groups: [                                                 │
│      { id, name, summary, vehicles: [...] },                 │
│      ...                                                     │
│    ],                                                        │
│    summary: { on, idle, off, ... },                          │
│    location_summary: [...],                                  │
│    vehicle_types: [...]                                      │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              DATA PROCESSING                                 │
│  → Process groups with normalized vehicle data               │
│  → Update processedGroups state                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                ACCORDION LIST RENDER                         │
│  → Render VehicleGroupHeader for each group                  │
│  → Toggle expansion on press                                 │
│  → Render VehicleItem for each vehicle in group              │
└─────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │   FILTER     │  │    SORT      │  │  REFRESH     │
    │   MODAL      │  │  CHANGES     │  │  (30s/pull)  │
    └──────────────┘  └──────────────┘  └──────────────┘
            │                 │                 │
            └─────────────────┼─────────────────┘
                              ▼
                    ┌──────────────────┐
                    │  fetchLiveTrack  │
                    │  Data (NEW API)  │
                    └──────────────────┘
```

---

## Summary of All APIs Called

| # | API | Method | Endpoint | Purpose |
|---|-----|--------|----------|---------|
| 1 | LiveTrack Data | POST | `/api/LiveTrack` | Get vehicle groups and data |
| 2 | (Optional) User Profile | GET | `/api/users/profile` | Get logged-in user details |

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/screens/Dashboard/Dashboard.tsx` | Main Dashboard screen |
| `src/screens/Dashboard/components/HomeTab.tsx` | List/Map tab toggle |
| `src/screens/Dashboard/components/AccordianList/AccordionList.tsx` | List view component |
| `src/screens/Dashboard/components/AccordianList/hooks/useAccordionState.ts` | List state hook |
| `src/screens/Dashboard/context/LiveTrackContext.tsx` | Vehicle data context |
| `src/screens/Dashboard/context/FilterContext.tsx` | Filter context |
| `src/screens/Dashboard/context/FilterStateContext.tsx` | Filter state management |
| `src/services/liveTrack.ts` | LiveTrack API service |
| `src/services/constants.ts` | API endpoints configuration |

---

## Filter & Sort Options

### Group By Options:
- `status` (default)
- `location`
- `vehicleType`

### Sort By Options:
- `name`
- `status`
- `speed`

### Sort Type Options:
- `ascending`
- `descending`

### Status Filter Options:
- `on` (Engine On)
- `idle` (Engine Idle)
- `off` (Engine Off)
- `longoff` (Long Off)
- `no_signal` (No Signal)
- `overspeed` (Overspeed)

