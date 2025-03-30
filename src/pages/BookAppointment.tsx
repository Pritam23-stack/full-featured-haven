import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { getTimeSlotsByDoctorAndDate } from "@/data/mockUtilities";

const BookAppointment = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [appointmentType, setAppointmentType] = useState<'online' | 'in-person'>('online');
  const [reason, setReason] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  
  useEffect(() => {
    if (doctorId && date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const slots = getTimeSlotsByDoctorAndDate(doctorId, formattedDate);
      setTimeSlots(slots);
    }
  }, [doctorId, date]);
  
  const handleTimeSlotClick = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleBookAppointment = () => {
    if (!date || !selectedTime || !doctorId) {
      alert("Please select a date and time.");
      return;
    }
    
    // In a real app, you would send this data to your backend
    const appointmentData = {
      doctorId,
      date: format(date, 'yyyy-MM-dd'),
      time: selectedTime,
      type: appointmentType,
      reason
    };
    
    console.log("Appointment Data:", appointmentData);
    
    // Redirect to confirmation page
    navigate("/appointment-confirmation");
  };
  
  return (
    <AppLayout title="Book Appointment">
      <div className="container max-w-2xl mx-auto py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            Book an Appointment
          </h2>
          <p className="text-gray-500">
            Choose a date and time for your appointment with Dr. Smith.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Select Date
          </h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date < addDays(new Date(), 0)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Select Time
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {timeSlots.map((slot) => (
              <Button
                key={slot.id}
                variant={selectedTime === slot.time ? "secondary" : "outline"}
                onClick={() => handleTimeSlotClick(slot.time)}
                disabled={!slot.isAvailable}
              >
                {slot.time}
                {!slot.isAvailable && (
                  <Badge className="ml-2">Booked</Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Appointment Type
          </h3>
          <RadioGroup defaultValue={appointmentType} onValueChange={setAppointmentType} className="flex space-x-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="online" id="r1" />
              <Label htmlFor="r1">Online</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in-person" id="r2" />
              <Label htmlFor="r2">In-Person</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Reason for Appointment
          </h3>
          <Textarea 
            placeholder="Describe your symptoms or reason for the appointment..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        
        <div>
          <Button className="w-full" onClick={handleBookAppointment}>
            Book Appointment
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default BookAppointment;
