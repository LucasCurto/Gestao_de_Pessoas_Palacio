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

interface WidgetEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (widget: any) => void;
  widget?: any;
}

const WidgetEditor: React.FC<WidgetEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  widget,
}) => {
  const [editedWidget, setEditedWidget] = useState({
    id: widget?.id || `widget-${Date.now()}`,
    title: widget?.title || "Novo Widget",
    type: widget?.type || "chart",
    chartType: widget?.chartType || "bar",
    dataSource: widget?.dataSource || "Sistema",
    className: widget?.className || "col-span-1",
    refreshInterval: widget?.refreshInterval || "0",
  });

  const handleSave = () => {
    onSave(editedWidget);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {widget ? "Editar Widget" : "Adicionar Novo Widget"}
          </DialogTitle>
          <DialogDescription>
            {widget
              ? "Modifique as configurações deste widget"
              : "Configure as propriedades do novo widget"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="widget-title">Título</Label>
            <Input
              id="widget-title"
              value={editedWidget.title}
              onChange={(e) =>
                setEditedWidget({ ...editedWidget, title: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="widget-type">Tipo de Widget</Label>
            <Select
              value={editedWidget.type}
              onValueChange={(value) =>
                setEditedWidget({ ...editedWidget, type: value })
              }
            >
              <SelectTrigger id="widget-type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chart">Gráfico</SelectItem>
                <SelectItem value="metric">Métrica</SelectItem>
                <SelectItem value="table">Tabela</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {editedWidget.type === "chart" && (
            <div className="grid gap-2">
              <Label htmlFor="chart-type">Tipo de Gráfico</Label>
              <Select
                value={editedWidget.chartType}
                onValueChange={(value) =>
                  setEditedWidget({ ...editedWidget, chartType: value })
                }
              >
                <SelectTrigger id="chart-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Barras</SelectItem>
                  <SelectItem value="line">Linha</SelectItem>
                  <SelectItem value="pie">Pizza</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="data-source">Fonte de Dados</Label>
            <Input
              id="data-source"
              value={editedWidget.dataSource}
              onChange={(e) =>
                setEditedWidget({ ...editedWidget, dataSource: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="widget-size">Tamanho</Label>
            <Select
              value={editedWidget.className}
              onValueChange={(value) =>
                setEditedWidget({ ...editedWidget, className: value })
              }
            >
              <SelectTrigger id="widget-size">
                <SelectValue placeholder="Selecione o tamanho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="col-span-1">Pequeno</SelectItem>
                <SelectItem value="col-span-1 md:col-span-2">Médio</SelectItem>
                <SelectItem value="col-span-1 md:col-span-3">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="refresh-interval">Atualização Automática</Label>
            <Select
              value={editedWidget.refreshInterval}
              onValueChange={(value) =>
                setEditedWidget({ ...editedWidget, refreshInterval: value })
              }
            >
              <SelectTrigger id="refresh-interval">
                <SelectValue placeholder="Selecione o intervalo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Desativado</SelectItem>
                <SelectItem value="30">A cada 30 segundos</SelectItem>
                <SelectItem value="60">A cada minuto</SelectItem>
                <SelectItem value="300">A cada 5 minutos</SelectItem>
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
            {widget ? "Salvar Alterações" : "Adicionar Widget"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WidgetEditor;
