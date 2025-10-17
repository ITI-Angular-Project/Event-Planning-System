export interface Ievents {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  startDate: string;   // You can use Date if you parse it later
  endDate: string;
  createdBy: number;
  guestIds: number[];
  taskIds: number[];
  expenseIds: number[];
  feedbackIds: number[];
  status: string;
  image?: string;    // 🖼️ Added for image URLs (local or remote)
}
