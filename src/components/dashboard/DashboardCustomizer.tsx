import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  BarChart,
  PieChart,
  LineChart,
  FileText,
  Table,
  Save,
  X,
} from "lucide-react";

interface DashboardCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
  initialConfig?: any;
}

const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({
  isOpen,
  onClose,
  onSave,
  initialConfig,
}) => {
  const [config, setConfig] = useState({
    layout: "grid",
    theme: "default",
    density: "comfortable",
    refreshInterval: "0",
    ...initialConfig,
  });

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Personalizar Dashboard</DialogTitle>
          <DialogDescription>
            Configure a aparência e comportamento do seu dashboard
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="layout">Layout</Label>
            <Select
              value={config.layout}
              onValueChange={(value) => setConfig({ ...config, layout: value })}
            >
              <SelectTrigger id="layout">
                <SelectValue placeholder="Selecione o layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grade</SelectItem>
                <SelectItem value="columns">Colunas</SelectItem>
                <SelectItem value="masonry">Mosaico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="theme">Tema</Label>
            <Select
              value={config.theme}
              onValueChange={(value) => setConfig({ ...config, theme: value })}
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Selecione o tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Padrão</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="colorful">Colorido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="density">Densidade</Label>
            <Select
              value={config.density}
              onValueChange={(value) =>
                setConfig({ ...config, density: value })
              }
            >
              <SelectTrigger id="density">
                <SelectValue placeholder="Selecione a densidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compacta</SelectItem>
                <SelectItem value="comfortable">Confortável</SelectItem>
                <SelectItem value="spacious">Espaçosa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="refresh">Atualização Automática</Label>
            <Select
              value={config.refreshInterval}
              onValueChange={(value) =>
                setConfig({ ...config, refreshInterval: value })
              }
            >
              <SelectTrigger id="refresh">
                <SelectValue placeholder="Selecione o intervalo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Desativado</SelectItem>
                <SelectItem value="30">A cada 30 segundos</SelectItem>
                <SelectItem value="60">A cada minuto</SelectItem>
                <SelectItem value="300">A cada 5 minutos</SelectItem>
                <SelectItem value="600">A cada 10 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardCustomizer;
