# Daily Summary Report Component

## Overview
The DailySummaryReport component provides a comprehensive view of daily vehicle operations, similar to the TripReport but focused on daily summaries rather than individual trips.

## Features
- **Daily Summary Cards**: Display daily vehicle performance data
- **Fleet Average Header**: Shows fleet-wide statistics
- **Interactive Actions**: Map and Details buttons for each daily summary
- **Timeline Integration**: Uses the same TimelineList component as TripReport
- **Responsive Design**: Optimized for mobile devices

## Key Differences from TripReport
- **Daily Focus**: Shows daily summaries instead of individual trips
- **Additional Metrics**: Includes fuel consumption, engine hours, working hours, break time
- **Date-based Organization**: Organized by date rather than trip ID
- **Enhanced Stats**: More comprehensive daily statistics

## Data Structure
- **DailySummaryCard**: Main data structure for daily summaries
- **DailyFleetStats**: Fleet-wide statistics
- **DailyMetrics**: Detailed metrics for each day
- **DailyVehicleInfo**: Vehicle information
- **DailyDriverInfo**: Driver information

## UI Components
- **Header**: Back button, title, and date
- **Fleet Average Row**: Fleet-wide statistics
- **Daily Summary Cards**: Individual daily summaries with:
  - Vehicle plate and date
  - Driver information and time range
  - Timeline of activities
  - Daily statistics (TDT, TTT, Max Speed, etc.)
  - Action buttons (Map, Details)

## Usage
```tsx
import { DailySummaryReport } from './components/DailySummaryReport';

// Use in navigation or as a component
<DailySummaryReport />
```

## Navigation
- **Back Button**: Returns to previous screen
- **Map Button**: Navigate to daily summary map view (TODO)
- **Details Button**: Navigate to detailed daily summary (TODO)

## Styling
Uses styled-components with consistent theming:
- Primary blue color scheme
- Responsive scaling with react-native-size-matters
- Shadow effects for cards
- Consistent spacing and typography

## Future Enhancements
- [ ] Daily summary map integration
- [ ] Detailed daily summary page
- [ ] Date range selection
- [ ] Export functionality
- [ ] Real-time data integration
