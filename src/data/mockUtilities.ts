
import { User, Appointment, Review, Notification, PaymentMethod, TimeSlot, DoctorSpecialization } from "@/types";

// Specialization mock data
export const specializations: DoctorSpecialization[] = [
  { id: "1", name: "Cardiology", icon: "heart" },
  { id: "2", name: "Neurology", icon: "brain" },
  { id: "3", name: "Dermatology", icon: "skin" },
  { id: "4", name: "Pediatrics", icon: "baby" },
  { id: "5", name: "Orthopedics", icon: "bone" },
  { id: "6", name: "Gynecology", icon: "woman" },
  { id: "7", name: "Ophthalmology", icon: "eye" },
  { id: "8", name: "Dentistry", icon: "tooth" },
];

// User notification mocks
export const getUserNotifications = (userId: string): Notification[] => {
  return [
    {
      id: "1",
      userId,
      title: "Appointment Reminder",
      message: "You have an appointment tomorrow at 10:00 AM",
      timestamp: new Date().toISOString(),
      read: false,
      type: "appointment"
    },
    {
      id: "2",
      userId,
      title: "New Message",
      message: "Dr. Johnson sent you a message",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true,
      type: "message"
    },
    {
      id: "3",
      userId,
      title: "Payment Confirmation",
      message: "Your payment for the last appointment was successful",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      read: true,
      type: "payment"
    },
  ];
};

// User payment methods mocks
export const getUserPaymentMethods = (userId: string): PaymentMethod[] => {
  return [
    {
      id: "1",
      userId,
      type: "credit",
      name: "Visa ending in 4242",
      last4: "4242",
      expiryDate: "12/25",
      isDefault: true
    },
    {
      id: "2",
      userId,
      type: "paypal",
      name: "PayPal",
      isDefault: false
    },
    {
      id: "3",
      userId,
      type: "insurance",
      name: "Health Insurance",
      isDefault: false
    },
  ];
};

// Doctor reviews
export const reviews: Review[] = [
  {
    id: "1",
    doctorId: "1",
    patientId: "2",
    rating: 5,
    comment: "Dr. Smith was very professional and knowledgeable. Highly recommended!",
    date: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: "2",
    doctorId: "1",
    patientId: "3",
    rating: 4,
    comment: "Good experience overall. Would visit again.",
    date: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: "3",
    doctorId: "2",
    patientId: "1",
    rating: 5,
    comment: "Dr. Johnson explained everything in detail and was very patient.",
    date: new Date(Date.now() - 172800000).toISOString()
  },
];

// Time slots for doctors
export const getTimeSlotsByDoctorAndDate = (doctorId: string, date: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
  
  times.forEach((time, index) => {
    slots.push({
      id: `${doctorId}-${date}-${index}`,
      doctorId,
      date,
      time,
      isAvailable: Math.random() > 0.3 // 70% chance of being available
    });
  });
  
  return slots;
};

// All users (for admin dashboard)
export const getAllUsers = (): User[] => {
  return [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      role: "patient",
      avatar: "",
    },
    {
      id: "2",
      name: "Dr. Sarah Smith",
      email: "sarah@example.com",
      phone: "+1987654321",
      role: "doctor",
      specialization: "Cardiology",
      experience: "10+ years",
      rating: 4.8,
      reviews: 125,
      avatar: "",
    },
    {
      id: "3",
      name: "Admin User",
      email: "admin@example.com",
      phone: "+1555555555",
      role: "admin",
      avatar: "",
    },
  ];
};
