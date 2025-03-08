import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Save, Upload, X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CompanyData {
  name: string;
  nif: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  fiscalYear: {
    start: Date;
    end: Date;
  };
  bankAccount: string;
  notes: string;
}

const CompanySettings = () => {
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "Empresa Exemplo, Lda.",
    nif: "123456789",
    address: "Rua Principal, 123",
    postalCode: "1000-100",
    city: "Lisboa",
    country: "Portugal",
    phone: "+351 210 123 456",
    email: "info@empresa-exemplo.pt",
    website: "www.empresa-exemplo.pt",
    logo: "",
    fiscalYear: {
      start: new Date(new Date().getFullYear(), 0, 1), // January 1st
      end: new Date(new Date().getFullYear(), 11, 31), // December 31st
    },
    bankAccount: "PT50 1234 5678 9012 3456 7890 1",
    notes: "Notas sobre a empresa",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
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
          <h2 className="text-2xl font-bold">Configurações da Empresa</h2>
          <p className="text-gray-500">
            Gerencie as informações básicas da sua empresa
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input
                    id="name"
                    name="name"
                    value={companyData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nif">NIF</Label>
                  <Input
                    id="nif"
                    name="nif"
                    value={companyData.nif}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Morada</Label>
                <Input
                  id="address"
                  name="address"
                  value={companyData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={companyData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    name="city"
                    value={companyData.city}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    name="country"
                    value={companyData.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={companyData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={companyData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={companyData.website}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccount">IBAN</Label>
                <Input
                  id="bankAccount"
                  name="bankAccount"
                  value={companyData.bankAccount}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ano Fiscal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(companyData.fiscalYear.start, "PPP", {
                          locale: pt,
                        })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={companyData.fiscalYear.start}
                        onSelect={(date) =>
                          date &&
                          setCompanyData({
                            ...companyData,
                            fiscalYear: {
                              ...companyData.fiscalYear,
                              start: date,
                            },
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Data de Fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(companyData.fiscalYear.end, "PPP", {
                          locale: pt,
                        })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={companyData.fiscalYear.end}
                        onSelect={(date) =>
                          date &&
                          setCompanyData({
                            ...companyData,
                            fiscalYear: {
                              ...companyData.fiscalYear,
                              end: date,
                            },
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notas Adicionais</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="notes"
                name="notes"
                value={companyData.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Informações adicionais sobre a empresa"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center p-6 border-2 border-dashed rounded-md">
                {companyData.logo ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={companyData.logo}
                      alt="Logo da empresa"
                      className="max-h-40 object-contain"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Alterar Logo
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">Nenhum logo carregado</p>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Normalmente aqui você faria upload para um servidor
                          // Para demonstração, vamos usar URL.createObjectURL
                          const logoUrl = URL.createObjectURL(file);
                          setCompanyData({ ...companyData, logo: logoUrl });
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById("logo-upload")?.click()
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Carregar Logo
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Formatos aceites: PNG, JPG ou SVG. Tamanho máximo: 2MB.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feriados e Dias Especiais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Feriados Nacionais</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Feriados Nacionais</DialogTitle>
                        <DialogDescription>
                          Configure os feriados nacionais para o ano atual.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {[
                          { date: "2023-01-01", name: "Ano Novo" },
                          { date: "2023-04-07", name: "Sexta-feira Santa" },
                          { date: "2023-04-25", name: "Dia da Liberdade" },
                          { date: "2023-05-01", name: "Dia do Trabalhador" },
                          { date: "2023-06-10", name: "Dia de Portugal" },
                          {
                            date: "2023-08-15",
                            name: "Assunção de Nossa Senhora",
                          },
                          {
                            date: "2023-10-05",
                            name: "Implantação da República",
                          },
                          {
                            date: "2023-11-01",
                            name: "Dia de Todos os Santos",
                          },
                          {
                            date: "2023-12-01",
                            name: "Restauração da Independência",
                          },
                          { date: "2023-12-08", name: "Imaculada Conceição" },
                          { date: "2023-12-25", name: "Natal" },
                        ].map((holiday, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 border rounded-md"
                          >
                            <div>
                              <p className="font-medium">{holiday.name}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(holiday.date).toLocaleDateString(
                                  "pt-PT",
                                )}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <DialogFooter>
                        <Button>Salvar Alterações</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-sm text-gray-500">
                  Feriados nacionais portugueses são aplicados automaticamente.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Feriados Municipais</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Adicionar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Feriado Municipal</DialogTitle>
                        <DialogDescription>
                          Adicione feriados específicos da sua localidade.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="holiday-name">Nome do Feriado</Label>
                          <Input
                            id="holiday-name"
                            placeholder="Ex: Santo António"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="holiday-date">Data</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Selecione uma data
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="holiday-location">Localidade</Label>
                          <Input
                            id="holiday-location"
                            placeholder="Ex: Lisboa"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button>Adicionar Feriado</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-sm text-gray-500">
                  Adicione feriados municipais específicos da sua localidade.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Dias Especiais da Empresa</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Adicionar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Dia Especial</DialogTitle>
                        <DialogDescription>
                          Defina dias especiais como aniversário da empresa,
                          eventos corporativos, etc.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="special-day-name">
                            Nome do Evento
                          </Label>
                          <Input
                            id="special-day-name"
                            placeholder="Ex: Aniversário da Empresa"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="special-day-date">Data</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Selecione uma data
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="special-day-description">
                            Descrição
                          </Label>
                          <Textarea
                            id="special-day-description"
                            placeholder="Descrição do evento"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button>Adicionar Evento</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-sm text-gray-500">
                  Defina dias especiais como aniversário da empresa, eventos
                  corporativos, etc.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
