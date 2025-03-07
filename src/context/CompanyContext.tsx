import React, { createContext, useState, useContext, ReactNode } from "react";

interface Company {
  id: string;
  name: string;
  nif: string;
  logo?: string;
}

interface CompanyContextType {
  currentCompany: Company;
  companies: Company[];
  setCurrentCompany: (company: Company) => void;
  addCompany: (company: Omit<Company, "id">) => void;
}

const defaultCompany: Company = {
  id: "1",
  name: "Empresa Exemplo, Lda.",
  nif: "123456789",
};

const defaultCompanies: Company[] = [
  defaultCompany,
  {
    id: "2",
    name: "Outra Empresa, S.A.",
    nif: "987654321",
  },
];

const CompanyContext = createContext<CompanyContextType>({
  currentCompany: defaultCompany,
  companies: defaultCompanies,
  setCurrentCompany: () => {},
  addCompany: () => {},
});

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentCompany, setCurrentCompany] = useState<Company>(defaultCompany);
  const [companies, setCompanies] = useState<Company[]>(defaultCompanies);

  const handleSetCurrentCompany = (company: Company) => {
    setCurrentCompany(company);
    // Aqui você poderia adicionar lógica para carregar dados específicos da empresa
    // como buscar do backend, etc.
  };

  const handleAddCompany = (companyData: Omit<Company, "id">) => {
    const newCompany = {
      ...companyData,
      id: `company-${Date.now()}`,
    };
    setCompanies([...companies, newCompany]);
  };

  return (
    <CompanyContext.Provider
      value={{
        currentCompany,
        companies,
        setCurrentCompany: handleSetCurrentCompany,
        addCompany: handleAddCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
