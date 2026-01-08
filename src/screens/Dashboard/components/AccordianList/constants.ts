/**
 * AccordionList Constants
 * Defines icons, colors, and status mappings for the vehicle list
 */

import { VehicleStatus } from '../../context/types';
import { STATUS_COLORS, STATUS_DISPLAY_NAMES } from '../../utils/statusNormalizer';

// =======================
// STATUS ICONS
// =======================

export const CAR_BY_STATUS: Record<VehicleStatus, any> = {
  [VehicleStatus.MOVING]: require('../../../../assets/icons/vehicles/car/car_green.png'),
  [VehicleStatus.IDLE]: require('../../../../assets/icons/vehicles/car/car_orange.png'),
  [VehicleStatus.OFF]: require('../../../../assets/icons/vehicles/car/car_grey.png'),
  [VehicleStatus.NO_SIGNAL]: require('../../../../assets/icons/vehicles/car/car_grey.png'),
};

// =======================
// UI ICONS
// =======================

export const ICONS = {
  starGrey: require('../../../../assets/icons/star_full_grey.png'),
  starYellow: require('../../../../assets/icons/star_full_yellow.png'),
  clockGrey: require('../../../../assets/icons/clock_grey.png'),
  caretDown: require('../../../../assets/icons/caret/caret_down_blue.png'),
  filterIcon: require('../../../../assets/icons/filter_white.png'),
  noSignalBlue: require('../../../../assets/icons/nosignal_blue.png'),
};

// =======================
// DISPLAYED STATUSES (in order)
// =======================

export const DISPLAYED_STATUSES: VehicleStatus[] = [
  VehicleStatus.MOVING,
  VehicleStatus.IDLE,
  VehicleStatus.OFF,
  VehicleStatus.NO_SIGNAL,
];

// =======================
// STATUS COLORS & NAMES (re-exported from normalizer)
// =======================

export { STATUS_COLORS, STATUS_DISPLAY_NAMES };

// =======================
// STATUS SUMMARY FIELD NAMES
// =======================

/**
 * Maps VehicleStatus to StatusSummary field names
 * Used for getting counts from API response
 */
export const STATUS_SUMMARY_FIELDS: Record<VehicleStatus, keyof import('../../context/types').StatusSummary> = {
  [VehicleStatus.MOVING]: 'moving',
  [VehicleStatus.IDLE]: 'idle',
  [VehicleStatus.OFF]: 'off',
  [VehicleStatus.NO_SIGNAL]: 'noSignal',
};
