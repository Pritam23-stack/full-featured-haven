import { useState, useEffect } from "react";
import { Calendar, Users, Clock, ChevronRight, Search } from "lucide-react";
import { format } from "date-fns";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { getAllUsers } from "@/data/mockUtilities";
import { User, Appointment } from "@/types";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [filterQuery, setFilterQuery] = useState("");
  
  useEffect(() => {
    if (user) {
      // In a real app, fetch doctor's appointments and patients
      // For now, we'll use mock data
      const mockAppointments = [
        {
          id: "1",
          doctorId: user.id,
          patientId: "2",
          date: format(new Date(), 'yyyy-MM-dd'),
          time: "09:00",
          status: "pending" as const,
          type: "online" as const,
          reason: "Regular checkup",
          paymentStatus: "pending" as const,
          paymentAmount: 50
        },
        {
          id: "2",
          doctorId: user.id,
          patientId: "3",
          date: format(new Date(), 'yyyy-MM-dd'),
          time: "10:30",
          status: "confirmed" as const,
          type: "in-person" as const,
          reason: "Follow-up appointment",
          paymentStatus: "completed" as const,
          paymentAmount: 75
        }
      ];
      
      setAppointments(mockAppointments);
      
      // Get all users who are patients
      const allUsers = getAllUsers();
      const patientUsers = allUsers.filter(u => u.role === "patient").map(p => ({
        ...p,
        role: "patient" as const
      }));
      setPatients(patientUsers);
    }
  }, [user]);

  const filteredAppointments = appointments.filter(appointment => {
    const patient = patients.find(p => p.id === appointment.patientId);
    if (!patient) return false;
    return patient.name.toLowerCase().includes(filterQuery.toLowerCase());
  });

  return (
    <AppLayout title="Doctor Dashboard">
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Welcome, Dr. {user?.name}!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Here's an overview of your upcoming appointments and recent
                activity.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card className="bg-blue-50 text-blue-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Appointments
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-blue-400">+20% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 text-green-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
              <p className="text-xs text-green-400">+10% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 text-yellow-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Payments
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$500</div>
              <p className="text-xs text-yellow-400">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
          </TabsList>
          <TabsContent value="appointments" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
              <Input
                type="text"
                placeholder="Filter by patient name..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="max-w-xs"
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredAppointments.map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                return patient ? (
                  <Card key={appointment.id}>
                    <CardContent className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{patient.name}</h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(appointment.date), "PPP")} at {appointment.time}
                        </p>
                        <Badge variant="secondary">{appointment.type}</Badge>
                      </div>
                      <Button size="sm">
                        View Details <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ) : null;
              })}
            </div>
          </TabsContent>
          <TabsContent value="patients" className="space-y-4">
            <h2 className="text-lg font-semibold">Your Patients</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {patients.map((patient) => (
                <Card key={patient.id}>
                  <CardContent className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={patient.avatar} alt={patient.name} />
                      <AvatarFallback>{patient.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-sm font-medium">{patient.name}</h3>
                      <p className="text-xs text-gray-500">{patient.email}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default DoctorDashboard;
