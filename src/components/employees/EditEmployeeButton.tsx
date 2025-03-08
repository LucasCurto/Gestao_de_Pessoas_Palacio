import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import EditEmployeeForm from "./EditEmployeeForm";
import { EmployeeFormData } from "./EditEmployeeForm";

interface EditEmployeeButtonProps {
  employee: EmployeeFormData;
  onEmployeeUpdate: (updatedEmployee: EmployeeFormData) => void;
}

const EditEmployeeButton: React.FC<EditEmployeeButtonProps> = ({
  employee,
  onEmployeeUpdate,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (data: EmployeeFormData) => {
    onEmployeeUpdate(data);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setIsDialogOpen(true)}
      >
        <Edit className="h-4 w-4" /> Editar
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
            <DialogDescription>
              Atualize as informações do funcionário abaixo.
            </DialogDescription>
          </DialogHeader>
          <EditEmployeeForm
            employee={employee}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditEmployeeButton;
