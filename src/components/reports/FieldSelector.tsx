import React, { useState, useEffect } from "react";
import { useCompany } from "@/context/CompanyContext";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Plus,
  Calendar,
  User,
  DollarSign,
  Briefcase,
  Clock,
  Percent,
  FileText,
  Building,
  Hash,
  Mail,
  Phone,
  MapPin,
  Star,
} from "lucide-react";

interface FieldSelectorProps {
  onFieldSelect: (field: Field) => void;
  selectedFields: Field[];
  className?: string;
}

interface Field {
  id: string;
  name: string;
  category: string;
  type: "text" | "number" | "date" | "boolean" | "currency";
  description?: string;
}

interface FieldCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  fields: Field[];
}

const FieldSelector: React.FC<FieldSelectorProps> = ({
  onFieldSelect,
  selectedFields,
  className,
}) => {
  const { currentCompany } = useCompany();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "employee",
    "payment",
  ]);

  // Sample field categories and fields
  const fieldCategories: FieldCategory[] = [
    {
      id: "employee",
      name: "Dados do Funcionário",
      icon: <User className="h-4 w-4 text-blue-500" />,
      fields: [
        {
          id: "employee_name",
          name: "Nome",
          category: "employee",
          type: "text",
          description: "Nome completo do funcionário",
        },
        {
          id: "employee_id",
          name: "Número de Funcionário",
          category: "employee",
          type: "text",
          description: "Número de identificação do funcionário",
        },
        {
          id: "employee_email",
          name: "Email",
          category: "employee",
          type: "text",
          description: "Endereço de email do funcionário",
        },
        {
          id: "employee_phone",
          name: "Telefone",
          category: "employee",
          type: "text",
          description: "Número de telefone do funcionário",
        },
        {
          id: "employee_address",
          name: "Morada",
          category: "employee",
          type: "text",
          description: "Morada do funcionário",
        },
        {
          id: "employee_hire_date",
          name: "Data de Contratação",
          category: "employee",
          type: "date",
          description: "Data em que o funcionário foi contratado",
        },
      ],
    },
    {
      id: "payment",
      name: "Dados de Pagamento",
      icon: <DollarSign className="h-4 w-4 text-green-500" />,
      fields: [
        {
          id: "base_salary",
          name: "Salário Base",
          category: "payment",
          type: "currency",
          description: "Salário base mensal do funcionário",
        },
        {
          id: "bonus",
          name: "Bónus",
          category: "payment",
          type: "currency",
          description: "Bónus ou prémios adicionais",
        },
        {
          id: "overtime_pay",
          name: "Pagamento de Horas Extra",
          category: "payment",
          type: "currency",
          description: "Valor pago por horas extraordinárias",
        },
        {
          id: "food_allowance",
          name: "Subsídio de Alimentação",
          category: "payment",
          type: "currency",
          description: "Subsídio de alimentação mensal",
        },
        {
          id: "vacation_pay",
          name: "Subsídio de Férias",
          category: "payment",
          type: "currency",
          description: "Subsídio de férias anual",
        },
        {
          id: "christmas_pay",
          name: "Subsídio de Natal",
          category: "payment",
          type: "currency",
          description: "Subsídio de Natal anual",
        },
      ],
    },
    {
      id: "tax",
      name: "Impostos e Deduções",
      icon: <Percent className="h-4 w-4 text-red-500" />,
      fields: [
        {
          id: "irs_tax",
          name: "IRS",
          category: "tax",
          type: "currency",
          description: "Imposto sobre o Rendimento de Pessoas Singulares",
        },
        {
          id: "social_security",
          name: "Segurança Social",
          category: "tax",
          type: "currency",
          description: "Contribuição para a Segurança Social",
        },
        {
          id: "health_insurance",
          name: "Seguro de Saúde",
          category: "tax",
          type: "currency",
          description: "Dedução para seguro de saúde",
        },
      ],
    },
    {
      id: "time",
      name: "Tempo e Assiduidade",
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      fields: [
        {
          id: "worked_hours",
          name: "Horas Trabalhadas",
          category: "time",
          type: "number",
          description: "Total de horas trabalhadas no período",
        },
        {
          id: "overtime_hours",
          name: "Horas Extra",
          category: "time",
          type: "number",
          description: "Total de horas extraordinárias no período",
        },
        {
          id: "absence_days",
          name: "Dias de Ausência",
          category: "time",
          type: "number",
          description: "Número de dias de ausência no período",
        },
        {
          id: "vacation_days",
          name: "Dias de Férias",
          category: "time",
          type: "number",
          description: "Número de dias de férias no período",
        },
      ],
    },
    {
      id: "position",
      name: "Cargo e Departamento",
      icon: <Briefcase className="h-4 w-4 text-purple-500" />,
      fields: [
        {
          id: "job_title",
          name: "Cargo",
          category: "position",
          type: "text",
          description: "Cargo ou função do funcionário",
        },
        {
          id: "department",
          name: "Departamento",
          category: "position",
          type: "text",
          description: "Departamento do funcionário",
        },
        {
          id: "manager",
          name: "Gestor",
          category: "position",
          type: "text",
          description: "Nome do gestor direto",
        },
        {
          id: "years_of_service",
          name: "Anos de Serviço",
          category: "position",
          type: "number",
          description: "Número de anos de serviço na empresa",
        },
      ],
    },
    {
      id: "company",
      name: "Dados da Empresa",
      icon: <Building className="h-4 w-4 text-slate-500" />,
      fields: [
        {
          id: "company_name",
          name: "Nome da Empresa",
          category: "company",
          type: "text",
          description: "Nome legal da empresa",
        },
        {
          id: "company_nif",
          name: "NIF da Empresa",
          category: "company",
          type: "text",
          description: "Número de Identificação Fiscal da empresa",
        },
        {
          id: "company_address",
          name: "Morada da Empresa",
          category: "company",
          type: "text",
          description: "Morada fiscal da empresa",
        },
      ],
    },
  ];

  // Filter fields based on search query
  const filteredCategories = fieldCategories
    .map((category) => ({
      ...category,
      fields: category.fields.filter(
        (field) =>
          field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          field.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.fields.length > 0);

  const handleFieldClick = (field: Field) => {
    onFieldSelect(field);
  };

  const isFieldSelected = (fieldId: string) => {
    return selectedFields.some((field) => field.id === fieldId);
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="h-3.5 w-3.5 text-slate-500" />;
      case "number":
        return <Hash className="h-3.5 w-3.5 text-slate-500" />;
      case "date":
        return <Calendar className="h-3.5 w-3.5 text-slate-500" />;
      case "currency":
        return <DollarSign className="h-3.5 w-3.5 text-slate-500" />;
      case "boolean":
        return <Star className="h-3.5 w-3.5 text-slate-500" />;
      default:
        return <FileText className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col bg-white border rounded-md",
        className,
      )}
    >
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium mb-2">Campos Disponíveis</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Pesquisar campos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-2">
        {filteredCategories.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>Nenhum campo encontrado</p>
            <p className="text-sm">Tente outro termo de pesquisa</p>
          </div>
        ) : (
          <Accordion
            type="multiple"
            value={expandedCategories}
            onValueChange={setExpandedCategories}
            className="space-y-2"
          >
            {filteredCategories.map((category) => (
              <AccordionItem
                key={category.id}
                value={category.id}
                className="border rounded-md overflow-hidden"
              >
                <AccordionTrigger className="px-3 py-2 hover:bg-gray-50">
                  <div className="flex items-center">
                    {category.icon}
                    <span className="ml-2 font-medium">{category.name}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {category.fields.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 p-1">
                    {category.fields.map((field) => (
                      <div
                        key={field.id}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-md text-sm cursor-pointer transition-colors",
                          isFieldSelected(field.id)
                            ? "bg-primary/10 text-primary hover:bg-primary/15"
                            : "hover:bg-gray-100",
                        )}
                        onClick={() => handleFieldClick(field)}
                      >
                        <div className="mr-2">{getFieldIcon(field.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {field.name}
                          </div>
                          {field.description && (
                            <div className="text-xs text-gray-500 truncate">
                              {field.description}
                            </div>
                          )}
                        </div>
                        {isFieldSelected(field.id) && (
                          <Badge className="ml-2 bg-primary/20 text-primary border-primary/20 hover:bg-primary/30">
                            Selecionado
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </ScrollArea>

      <div className="p-3 border-t bg-gray-50">
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-1"
          onClick={() => {}}
        >
          <Plus className="h-4 w-4" />
          <span>Criar Campo Personalizado</span>
        </Button>
      </div>
    </div>
  );
};

export default FieldSelector;
