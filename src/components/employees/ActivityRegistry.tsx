import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Save, X, Plus } from "lucide-react";

export interface Activity {
  id: string;
  type: string;
  description: string;
  date: Date;
  hours: number;
  rate: number;
  status: "pending" | "approved" | "rejected" | "paid";
}

interface ActivityRegistryProps {
  employeeId: string;
  employeeName: string;
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, "id" | "status">) => void;
  onApproveActivity: (activityId: string) => void;
  onRejectActivity: (activityId: string) => void;
}

const ActivityRegistry: React.FC<ActivityRegistryProps> = ({
  employeeId,
  employeeName,
  activities,
  onAddActivity,
  onApproveActivity,
  onRejectActivity,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newActivity, setNewActivity] = useState<Omit<Activity, "id" | "status"> & {hours: any, rate: any}>({
    type: "overtime",
    description: "",
    date: new Date(),
    hours: "",
    rate: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewActivity({ ...newActivity, [name]: value });
    console.log("Activity updated:", { ...newActivity, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewActivity({ ...newActivity, [name]: parseFloat(value) || 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting activity:", { employeeId, ...newActivity });
      // Ao adicionar uma atividade, ela já vai direto para aprovação
      onAddActivity({
        employeeId,
        ...newActivity,
      });
      setNewActivity({
        type: "overtime",
        description: "",
        date: new Date(),
        hours: "",
        rate: "",
      });
      setShowForm(false);
      alert("Atividade registrada com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar atividade:", error);
      alert(
        "Erro ao registrar atividade. Verifique o console para mais detalhes.",
      );
    }
  };

  const getStatusBadge = (status