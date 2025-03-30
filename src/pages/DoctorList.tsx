import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { DoctorCard } from "@/components/DoctorCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { User } from "@/types";
import { specializations } from "@/data/mockUtilities";

const DoctorList = () => {
  const [doctors, setDoctors] = useState<User[]>([
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
    {
      id: "3",
      name: "Dr. Emily White",
      email: "emily@example.com",
      phone: "+1555123456",
      role: "doctor",
      specialization: "Dermatology",
      experience: "8+ years",
      rating: 4.7,
      reviews: 110,
      avatar: "/placeholder.svg",
    },
    {
      id: "4",
      name: "Dr. Michael Brown",
      email: "michael@example.com",
      phone: "+1111222333",
      role: "doctor",
      specialization: "Pediatrics",
      experience: "12+ years",
      rating: 4.9,
      reviews: 150,
      avatar: "/placeholder.svg",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

  const filteredDoctors = doctors.filter((doctor) => {
    const searchMatch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const specializationMatch =
      selectedSpecializations.length === 0 || selectedSpecializations.includes(doctor.specialization || '');

    return searchMatch && specializationMatch;
  });

  const handleSpecializationChange = (specialization: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(specialization) ? prev.filter((s) => s !== specialization) : [...prev, specialization]
    );
  };

  return (
    <AppLayout title="Find a Doctor">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Search doctors..."
              className="mr-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="h-5 w-5 text-gray-500" />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Filter Doctors</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Specialization</h4>
                  <div className="grid gap-2">
                    {specializations.map((specialization) => (
                      <div key={specialization.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={specialization.id}
                          checked={selectedSpecializations.includes(specialization.name)}
                          onCheckedChange={() => handleSpecializationChange(specialization.name)}
                        />
                        <Label htmlFor={specialization.id} className="cursor-pointer">
                          {specialization.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default DoctorList;
