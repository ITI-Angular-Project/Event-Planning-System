export interface Ievents {
  id: number;
  title: string;
  category: string;
  date: string;
  location: string;
  organizer: string;
  status: 'Upcoming' | 'Ongoing' | 'Ended';
  image?: string;
  description?: string;
}
