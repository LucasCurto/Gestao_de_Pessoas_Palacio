import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ReportField {
  id: string;
  name: string;
  label: string;
  type: string;
  source: string;
  width: number;
  visible: boolean;
  sortable: boolean;
  filterable: boolean;
}

interface FieldSelectorProps {
  fields: ReportField[];
  selectedFields: ReportField[];
  onFieldToggle: (field: ReportField) => void;
}

const FieldSelector: React.FC<FieldSelectorProps> = ({
  fields,
  selectedFields,
  onFieldToggle,
}) => {
  const isFieldSelected = (fieldId: string) => {
    return selectedFields.some((field) => field.id === fieldId);
  };

  // Group fields by type for better organization
  const groupedFields: Record<string, ReportField[]> = fields.reduce(
    (acc, field) => {
      const type = field.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(field);
      return acc;
    },
    {} as Record<string, ReportField[]>,
  );

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "string":
        return "Texto";
      case "number":
        return "Número";
      case "date":
        return "Data";
      case "boolean":
        return "Booleano";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedFields).map(([type, typeFields]) => (
        <div key={type} className="space-y-2">
          <h4 className="text-xs font-medium text-gray-500 uppercase">
            {getTypeLabel(type)}
          </h4>
          <div className="space-y-2">
            {typeFields.map((field) => (
              <div
                key={field.id}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md"
              >
                <Checkbox
                  id={`field-${field.id}`}
                  checked={isFieldSelected(field.id)}
                  onCheckedChange={() => onFieldToggle(field)}
                />
                <Label
                  htmlFor={`field-${field.id}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {field.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <p>Nenhum campo disponível</p>
        </div>
      )}
    </div>
  );
};

export default FieldSelector;
