export type ExpenseCategory =
  | 'Venue'
  | 'Decoration'
  | 'Food'
  | 'Music'
  | 'Transport'
  | 'Miscellaneous';

export interface Expense {
  id: number;
  eventId: number;
  name: string;
  amount: number;
  category: ExpenseCategory;   // <-- added
  date: string;                // ISO
  notes?: string;
  createdAt: string;           // ISO
  updatedAt: string;           // ISO
}
