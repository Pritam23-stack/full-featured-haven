
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'patient' | 'doctor' | 'admin';
  specialization?: string;
  specialty?: string;
  rating?: number;
  reviews?: number;
  experience?: string;
  bio?: string;
  address?: string;
  location?: string;
  availability?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  type: 'online' | 'in-person';
  reason?: string;
  notes?: string;
  paymentStatus: 'pending' | 'completed';
  paymentAmount: number;
}

export interface Review {
  id: string;
  doctorId: string;
  patientId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'appointment' | 'message' | 'payment' | 'system';
  relatedId?: string;
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  time: string;
  date: string;
  isAvailable: boolean;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'credit' | 'paypal' | 'insurance';
  name: string;
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
}

export interface DoctorSpecialization {
  id: string;
  name: string;
  icon: string;
}

// Message interface for the AI Assistant
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Doctor search result interface
export interface DoctorSearchResult {
  id?: string; // Adding optional id property
  name: string;
  specialty: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: string;
  distance?: string;
}
