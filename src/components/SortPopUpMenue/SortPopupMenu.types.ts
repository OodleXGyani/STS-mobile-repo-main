// components/SortPopupMenu/SortPopupMenu.types.ts
export type SortOption = {
  key: string;
  label: string;
};

export type SortPopupMenuState = {
  sortBy: string;
  sortType: 'ascending' | 'descending';
  groupBy: string;
};

export interface SortPopupMenuProps {
  visible: boolean;
  currentState: SortPopupMenuState;
  onChange: (state: SortPopupMenuState) => void;
  onClose: () => void;
}
