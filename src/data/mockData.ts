export const getAllDoctors = () => {
  // In a real app, this would come from an API call to the backend
  return [
    {
      id: "doctor1",
      name: "Dr. John Smith",
      specialty: "Cardiologist",
      avatar: "/placeholder.svg",
      bio: "Dr. Smith is a board-certified cardiologist with over 10 years of experience.",
      location: "New York, NY",
      availability: "Mon-Fri, 9am-5pm",
      rating: 4.5,
      reviews: 120,
      phone: "+1234567890",
      address: "123 Main St, New York, NY 10001",
    },
    {
      id: "doctor2",
      name: "Dr. Emily Johnson",
      specialty: "Dermatologist",
      avatar: "/placeholder.svg",
      bio: "Dr. Johnson is a board-certified dermatologist specializing in skin cancer and cosmetic dermatology.",
      location: "Los Angeles, CA",
      availability: "Tue-Sat, 10am-6pm",
      rating: 4.8,
      reviews: 155,
      phone: "+1987654321",
      address: "456 Elm St, Los Angeles, CA 90001",
    },
    {
      id: "doctor3",
      name: "Dr. Michael Brown",
      specialty: "Pediatrician",
      avatar: "/placeholder.svg",
      bio: "Dr. Brown is a board-certified pediatrician with a passion for helping children grow and thrive.",
      location: "Chicago, IL",
      availability: "Mon-Fri, 8am-4pm",
      rating: 4.2,
      reviews: 90,
      phone: "+1122334455",
      address: "789 Oak St, Chicago, IL 60601",
    },
    {
      id: "doctor4",
      name: "Dr. Sarah Williams",
      specialty: "Neurologist",
      avatar: "/placeholder.svg",
      bio: "Dr. Williams is a board-certified neurologist specializing in the diagnosis and treatment of neurological disorders.",
      location: "Houston, TX",
      availability: "Wed-Sun, 11am-7pm",
      rating: 4.9,
      reviews: 180,
      phone: "+1555666777",
      address: "101 Pine St, Houston, TX 77001",
    },
  ];
};

export const getDoctorById = (id: string) => {
  const doctors = getAllDoctors();
  return doctors.find(doctor => doctor.id === id);
};

export const getUserAppointments = (userId: string) => {
  // In a real app, this would come from an API call to the backend
  return [
    {
      id: "appt1",
      doctorId: "doctor1",
      patientId: userId,
      date: "2024-08-15",
      time: "10:00 AM",
      type: "In-person",
      reason: "Annual checkup",
      status: "confirmed",
    },
    {
      id: "appt2",
      doctorId: "doctor2",
      patientId: userId,
      date: "2024-08-20",
      time: "02:30 PM",
      type: "Virtual",
      reason: "Skin rash",
      status: "pending",
    },
    {
      id: "appt3",
      doctorId: "doctor3",
      patientId: userId,
      date: "2024-09-01",
      time: "11:15 AM",
      type: "In-person",
      reason: "Vaccination",
      status: "completed",
    },
    {
      id: "appt4",
      doctorId: "doctor4",
      patientId: userId,
      date: "2024-09-10",
      time: "09:45 AM",
      type: "Virtual",
      reason: "Headaches",
      status: "cancelled",
    },
  ];
};

export const getConversationMessages = (userId: string, doctorId: string) => {
  // In a real app, this would come from an API call to the backend
  return [
    {
      id: "msg1",
      senderId: doctorId,
      receiverId: userId,
      content: "Hello! How can I help you today?",
      timestamp: "2024-08-10T09:00:00",
      read: true,
    },
    {
      id: "msg2",
      senderId: userId,
      receiverId: doctorId,
      content: "I've been having headaches for the past few days.",
      timestamp: "2024-08-10T09:05:00",
      read: true,
    },
    {
      id: "msg3",
      senderId: doctorId,
      receiverId: userId,
      content: "I see. Can you describe the pain?",
      timestamp: "2024-08-10T09:10:00",
      read: false,
    },
  ];
};

export const getAllUsers = () => {
  // In a real app, this would come from an API call to the backend
  return [
    {
      id: "user1",
      name: "John Smith",
      email: "john@example.com",
      phone: "+1234567890",
      avatar: "/placeholder.svg",
      role: "patient"
    },
    {
      id: "user2",
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+1987654321",
      avatar: "/placeholder.svg",
      role: "patient"
    },
    {
      id: "user3",
      name: "Michael Johnson",
      email: "michael@example.com",
      phone: "+1122334455",
      avatar: "/placeholder.svg",
      role: "patient"
    },
    {
      id: "user4",
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "+1555666777",
      avatar: "/placeholder.svg",
      role: "patient"
    },
    {
      id: "doctor1",
      name: "Dr. Robert Chen",
      email: "robert@hospital.com",
      phone: "+1999888777",
      avatar: "/placeholder.svg",
      role: "doctor"
    },
    {
      id: "admin1",
      name: "Admin User",
      email: "admin@hospital.com",
      phone: "+1000111222",
      avatar: "/placeholder.svg",
      role: "admin"
    }
  ];
};
