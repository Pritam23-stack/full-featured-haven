import { useState, useRef, useEffect } from "react";
import { Send, Bot, Loader2, MapPin, Search, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChatMessage, DoctorSearchResult } from "@/types";

export default function AiAssistant() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "Hello! I'm KABIRAJ AI. How can I assist you with your health concerns today?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nearbyDoctors, setNearbyDoctors] = useState<DoctorSearchResult[]>([]);
  const [isSearchingDoctors, setIsSearchingDoctors] = useState(false);
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionNote, setPrescriptionNote] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, nearbyDoctors]);
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage: ChatMessage = {
      id: userMessageId,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    try {
      // Call Supabase Edge Function for Gemini AI
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          messages: [...messages, userMessage]
        }
      });
      
      if (error) throw error;
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        content: data.reply || "I'm sorry, I couldn't generate a response. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Check if the message is asking about finding doctors
      const lowerCaseInput = inputMessage.toLowerCase();
      if (
        (lowerCaseInput.includes("doctor") || lowerCaseInput.includes("specialist")) &&
        (lowerCaseInput.includes("near") || lowerCaseInput.includes("nearby") || lowerCaseInput.includes("find"))
      ) {
        setTimeout(() => {
          const followUpMessage: ChatMessage = {
            id: Date.now().toString(),
            content: "Would you like me to help you find doctors in your area who specialize in treating this condition?",
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, followUpMessage]);
        }, 1000);
      }
      
    } catch (error) {
      console.error("Error calling AI:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response from the AI assistant. Please try again."
      });
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error. Please try again later.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFindDoctorsNearby = () => {
    toast({
      title: "Location access",
      description: "Please allow access to your location to find doctors nearby.",
      action: (
        <Button onClick={() => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              setIsSearchingDoctors(true);
              
              try {
                // Extract health condition from messages
                const lastFewMessages = messages.slice(-5);
                const userMessages = lastFewMessages.filter(m => m.sender === 'user').map(m => m.content).join(" ");
                
                // Get specialty from messages
                const { data, error } = await supabase.functions.invoke('gemini-chat', {
                  body: {
                    searchDoctors: userMessages,
                    location: `${position.coords.latitude},${position.coords.longitude}`
                  }
                });
                
                if (error) throw error;
                
                if (data.doctors && data.doctors.length > 0) {
                  setNearbyDoctors(data.doctors);
                  
                  const successMessage: ChatMessage = {
                    id: Date.now().toString(),
                    content: `I've found several specialists who might be able to help you. Please see the list below.`,
                    sender: 'ai',
                    timestamp: new Date()
                  };
                  
                  setMessages(prev => [...prev, successMessage]);
                } else {
                  throw new Error("No doctors found nearby");
                }
              } catch (error) {
                console.error("Error finding doctors:", error);
                
                const errorMessage: ChatMessage = {
                  id: Date.now().toString(),
                  content: "I couldn't find any specialists in your area. Please try again or use our doctor search page.",
                  sender: 'ai',
                  timestamp: new Date()
                };
                
                setMessages(prev => [...prev, errorMessage]);
                
                toast({
                  variant: "destructive",
                  title: "Search failed",
                  description: "We couldn't find doctors in your area. Please try again."
                });
              } finally {
                setIsSearchingDoctors(false);
              }
            },
            (error) => {
              toast({
                variant: "destructive",
                title: "Location access denied",
                description: "We couldn't access your location. Please enable location services and try again."
              });
            }
          );
        }}>
          Allow
        </Button>
      ),
    });
  };
  
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPrescriptionFile(e.target.files[0]);
      setShowPrescriptionUpload(true);
    }
  };
  
  const handleUploadPrescription = async () => {
    if (!prescriptionFile || !user) return;
    
    try {
      const fileExt = prescriptionFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `prescriptions/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('medical-files')
        .upload(filePath, prescriptionFile);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('medical-files')
        .getPublicUrl(filePath);
      
      const fileUrl = data.publicUrl;
      
      // Add prescription message to chat
      const prescriptionMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `I've uploaded my prescription: ${prescriptionNote || 'No notes provided'}`,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, prescriptionMessage]);
      
      // Response from AI confirming upload
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Your prescription has been uploaded. It will be shared with your doctor for review.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      toast({
        title: "Prescription uploaded",
        description: "Your prescription has been successfully uploaded."
      });
      
      // Reset the form
      setShowPrescriptionUpload(false);
      setPrescriptionFile(null);
      setPrescriptionNote("");
    } catch (error) {
      console.error("Error uploading prescription:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "We couldn't upload your prescription. Please try again."
      });
    }
  };
  
  return (
    <AppLayout title="KABIRAJ AI Assistant">
      <div className="flex flex-col h-[calc(100vh-120px)]">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {message.sender === "ai" && (
                    <div className="flex items-center mb-1">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src="/placeholder.svg" alt="AI" />
                        <AvatarFallback>
                          <Bot size={16} />
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">KABIRAJ AI</span>
                    </div>
                  )}
                  <p className={message.sender === "user" ? "text-white" : "text-gray-800"}>
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {messages.some(m => 
            m.sender === 'ai' && 
            m.content.includes("find doctors in your area")
          ) && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <p>Find specialists in your area</p>
                  <Button onClick={handleFindDoctorsNearby} disabled={isSearchingDoctors}>
                    {isSearchingDoctors ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        Find Nearby Doctors
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {nearbyDoctors.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Doctors near you:</h3>
              <div className="space-y-3">
                {nearbyDoctors.map((doctor, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{doctor.name}</h4>
                          <p className="text-sm text-gray-600">{doctor.specialty}</p>
                          <p className="text-sm text-gray-600">{doctor.address}</p>
                          {doctor.phone && (
                            <p className="text-sm text-gray-600">{doctor.phone}</p>
                          )}
                          <div className="flex space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {doctor.rating ? `${doctor.rating} ★` : 'No rating'}
                            </Badge>
                            {doctor.distance && (
                              <Badge variant="outline" className="text-xs">
                                {doctor.distance}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/doctors/${doctor.id || index}`)}
                        >
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-white">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleFileSelect}
              className="shrink-0"
              title="Upload Prescription"
            >
              <Upload className="h-4 w-4" />
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
            </Button>
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Prescription Upload Dialog */}
      <Dialog open={showPrescriptionUpload} onOpenChange={setShowPrescriptionUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Prescription</DialogTitle>
            <DialogDescription>
              This prescription will be shared with your doctor.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {prescriptionFile?.name}
              </div>
            </div>
            
            <Textarea
              placeholder="Add notes about your prescription..."
              value={prescriptionNote}
              onChange={(e) => setPrescriptionNote(e.target.value)}
              rows={3}
            />
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShowPrescriptionUpload(false)}>
                Cancel
              </Button>
              <Button onClick={handleUploadPrescription}>
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
