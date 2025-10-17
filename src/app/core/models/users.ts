export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'organizer' | 'guest' | string;
}
