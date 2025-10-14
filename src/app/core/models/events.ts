export interface Event {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  createdBy: number;
  guestIds: [number];
  taskIds: [number];
  expenseIds: [number];
  feedbackIds: [number];
  status: 'Upcoming' | 'InProgress' | 'Completed' | 'Cancelled';
}
