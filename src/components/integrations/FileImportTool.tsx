import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  FileText,
  Database,
  CheckCircle,
  AlertTriangle,
  X,
  Download,
  ArrowRight,
} from "lucide-react";

const FileImportTool = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<string>("employees");
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [mappedFields, setMappedFields] = useState<Record<string, string>>({});
  const [importStatus, setImportStatus] = useState<
    "idle" | "preview" | "mapping" | "importing" | "success" | "error"
  >("idle");
  const [importResult, setImportResult] = useState<{
    total: number;
    success: number;
    errors: number;
    errorDetails: string[];
  } | null>(null);

  // Campos disponíveis para cada tipo de importação
  const availableFields: Record<string, string[]> = {
    employees: [
      "name",
      "email",
      "phone",
      "department",
      "position",
      "salary",
      "hireDate",
      "status",
    ],
    payments: [
      "employeeId",
      "employeeName",
      "date",
      "amount",
      "type",
      "description",
      "status",
    ],
    activities: [
      "employeeId",
      "employeeName",
      "date",
      "hours",
      "rate",
      "type",
      "description",
      "status",
    ],
  };

  // Campos detectados no arquivo
  const [detectedFields, setDetectedFields] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportStatus("idle");
      setPreviewData(null);
      setMappedFields({});
      setImportResult(null);
    }
  };

  const handlePreviewFile = () => {
    if (!selectedFile) return;

    setImportStatus("preview");

    // Simular leitura do arquivo
    setTimeout(() => {
      // Dados de exemplo para preview
      let mockData: any[] = [];

      if (importType === "employees") {
        mockData = [
          {
            Nome: "João Silva",
            Email: "joao.silva@empresa.pt",
            Telefone: "+351 912 345 678",
            Departamento: "TI",
            Cargo: "Desenvolvedor",
            Salario: "2500",
            DataContratacao: "2022-03-15",
            Estado: "Ativo",
          },
          {
            Nome: "Maria Santos",
            Email: "maria.santos@empresa.pt",
            Telefone: "+351 923 456 789",
            Departamento: "Marketing",
            Cargo: "Gerente de Marketing",
            Salario: "2800",
            DataContratacao: "2021-06-10",
            Estado: "Ativo",
          },
          {
            Nome: "Pedro Costa",
            Email: "pedro.costa@empresa.pt",
            Telefone: "+351 934 567 890",
            Departamento: "Vendas",
            Cargo: "Representante de Vendas",
            Salario: "2300",
            DataContratacao: "2022-01-20",
            Estado: "Ativo",
          },
        ];
      } else if (importType === "payments") {
        mockData = [
          {
            ID_Funcionario: "1",
            Funcionario: "João Silva",
            Data: "2023-05-25",
            Valor: "2500",
            Tipo: "Salário",
            Descricao: "Salário Maio 2023",
            Estado: "Pago",
          },
          {
            ID_Funcionario: "2",
            Funcionario: "Maria Santos",
            Data: "2023-05-25",
            Valor: "2800",
            Tipo: "Salário",
            Descricao: "Salário Maio 2023",
            Estado: "Pago",
          },
          {
            ID_Funcionario: "3",
            Funcionario: "Pedro Costa",
            Data: "2023-05-25",
            Valor: "2300",
            Tipo: "Salário",
            Descricao: "Salário Maio 2023",
            Estado: "Pago",
          },
        ];
      } else if (importType === "activities") {
        mockData = [
          {
            ID_Funcionario: "1",
            Funcionario: "João Silva",
            Data: "2023-05-15",
            Horas: "3",
            Taxa: "15",
            Tipo: "Horas Extras",
            Descricao: "Projeto urgente",
            Estado: "Aprovado",
          },
          {
            ID_Funcionario: "2",
            Funcionario: "Maria Santos",
            Data: "2023-05-16",
            Horas: "2",
            Taxa: "15",
            Tipo: "Horas Extras",
            Descricao: "Reunião com cliente",
            Estado: "Aprovado",
          },
          {
            ID_Funcionario: "3",
            Funcionario: "Pedro Costa",
            Data: "2023-05-17",
            Horas: "4",
            Taxa: "15",
            Tipo: "Horas Extras",
            Descricao: "Preparação de proposta",
            Estado: "Pendente",
          },
        ];
      }

      setPreviewData(mockData);
      // Detectar campos do arquivo
      if (mockData.length > 0) {
        setDetectedFields(Object.keys(mockData[0]));
      }

      setImportStatus("mapping");
    }, 1000);
  };

  const handleFieldMapping = (detectedField: string, systemField: string) => {
    setMappedFields({
      ...mappedFields,
      [detectedField]: systemField,
    });
  };

  const handleImport = () => {
    setImportStatus("importing");

    // Simular importação
    setTimeout(() => {
      // Simular resultado com alguns erros
      const success = Math.floor(Math.random() * 2) === 0; // 50% chance de sucesso

      if (success) {
        setImportResult({
          total: previewData?.length || 0,
          success: (previewData?.length || 0) - 1,
          errors: 1,
          errorDetails: [
            "Linha 3: Formato de data inválido em 'DataContratacao'",
          ],
        });
        setImportStatus("success");
      } else {
        setImportResult({
          total: previewData?.length || 0,
          success: 0,
          errors: previewData?.length || 0,
          errorDetails: [
            "Erro de conexão com o servidor",
            "Verifique sua conexão e tente novamente",
          ],
        });
        setImportStatus("error");
      }
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    // Em uma aplicação real, isso geraria um arquivo CSV ou Excel
    alert(`Template para ${importType} será baixado`);
  };

  const resetImport = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setMappedFields({});
    setImportStatus("idle");
    setImportResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Upload de Arquivo</h3>
          <p className="text-sm text-gray-500">
            Importe dados de funcionários, pagamentos ou atividades
          </p>
        </div>
        <Button variant="outline" onClick={handleDownloadTemplate}>
          <Download className="mr-2 h-4 w-4" />
          Baixar Template
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="import-type">Tipo de Importação</Label>
            <Select value={importType} onValueChange={setImportType}>
              <SelectTrigger id="import-type">
                <SelectValue placeholder="Selecione o tipo de dados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employees">Funcionários</SelectItem>
                <SelectItem value="payments">Pagamentos</SelectItem>
                <SelectItem value="activities">Atividades</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Arquivo</Label>
            <div className="flex gap-2">
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button onClick={handlePreviewFile} disabled={!selectedFile}>
                <FileText className="mr-2 h-4 w-4" />
                Visualizar
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Formatos aceitos: CSV, Excel (.xlsx, .xls)
            </p>
          </div>
        </div>

        {importStatus === "preview" && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Analisando arquivo...</span>
          </div>
        )}

        {importStatus === "mapping" && previewData && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Mapeamento de Campos</h3>
            <p className="text-sm text-gray-500">
              Associe os campos do seu arquivo aos campos do sistema
            </p>

            <div className="border rounded-md p-4 space-y-3">
              {detectedFields.map((field) => (
                <div
                  key={field}
                  className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center"
                >
                  <div>
                    <Label className="text-sm font-medium">
                      Campo no Arquivo
                    </Label>
                    <p className="text-sm">{field}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <Select
                      value={mappedFields[field] || ""}
                      onValueChange={(value) =>
                        handleFieldMapping(field, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o campo correspondente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Ignorar este campo</SelectItem>
                        {availableFields[importType].map((sysField) => (
                          <SelectItem key={sysField} value={sysField}>
                            {sysField}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>

            <div className="border rounded-md">
              <div className="p-3 bg-gray-50 border-b">
                <h4 className="font-medium">Pré-visualização dos Dados</h4>
              </div>
              <div className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {detectedFields.map((field) => (
                        <TableHead key={field}>{field}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.slice(0, 3).map((row, index) => (
                      <TableRow key={index}>
                        {detectedFields.map((field) => (
                          <TableCell key={field}>{row[field] || ""}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {previewData.length > 3 && (
                <div className="p-2 text-center text-sm text-gray-500">
                  Mostrando 3 de {previewData.length} registros
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetImport}>
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
              <Button
                onClick={handleImport}
                disabled={
                  Object.keys(mappedFields).length === 0 ||
                  importStatus === "importing"
                }
              >
                <Database className="mr-2 h-4 w-4" /> Importar Dados
              </Button>
            </div>
          </div>
        )}

        {importStatus === "importing" && (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
            <span className="text-lg font-medium">Importando dados...</span>
            <p className="text-sm text-gray-500 mt-2">
              Isso pode levar alguns instantes
            </p>
          </div>
        )}

        {(importStatus === "success" || importStatus === "error") &&
          importResult && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-md ${importStatus === "success" ? "bg-green-50" : "bg-red-50"}`}
              >
                <div className="flex items-start">
                  {importStatus === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-medium">
                      {importStatus === "success"
                        ? "Importação concluída com avisos"
                        : "Erro na importação"}
                    </h3>
                    <p className="text-sm mt-1">
                      {importStatus === "success"
                        ? `${importResult.success} de ${importResult.total} registros foram importados com sucesso.`
                        : "Não foi possível importar os dados. Verifique os erros abaixo."}
                    </p>
                  </div>
                </div>
              </div>

              {importResult.errors > 0 && (
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">
                    Detalhes dos Erros ({importResult.errors})
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {importResult.errorDetails.map((error, index) => (
                      <li key={index} className="text-red-600 flex items-start">
                        <span className="mr-2">•</span> {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetImport}>
                  <X className="mr-2 h-4 w-4" /> Fechar
                </Button>
                {importStatus === "success" && (
                  <Button>
                    <CheckCircle className="mr-2 h-4 w-4" /> Concluir
                  </Button>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default FileImportTool;
