
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Search } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DoctorCard } from "@/components/DoctorCard";
import { User } from "@/types";
import { specializations } from "@/data/mockUtilities";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recommendedDoctors, setRecommendedDoctors] = useState<User[]>([]);
  const [featuredSpecialties, setFeaturedSpecialties] = useState(specializations.slice(0, 4));

  useEffect(() => {
    // Fetch data for patient dashboard
    // This would normally fetch from an API
  }, [user, navigate]);

  const handleSearch = () => {
    // Implement search logic
    console.log("Searching for:", searchQuery);
  };

  // Mock recommended doctors
  useEffect(() => {
    const mockDoctors: User[] = [
      {
        id: "1",
        name: "Dr. Sarah Smith",
        email: "sarah@example.com",
        phone: "+1987654321",
        role: "doctor",
        specialization: "Cardiology",
        experience: "10+ years",
        rating: 4.8,
        reviews: 125,
        avatar: "/placeholder.svg",
      },
      {
        id: "2",
        name: "Dr. John Doe",
        email: "john@example.com",
        phone: "+1123456789",
        role: "doctor",
        specialization: "Neurology",
        experience: "5+ years",
        rating: 4.5,
        reviews: 80,
        avatar: "/placeholder.svg",
      },
    ];
    setRecommendedDoctors(mockDoctors);
  }, []);

  // Mock upcoming appointments
  useEffect(() => {
    const mockAppointments = [
      {
        id: "1",
        doctorId: "1",
        patientId: user?.id || "1",
        date: "2024-03-15",
        time: "10:00 AM",
        status: "confirmed",
        type: "in-person",
        reason: "Regular checkup",
        paymentStatus: "completed",
        paymentAmount: 100,
      },
      {
        id: "2",
        doctorId: "2",
        patientId: user?.id || "1",
        date: "2024-03-20",
        time: "02:30 PM",
        status: "pending",
        type: "online",
        reason: "Follow-up consultation",
        paymentStatus: "pending",
        paymentAmount: 75,
      },
    ];
    setUpcomingAppointments(mockAppointments);
  }, [user]);

  return (
    <AppLayout title="Dashboard">
      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Search for doctors, specialties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch} className="ml-2">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between border-b py-2"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {appointment.date} at {appointment.time}
                    </p>
                    <p className="text-xs text-gray-500">{appointment.reason}</p>
                  </div>
                  <Badge variant="secondary">{appointment.status}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No upcoming appointments.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="link">View All</Button>
          </CardFooter>
        </Card>

        {/* Recommended Doctors */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Doctors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendedDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} compact />
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="link">Find More Doctors</Button>
          </CardFooter>
        </Card>

        {/* Featured Specialties */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Specialties</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {featuredSpecialties.map((specialty) => (
              <div key={specialty.id} className="flex items-center space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg" alt={specialty.name} />
                  <AvatarFallback>{specialty.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{specialty.name}</p>
                  <p className="text-xs text-gray-500">Specialty</p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="link">Explore All Specialties</Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
