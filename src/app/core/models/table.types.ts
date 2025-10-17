export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'avatar' | 'date' | 'number' | 'currency' | 'status';
  align?: 'left' | 'center' | 'right';
  showTime?: boolean;
}

export interface TableFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}
