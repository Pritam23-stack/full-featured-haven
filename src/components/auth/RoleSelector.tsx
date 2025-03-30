
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RoleSelectorProps {
  selectedRole: 'patient' | 'doctor' | 'admin';
  onChange: (role: 'patient' | 'doctor' | 'admin') => void;
  showAdmin?: boolean;
}

export function RoleSelector({ selectedRole, onChange, showAdmin = false }: RoleSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Register as:</h3>
      <RadioGroup
        defaultValue={selectedRole}
        onValueChange={(value) => onChange(value as 'patient' | 'doctor' | 'admin')}
        className="grid grid-cols-2 gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="patient" id="patient" />
          <Label htmlFor="patient" className="cursor-pointer">Patient</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="doctor" id="doctor" />
          <Label htmlFor="doctor" className="cursor-pointer">Doctor</Label>
        </div>
        {showAdmin && (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="admin" id="admin" />
            <Label htmlFor="admin" className="cursor-pointer">Admin</Label>
          </div>
        )}
      </RadioGroup>
    </div>
  );
}
