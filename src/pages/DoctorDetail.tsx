import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail, Calendar, Clock, Star, ChevronDown, ChevronUp } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reviews } from "@/data/mockUtilities";

const DoctorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  
  // Mock doctor data (replace with actual data fetching)
  const doctor = {
    id: "1",
    name: "Dr. Sarah Smith",
    specialization: "Cardiologist",
    avatar: "/placeholder.svg",
    rating: 4.8,
    reviews: 125,
    experience: "10+ years",
    bio: "Dr. Smith is a board-certified cardiologist with over 10 years of experience. She specializes in treating heart failure, hypertension, and arrhythmias.",
    address: "123 Main Street, Anytown, USA",
    phone: "+1 (555) 123-4567",
    email: "sarah.smith@example.com",
    availability: "Mon-Fri, 9am-5pm",
  };
  
  const doctorReviews = reviews.filter(review => review.doctorId === doctor.id);
  
  const toggleBio = () => {
    setShowMore(!showMore);
  };

  return (
    <AppLayout title="Doctor Details" showNotifications={false}>
      <div className="container mx-auto py-6">
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={doctor.avatar} alt={doctor.name} />
                <AvatarFallback>{doctor.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{doctor.name}</h2>
                <p className="text-gray-500">{doctor.specialization}</p>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-medium">{doctor.rating}</span>
                  <span className="text-gray-500 ml-1">({doctor.reviews} reviews)</span>
                </div>
                <Badge variant="secondary" className="mt-2">{doctor.experience}</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                <div className="flex items-center text-gray-600 mb-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  {doctor.address}
                </div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Phone className="h-4 w-4 mr-2" />
                  {doctor.phone}
                </div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Mail className="h-4 w-4 mr-2" />
                  {doctor.email}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Availability</h3>
                <div className="flex items-center text-gray-600 mb-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  {doctor.availability}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-gray-700">
                {showMore ? doctor.bio : `${doctor.bio?.substring(0, 200)}...`}
                <button onClick={toggleBio} className="text-primary font-medium ml-1">
                  {showMore ? (
                    <>
                      Show Less <ChevronUp className="inline-block h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown className="inline-block h-4 w-4 ml-1" />
                    </>
                  )}
                </button>
              </p>
            </div>
            
            <Button className="w-full mt-6" onClick={() => navigate(`/book-appointment/${doctor.id}`)}>
              <Clock className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList>
            <TabsTrigger value="reviews">Reviews ({doctorReviews.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="reviews">
            <div className="space-y-4">
              {doctorReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="flex items-center">
                          {Array.from({ length: review.rating }, (_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">
                          {review.comment}
                        </p>
                      </div>
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

export default DoctorDetail;
