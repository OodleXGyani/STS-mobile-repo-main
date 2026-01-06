import { Vehicle, VehicleStatus } from './types';

// Icons
export const CAR_BY_STATUS: Record<VehicleStatus, any> = {
  on: require('../../../../assets/icons/vehicles/car/car_green.png'),
  idle: require('../../../../assets/icons/vehicles/car/car_orange.png'),
  off: require('../../../../assets/icons/vehicles/car/car_grey.png'),
  longoff: require('../../../../assets/icons/vehicles/car/car_grey.png'),
  no_signal: require('../../../../assets/icons/vehicles/car/car_grey.png'),
};

export const ICONS = {
  starGrey: require('../../../../assets/icons/star_full_grey.png'),
  starYellow: require('../../../../assets/icons/star_full_yellow.png'),
  clockGrey: require('../../../../assets/icons/clock_grey.png'),
  caretDown: require('../../../../assets/icons/caret/caret_down_blue.png'),
  filterIcon: require('../../../../assets/icons/filter_white.png'),
  noSignalBlue: require('../../../../assets/icons/nosignal_blue.png'),
};

export const DISPLAYED_STATUSES: readonly VehicleStatus[] = ['on', 'idle', 'off', 'no_signal'] as const;

// Status colors
export const STATUS_COLORS: Record<string, string> = {
  on: '#22C55E', // green
  idle: '#FACC15', // yellow
  off: '#9CA3AF', // grey
  longoff: '#EF4444', // red
  no_signal: '#3B82F6', // blue
  overspeed: '#DC2626', // dark red
};

// Demo data
export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 1,
    key: 'V-0001',
    name: 'MITSUBISHI… Tubli',
    driver_name: '—',
    driver_rating: 0,
    location: '',
    status_time: new Date().toISOString(),
    status: 'off',
    group: 'MITSUBISHI',
  },
  {
    id: 2,
    key: 'V-0002',
    name: 'MITSUBISHI… Hidd Town',
    driver_name: '—',
    driver_rating: 0,
    location: '',
    status_time: new Date().toISOString(),
    status: 'off',
    group: 'MITSUBISHI',
  },
  {
    id: 3,
    key: 'V-0003',
    name: 'MITSUBISHI… Hidd Town',
    driver_name: '—',
    driver_rating: 0,
    location: '',
    status_time: new Date().toISOString(),
    status: 'off',
    group: 'MITSUBISHI',
  },
  {
    id: 4,
    key: 'V-0004',
    name: 'MITSUBISHI… Hidd Town',
    driver_name: '—',
    driver_rating: 0,
    location: '',
    status_time: new Date().toISOString(),
    status: 'off',
    group: 'MITSUBISHI',
  },
  {
    id: 5,
    key: 'V-0005',
    name: 'Ameer- Admin Driver',
    driver_name: '—',
    driver_rating: 0,
    location: 'MITSUBISHI… Hidd Town',
    status_time: new Date().toISOString(),
    status: 'idle',
    group: 'MITSUBISHI',
  },
  {
    id: 6,
    key: 'V-0006',
    name: '—',
    driver_name: '—',
    driver_rating: 0,
    location: '',
    status_time: new Date().toISOString(),
    status: 'on',
    group: 'NISSAN',
  },
  {
    id: 7,
    key: 'V-0007',
    name: '—',
    driver_name: '—',
    driver_rating: 0,
    location: '',
    status_time: new Date().toISOString(),
    status: 'off',
    group: 'NISSAN',
  },
];
