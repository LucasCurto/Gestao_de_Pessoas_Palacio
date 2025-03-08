import React, { useState } from "react";
import { useCompany } from "@/context/CompanyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileSpreadsheet,
  FileJson,
  FileCode,
  Upload,
  Check,
  AlertCircle,
  X,
  Download,
  Save,
  Play,
  Database,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

const FileImportTool: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFileType, setSelectedFileType] = useState("csv");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [mappingFields, setMappingFields] = useState<Record<string, string>>(
    {},
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingResult, setProcessingResult] = useState<{
    success: number;
    errors: number;
    warnings: number;
  } | null>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [useRealData, setUseRealData] = useState(false);
  const [isDataMasked, setIsDataMasked] = useState(true);

  // Campos disponíveis no sistema para mapeamento
  const systemFields = [
    { id: "name", label: "Nome" },
    { id: "email", label: "Email" },
    { id: "department", label: "Departamento" },
    { id: "position", label: "Cargo" },
    { id: "salary", label: "Salário" },
    { id: "hire_date", label: "Data de Contratação" },
    { id: "employee_id", label: "ID do Funcionário" },
    { id: "manager", label: "Gestor" },
    { id: "status", label: "Status" },
    { id: "phone", label: "Telefone" },
    { id: "address", label: "Endereço" },
    { id: "city", label: "Cidade" },
    { id: "country", label: "País" },
    { id: "postal_code", label: "Código Postal" },
    { id: "birth_date", label: "Data de Nascimento" },
    { id: "gender", label: "Género" },
    { id: "tax_id", label: "NIF" },
    { id: "social_security", label: "Número de Segurança Social" },
  ];

  // Dados de exemplo para CSV
  const sampleCsvData = [
    {
      Nome: "Ana Silva",
      Email: "ana.silva@exemplo.pt",
      Departamento: "Recursos Humanos",
      Cargo: "Gerente de RH",
      Salário: "2500",
      "Data de Contratação": "15/03/2020",
    },
    {
      Nome: "João Santos",
      Email: "joao.santos@exemplo.pt",
      Departamento: "Financeiro",
      Cargo: "Analista Financeiro",
      Salário: "2200",
      "Data de Contratação": "10/05/2021",
    },
    {
      Nome: "Maria Costa",
      Email: "maria.costa@exemplo.pt",
      Departamento: "Tecnologia",
      Cargo: "Desenvolvedora",
      Salário: "2300",
      "Data de Contratação": "20/01/2022",
    },
    {
      Nome: "Pedro Oliveira",
      Email: "pedro.oliveira@exemplo.pt",
      Departamento: "Vendas",
      Cargo: "Gerente de Vendas",
      Salário: "2800",
      "Data de Contratação": "05/11/2019",
    },
    {
      Nome: "Sofia Martins",
      Email: "sofia.martins@exemplo.pt",
      Departamento: "Marketing",
      Cargo: "Especialista em Marketing",
      Salário: "2200",
      "Data de Contratação": "15/07/2020",
    },
  ];

  // Dados reais (simulados)
  const realData = [
    {
      Nome: "António Ferreira",
      Email: "antonio.ferreira@empresa.pt",
      Departamento: "Direção",
      Cargo: "Diretor Geral",
      Salário: "5500",
      "Data de Contratação": "01/01/2015",
    },
    {
      Nome: "Margarida Sousa",
      Email: "margarida.sousa@empresa.pt",
      Departamento: "Recursos Humanos",
      Cargo: "Diretora de RH",
      Salário: "4200",
      "Data de Contratação": "15/03/2016",
    },
    {
      Nome: "Ricardo Almeida",
      Email: "ricardo.almeida@empresa.pt",
      Departamento: "Financeiro",
      Cargo: "Diretor Financeiro",
      Salário: "4500",
      "Data de Contratação": "10/05/2016",
    },
    {
      Nome: "Catarina Lopes",
      Email: "catarina.lopes@empresa.pt",
      Departamento: "Tecnologia",
      Cargo: "CTO",
      Salário: "4800",
      "Data de Contratação": "20/01/2017",
    },
    {
      Nome: "Miguel Santos",
      Email: "miguel.santos@empresa.pt",
      Departamento: "Vendas",
      Cargo: "Diretor Comercial",
      Salário: "4300",
      "Data de Contratação": "05/11/2016",
    },
    {
      Nome: "Inês Costa",
      Email: "ines.costa@empresa.pt",
      Departamento: "Marketing",
      Cargo: "Diretora de Marketing",
      Salário: "4100",
      "Data de Contratação": "15/07/2017",
    },
    {
      Nome: "Tiago Mendes",
      Email: "tiago.mendes@empresa.pt",
      Departamento: "Operações",
      Cargo: "Diretor de Operações",
      Salário: "4400",
      "Data de Contratação": "01/03/2017",
    },
    {
      Nome: "Joana Ribeiro",
      Email: "joana.ribeiro@empresa.pt",
      Departamento: "Recursos Humanos",
      Cargo: "Técnica de RH",
      Salário: "1800",
      "Data de Contratação": "10/01/2019",
    },
    {
      Nome: "Rui Pereira",
      Email: "rui.pereira@empresa.pt",
      Departamento: "Financeiro",
      Cargo: "Contabilista",
      Salário: "2100",
      "Data de Contratação": "15/04/2019",
    },
    {
      Nome: "Marta Silva",
      Email: "marta.silva@empresa.pt",
      Departamento: "Tecnologia",
      Cargo: "Desenvolvedora Sénior",
      Salário: "2600",
      "Data de Contratação": "20/06/2018",
    },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      // Simular leitura do arquivo
      setIsUploading(true);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);

            // Após o upload, definir os dados de visualização
            const data = useRealData ? realData : sampleCsvData;
            setPreviewData(data);

            // Configurar mapeamento inicial
            const initialMapping: Record<string, string> = {};
            if (data.length > 0) {
              Object.keys(data[0]).forEach((fileField) => {
                // Tentar encontrar um campo correspondente no sistema
                const matchingSystemField = systemFields.find(
                  (sf) =>
                    sf.label.toLowerCase() === fileField.toLowerCase() ||
                    sf.id.toLowerCase() ===
                      fileField.toLowerCase().replace(/ /g, "_"),
                );

                if (matchingSystemField) {
                  initialMapping[fileField] = matchingSystemField.id;
                } else {
                  initialMapping[fileField] = "";
                }
              });
            }
            setMappingFields(initialMapping);

            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleProcessData = () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setActiveTab("processing");

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessingResult({
            success: useRealData ? 10 : 5,
            errors: useRealData ? 0 : 0,
            warnings: useRealData ? 0 : 0,
          });
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const resetImport = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setMappingFields({});
    setIsProcessing(false);
    setProcessingProgress(0);
    setProcessingResult(null);
    setActiveTab("upload");
  };

  const handleMappingChange = (fileField: string, systemField: string) => {
    setMappingFields((prev) => ({
      ...prev,
      [fileField]: systemField,
    }));
  };

  const toggleDataSource = () => {
    setUseRealData(!useRealData);

    // Atualizar os dados de visualização com base na nova fonte
    const data = !useRealData ? realData : sampleCsvData;
    setPreviewData(data);
  };

  const toggleDataMasking = () => {
    setIsDataMasked(!isDataMasked);
  };

  const maskValue = (value: string, type: string) => {
    if (!isDataMasked) return value;

    if (type === "salary") {
      return value.replace(/\d/g, "*");
    } else if (type === "email") {
      const [name, domain] = value.split("@");
      return `${name.charAt(0)}${"*".repeat(name.length - 2)}${name.charAt(name.length - 1)}@${domain}`;
    } else if (type === "name") {
      const parts = value.split(" ");
      return parts
        .map(
          (part) =>
            `${part.charAt(0)}${"*".repeat(part.length - 2)}${part.charAt(part.length - 1)}`,
        )
        .join(" ");
    }
    return value;
  };

  const getFileTypeIcon = () => {
    switch (selectedFileType) {
      case "csv":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case "json":
        return <FileJson className="h-5 w-5 text-amber-500" />;
      case "xml":
        return <FileCode className="h-5 w-5 text-blue-500" />;
      default:
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Importação de Dados</h2>
          <p className="text-gray-500">
            Importe dados de arquivos CSV, JSON ou XML para o sistema
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="use-real-data"
              checked={useRealData}
              onCheckedChange={toggleDataSource}
            />
            <Label htmlFor="use-real-data" className="cursor-pointer">
              Usar Dados Reais
            </Label>
          </div>

          {useRealData && (
            <div className="flex items-center space-x-2">
              <Switch
                id="mask-data"
                checked={isDataMasked}
                onCheckedChange={toggleDataMasking}
              />
              <Label
                htmlFor="mask-data"
                className="cursor-pointer flex items-center"
              >
                {isDataMasked ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Mascarar Dados
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Mostrar Dados Reais
                  </>
                )}
              </Label>
            </div>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" disabled={isProcessing}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="mapping" disabled={!previewData || isProcessing}>
            <Database className="h-4 w-4 mr-2" />
            Mapeamento
          </TabsTrigger>
          <TabsTrigger
            value="processing"
            disabled={!previewData || (!isProcessing && !processingResult)}
          >
            <Play className="h-4 w-4 mr-2" />
            Processamento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Selecionar Arquivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Arquivo</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedFileType === "csv" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setSelectedFileType("csv")}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    variant={
                      selectedFileType === "json" ? "default" : "outline"
                    }
                    className="flex-1"
                    onClick={() => setSelectedFileType("json")}
                  >
                    <FileJson className="h-4 w-4 mr-2" />
                    JSON
                  </Button>
                  <Button
                    variant={selectedFileType === "xml" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setSelectedFileType("xml")}
                  >
                    <FileCode className="h-4 w-4 mr-2" />
                    XML
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload">Arquivo</Label>
                <div className="flex gap-2">
                  <Input
                    id="file-upload"
                    type="file"
                    accept={
                      selectedFileType === "csv"
                        ? ".csv"
                        : selectedFileType === "json"
                          ? ".json"
                          : ".xml"
                    }
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setIsPreviewDialogOpen(true)}
                    disabled={!previewData}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Pré-visualizar
                  </Button>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso do Upload</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {selectedFile && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-start gap-3">
                    {getFileTypeIcon()}
                    <div className="flex-1">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    {uploadProgress === 100 && (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Carregado
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {previewData && (
                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab("mapping")}>
                    Continuar para Mapeamento
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {previewData && (
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Arquivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Tipo de Arquivo</p>
                    <p className="font-medium flex items-center">
                      {getFileTypeIcon()}
                      <span className="ml-2">
                        {selectedFileType.toUpperCase()}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      Registros Detectados
                    </p>
                    <p className="font-medium">{previewData.length}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Campos Detectados</p>
                    <p className="font-medium">
                      {previewData.length > 0
                        ? Object.keys(previewData[0]).length
                        : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mapeamento de Campos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                Associe os campos do arquivo aos campos do sistema para importar
                os dados corretamente.
              </p>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campo no Arquivo</TableHead>
                      <TableHead>Campo no Sistema</TableHead>
                      <TableHead>Exemplo de Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData &&
                      previewData.length > 0 &&
                      Object.keys(previewData[0]).map((fileField, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {fileField}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={mappingFields[fileField] || ""}
                              onValueChange={(value) =>
                                handleMappingChange(fileField, value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um campo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">
                                  Ignorar este campo
                                </SelectItem>
                                {systemFields.map((field) => (
                                  <SelectItem key={field.id} value={field.id}>
                                    {field.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {previewData[0][fileField]
                              ? fileField.toLowerCase().includes("salário") ||
                                mappingFields[fileField] === "salary"
                                ? maskValue(previewData[0][fileField], "salary")
                                : fileField.toLowerCase().includes("email") ||
                                    mappingFields[fileField] === "email"
                                  ? maskValue(
                                      previewData[0][fileField],
                                      "email",
                                    )
                                  : fileField.toLowerCase().includes("nome") ||
                                      mappingFields[fileField] === "name"
                                    ? maskValue(
                                        previewData[0][fileField],
                                        "name",
                                      )
                                    : previewData[0][fileField]
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("upload")}
                >
                  Voltar
                </Button>
                <Button onClick={handleProcessData}>
                  Processar Importação
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processamento de Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isProcessing && processingProgress < 100 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{processingProgress}%</span>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm">
                      {processingProgress < 30
                        ? "Validando dados..."
                        : processingProgress < 60
                          ? "Aplicando mapeamento..."
                          : processingProgress < 90
                            ? "Inserindo registros..."
                            : "Finalizando importação..."}
                    </p>
                  </div>
                </div>
              ) : processingResult ? (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-md flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <p className="font-medium text-green-700">
                        Importação concluída com sucesso!
                      </p>
                      <p className="text-sm text-green-600">
                        {processingResult.success} registros foram importados
                        com sucesso.
                      </p>
                    </div>
                  </div>

                  {processingResult.errors > 0 && (
                    <div className="bg-red-50 p-4 rounded-md flex items-center">
                      <X className="h-5 w-5 text-red-500 mr-2" />
                      <div>
                        <p className="font-medium text-red-700">
                          Erros na importação
                        </p>
                        <p className="text-sm text-red-600">
                          {processingResult.errors} registros não puderam ser
                          importados devido a erros.
                        </p>
                      </div>
                    </div>
                  )}

                  {processingResult.warnings > 0 && (
                    <div className="bg-yellow-50 p-4 rounded-md flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                      <div>
                        <p className="font-medium text-yellow-700">
                          Avisos na importação
                        </p>
                        <p className="text-sm text-yellow-600">
                          {processingResult.warnings} registros foram importados
                          com avisos.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white border rounded-md p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {processingResult.success}
                      </p>
                      <p className="text-sm text-gray-500">
                        Importados com Sucesso
                      </p>
                    </div>
                    <div className="bg-white border rounded-md p-4 text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {processingResult.errors}
                      </p>
                      <p className="text-sm text-gray-500">Erros</p>
                    </div>
                    <div className="bg-white border rounded-md p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-600">
                        {processingResult.warnings}
                      </p>
                      <p className="text-sm text-gray-500">Avisos</p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={resetImport}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Nova Importação
                    </Button>
                    <div className="space-x-2">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Relatório
                      </Button>
                      <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Configuração
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pré-visualização dos Dados</DialogTitle>
            <DialogDescription>
              Visualize os primeiros registros do arquivo antes de importar.
            </DialogDescription>
          </DialogHeader>

          <div className="border rounded-md overflow-hidden">
            {previewData && previewData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(previewData[0]).map((header, index) => (
                      <TableHead key={index}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.slice(0, 5).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Object.entries(row).map(([key, value], cellIndex) => (
                        <TableCell key={cellIndex}>
                          {key.toLowerCase().includes("salário") ||
                          key.toLowerCase().includes("salary")
                            ? maskValue(value as string, "salary")
                            : key.toLowerCase().includes("email")
                              ? maskValue(value as string, "email")
                              : key.toLowerCase().includes("nome") ||
                                  key.toLowerCase().includes("name")
                                ? maskValue(value as string, "name")
                                : (value as string)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>Nenhum dado disponível para visualização</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsPreviewDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileImportTool;

// Componente ArrowRight para evitar erro de importação
const ArrowRight = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
