export type DatePickerMode = 'date' | 'time' | 'datetime';
export type DatePickerTheme = 'light' | 'dark' | 'custom';

export interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  mode?: DatePickerMode;
  theme?: DatePickerTheme;
  initialDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  showTimePicker?: boolean;
  timeFormat?: '12h' | '24h';
  customTheme?: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
  };
}

export interface DatePickerState {
  selectedDate: Date;
  selectedTime: Date;
  currentMonth: Date;
  calendarDays: Date[];
  selectedYear: number;
  selectedMonth: number;
}