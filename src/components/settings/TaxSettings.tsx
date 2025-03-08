import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Plus, Edit, Trash2, Info } from "lucide-react";

interface TaxRate {
  id: string;
  name: string;
  type: "irs" | "ss" | "iva" | "other";
  rate: number;
  description?: string;
  isDefault: boolean;
  applicableFrom: string;
  applicableTo?: string;
}

interface TaxBracket {
  id: string;
  minValue: number;
  maxValue?: number;
  rate: number;
  description?: string;
}

const mockTaxRates: TaxRate[] = [
  {
    id: "1",
    name: "IRS Taxa Normal",
    type: "irs",
    rate: 25,
    description: "Taxa normal de IRS para a maioria dos funcionários",
    isDefault: true,
    applicableFrom: "2023-01-01",
  },
  {
    id: "2",
    name: "Segurança Social - Trabalhador",
    type: "ss",
    rate: 11,
    description: "Contribuição do trabalhador para a Segurança Social",
    isDefault: true,
    applicableFrom: "2023-01-01",
  },
  {
    id: "3",
    name: "Segurança Social - Empresa",
    type: "ss",
    rate: 23.75,
    description: "Contribuição da empresa para a Segurança Social",
    isDefault: true,
    applicableFrom: "2023-01-01",
  },
  {
    id: "4",
    name: "IVA Normal",
    type: "iva",
    rate: 23,
    description: "Taxa normal de IVA",
    isDefault: true,
    applicableFrom: "2023-01-01",
  },
  {
    id: "5",
    name: "IVA Intermédio",
    type: "iva",
    rate: 13,
    description: "Taxa intermédia de IVA",
    isDefault: false,
    applicableFrom: "2023-01-01",
  },
  {
    id: "6",
    name: "IVA Reduzido",
    type: "iva",
    rate: 6,
    description: "Taxa reduzida de IVA",
    isDefault: false,
    applicableFrom: "2023-01-01",
  },
];

const mockIrsBrackets: TaxBracket[] = [
  {
    id: "irs1",
    minValue: 0,
    maxValue: 7479,
    rate: 14.5,
    description: "Primeiro escalão de IRS",
  },
  {
    id: "irs2",
    minValue: 7480,
    maxValue: 11284,
    rate: 21,
    description: "Segundo escalão de IRS",
  },
  {
    id: "irs3",
    minValue: 11285,
    maxValue: 15992,
    rate: 26.5,
    description: "Terceiro escalão de IRS",
  },
  {
    id: "irs4",
    minValue: 15993,
    maxValue: 20700,
    rate: 28.5,
    description: "Quarto escalão de IRS",
  },
  {
    id: "irs5",
    minValue: 20701,
    maxValue: 26355,
    rate: 35,
    description: "Quinto escalão de IRS",
  },
  {
    id: "irs6",
    minValue: 26356,
    maxValue: 38632,
    rate: 37,
    description: "Sexto escalão de IRS",
  },
  {
    id: "irs7",
    minValue: 38633,
    maxValue: 50483,
    rate: 43.5,
    description: "Sétimo escalão de IRS",
  },
  {
    id: "irs8",
    minValue: 50484,
    maxValue: 78834,
    rate: 45,
    description: "Oitavo escalão de IRS",
  },
  {
    id: "irs9",
    minValue: 78835,
    rate: 48,
    description: "Nono escalão de IRS",
  },
];

const TaxSettings = () => {
  const [taxRates, setTaxRates] = useState<{
    irs: any;
    ss_employee: any;
    ss_employer: any;
    vat: any;
  }>({
    irs: "",
    ss_employee: "",
    ss_employer: "",
    vat: "",
  });

  const [thresholds, setThresholds] = useState<
    Array<{
      id: string;
      min: any;
      max: number | null;
      rate: any;
    }>
  >([
    { id: "1", min: "", max: 7479, rate: "" },
    { id: "2", min: 7480, max: 11284, rate: "" },
    { id: "3", min: 11285, max: 15992, rate: "" },
    { id: "4", min: 15993, max: 20700, rate: "" },
    { id: "5", min: 20701, max: 26355, rate: "" },
    { id: "6", min: 26356, max: 38632, rate: "" },
    { id: "7", min: 38633, max: 50483, rate: "" },
    { id: "8", min: 50484, max: 78834, rate: "" },
    { id: "9", min: 78835, max: null, rate: "" },
  ]);

  const [isAddTaxRateDialogOpen, setIsAddTaxRateDialogOpen] = useState(false);
  const [isAddBracketDialogOpen, setIsAddBracketDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"rates" | "brackets">("rates");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [newTaxRate, setNewTaxRate] = useState<Omit<TaxRate, "id">>({
    name: "",
    type: "irs",
    rate: 0,
    description: "",
    isDefault: false,
    applicableFrom: new Date().toISOString().split("T")[0],
  });

  const [newThreshold, setNewThreshold] = useState<{
    min: any;
    max: any;
    rate: any;
  }>({
    min: "",
    max: "",
    rate: "",
  });

  const handleAddTaxRate = () => {
    const newTaxRateObj: TaxRate = {
      id: `tax-${Date.now()}`,
      ...newTaxRate,
    };

    setTaxRates([...taxRates, newTaxRateObj]);
    setNewTaxRate({
      name: "",
      type: "irs",
      rate: 0,
      description: "",
      isDefault: false,
      applicableFrom: new Date().toISOString().split("T")[0],
    });
    setIsAddTaxRateDialogOpen(false);
  };

  const handleAddBracket = () => {
    const newBracketObj: TaxBracket = {
      id: `bracket-${Date.now()}`,
      ...newBracket,
    };

    // Sort brackets by minValue after adding the new one
    const updatedBrackets = [...thresholds, newBracketObj].sort(
      (a, b) => a.minValue - b.minValue,
    );

    setThresholds(updatedBrackets);
    setNewThreshold({ min: "", max: "", rate: "" });
    setIsAddBracketDialogOpen(false);
  };

  const handleDeleteTaxRate = (id: string) => {
    if (confirm("Tem certeza que deseja remover esta taxa?")) {
      setTaxRates(taxRates.filter((rate) => rate.id !== id));
    }
  };

  const handleDeleteBracket = (id: string) => {
    if (confirm("Tem certeza que deseja remover este escalão?")) {
      setThresholds(thresholds.filter((bracket) => bracket.id !== id));
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Configurações Fiscais</h2>
          <p className="text-gray-500">
            Configure taxas de impostos e contribuições sociais
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "A guardar..." : "Guardar alterações"}
        </Button>
      </div>

      {saveSuccess && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md">
          Configurações guardadas com sucesso!
        </div>
      )}

      <div className="flex space-x-2">
        <Button
          variant={activeTab === "rates" ? "default" : "outline"}
          onClick={() => setActiveTab("rates")}
        >
          Taxas de Impostos
        </Button>
        <Button
          variant={activeTab === "brackets" ? "default" : "outline"}
          onClick={() => setActiveTab("brackets")}
        >
          Escalões de IRS
        </Button>
      </div>

      {activeTab === "rates" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Taxas de Impostos e Contribuições</CardTitle>
            <Button onClick={() => setIsAddTaxRateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Taxa
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Taxa (%)</TableHead>
                  <TableHead>Aplicável Desde</TableHead>
                  <TableHead>Padrão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTaxRates.map((tax) => (
                  <TableRow key={tax.id}>
                    <TableCell className="font-medium">{tax.name}</TableCell>
                    <TableCell>
                      {tax.type === "irs"
                        ? "IRS"
                        : tax.type === "ss"
                          ? "Segurança Social"
                          : tax.type === "iva"
                            ? "IVA"
                            : "Outro"}
                    </TableCell>
                    <TableCell>{tax.rate}%</TableCell>
                    <TableCell>
                      {new Date(tax.applicableFrom).toLocaleDateString("pt-PT")}
                    </TableCell>
                    <TableCell>
                      {tax.isDefault ? (
                        <span className="text-green-600">Sim</span>
                      ) : (
                        <span className="text-gray-500">Não</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                          onClick={() => handleDeleteTaxRate(tax.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "brackets" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Escalões de IRS</CardTitle>
            <Button onClick={() => setIsAddBracketDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Escalão
            </Button>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-md mb-4 flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-800 font-medium">Informação</p>
                <p className="text-sm text-blue-700">
                  Os escalões de IRS são aplicados de forma progressiva. Cada
                  escalão aplica-se apenas ao rendimento dentro desse intervalo.
                </p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Escalão</TableHead>
                  <TableHead>Rendimento Mínimo (€)</TableHead>
                  <TableHead>Rendimento Máximo (€)</TableHead>
                  <TableHead>Taxa (%)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockIrsBrackets.map((bracket, index) => (
                  <TableRow key={bracket.id}>
                    <TableCell className="font-medium">
                      {index + 1}º Escalão
                    </TableCell>
                    <TableCell>
                      {bracket.minValue.toLocaleString("pt-PT")}€
                    </TableCell>
                    <TableCell>
                      {bracket.maxValue
                        ? `${bracket.maxValue.toLocaleString("pt-PT")}€`
                        : "Sem limite"}
                    </TableCell>
                    <TableCell>{bracket.rate}%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                          onClick={() => handleDeleteBracket(bracket.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add Tax Rate Dialog */}
      <Dialog
        open={isAddTaxRateDialogOpen}
        onOpenChange={setIsAddTaxRateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Taxa</DialogTitle>
            <DialogDescription>
              Preencha os dados para adicionar uma nova taxa de imposto ou
              contribuição.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tax-name">Nome</Label>
              <Input
                id="tax-name"
                value={newTaxRate.name}
                onChange={(e) =>
                  setNewTaxRate({ ...newTaxRate, name: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tax-type">Tipo</Label>
              <Select
                value={newTaxRate.type}
                onValueChange={(value) =>
                  setNewTaxRate({
                    ...newTaxRate,
                    type: value as "irs" | "ss" | "iva" | "other",
                  })
                }
              >
                <SelectTrigger id="tax-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="irs">IRS</SelectItem>
                  <SelectItem value="ss">Segurança Social</SelectItem>
                  <SelectItem value="iva">IVA</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tax-rate">Taxa (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                step="0.01"
                value={newTaxRate.rate}
                onChange={(e) =>
                  setNewTaxRate({
                    ...newTaxRate,
                    rate: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tax-applicable-from">Aplicável Desde</Label>
              <Input
                id="tax-applicable-from"
                type="date"
                value={newTaxRate.applicableFrom}
                onChange={(e) =>
                  setNewTaxRate({
                    ...newTaxRate,
                    applicableFrom: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tax-description">Descrição</Label>
              <Textarea
                id="tax-description"
                value={newTaxRate.description}
                onChange={(e) =>
                  setNewTaxRate({
                    ...newTaxRate,
                    description: e.target.value,
                  })
                }
                placeholder="Descrição opcional"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="tax-default"
                checked={newTaxRate.isDefault}
                onCheckedChange={(checked) =>
                  setNewTaxRate({ ...newTaxRate, isDefault: checked })
                }
              />
              <Label htmlFor="tax-default">Definir como taxa padrão</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddTaxRateDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddTaxRate}
              disabled={!newTaxRate.name || newTaxRate.rate <= 0}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Bracket Dialog */}
      <Dialog
        open={isAddBracketDialogOpen}
        onOpenChange={setIsAddBracketDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Escalão de IRS</DialogTitle>
            <DialogDescription>
              Preencha os dados para adicionar um novo escalão de IRS.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bracket-min">Rendimento Mínimo (€)</Label>
              <Input
                id="bracket-min"
                type="number"
                step="0.01"
                value={newThreshold.min}
                onChange={(e) =>
                  setNewThreshold({
                    ...newThreshold,
                    min: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bracket-max">
                Rendimento Máximo (€) (deixe em branco para "sem limite")
              </Label>
              <Input
                id="bracket-max"
                type="number"
                step="0.01"
                value={newThreshold.max || ""}
                onChange={(e) =>
                  setNewThreshold({
                    ...newThreshold,
                    max: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bracket-rate">Taxa (%)</Label>
              <Input
                id="bracket-rate"
                type="number"
                step="0.01"
                value={newThreshold.rate}
                onChange={(e) =>
                  setNewThreshold({
                    ...newThreshold,
                    rate: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bracket-description">Descrição</Label>
              <Textarea
                id="bracket-description"
                value={newThreshold.description}
                onChange={(e) =>
                  setNewThreshold({
                    ...newThreshold,
                    description: e.target.value,
                  })
                }
                placeholder="Descrição opcional"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddBracketDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddBracket}
              disabled={newThreshold.min < 0 || newThreshold.rate <= 0}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaxSettings;
