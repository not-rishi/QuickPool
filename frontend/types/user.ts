export type UserGender = 'Male' | 'Female' | 'Other';

export interface User {
  _id: string;
  usn: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  gender?: UserGender;
  reputationScore?: number;
}
