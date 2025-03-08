import React from "react";
import EmployeeProfile from "../employees/EmployeeProfile";

const EmployeeProfileDemo = () => {
  // Dados de exemplo para o funcionário
  const employeeData = {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@empresa.pt",
    phone: "+351 912 345 678",
    address: "Rua das Flores, 123, Lisboa",
    department: "Recursos Humanos",
    position: "Gerente de RH",
    status: "active" as const,
    hireDate: new Date("2020-03-15"),
    birthDate: new Date("1985-06-20"),
    nif: "123456789",
    bankAccount: "PT50 1234 5678 9012 3456 7890 1",
    emergencyContact: "+351 923 456 789 (Maria Silva)",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    manager: "Carlos Mendes",
    contractType: "Sem Termo",
    education: "Mestrado em Gestão de Recursos Humanos",
    skills: [
      "Recrutamento",
      "Gestão de Equipes",
      "Legislação Laboral",
      "Formação",
    ],
    baseSalary: 2500,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <EmployeeProfile employee={employeeData} />
    </div>
  );
};

export default EmployeeProfileDemo;
