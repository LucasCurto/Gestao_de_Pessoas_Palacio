import { useEffect, useState } from "react";
import { useCompany } from "@/context/CompanyContext";

// Hook genérico para filtrar dados por empresa
export function useCompanyData<T extends { companyId?: string }>(
  data: T[],
  defaultData: T[] = [],
): T[] {
  const { currentCompany } = useCompany();
  const [filteredData, setFilteredData] = useState<T[]>(defaultData);

  useEffect(() => {
    // Filtra os dados pela empresa atual ou retorna todos se não houver companyId
    const filtered = data.filter(
      (item) => !item.companyId || item.companyId === currentCompany.id,
    );
    setFilteredData(filtered);
  }, [data, currentCompany.id]);

  return filteredData;
}

// Hook para adicionar companyId aos novos dados
export function useCompanyId() {
  const { currentCompany } = useCompany();

  const addCompanyId = <T extends object>(
    data: T,
  ): T & { companyId: string } => {
    return {
      ...data,
      companyId: currentCompany.id,
    };
  };

  return { addCompanyId, companyId: currentCompany.id };
}
