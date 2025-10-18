export interface Guest {
  id: number;
  eventId: number;
  name: string;
  email: string;
  phone: string;
  feedbackId: number | null;
  status: 'Invited' | 'Accepted' | 'Declined' | 'Pending';

  inviteToken?: string;
  invitedAt?: string;
  respondedAt?: string;
  registrationDate?: string;
}
