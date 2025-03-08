import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerWithPresets } from "@/components/calendar/DatePickerWithPresets";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  CheckCircle,
  Clock,
  Ban,
  Plus,
  Save,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmployeeTask {
  id: string;
  type: string;
  description: string;
  date: Date;
  hours: number;
  rate: number;
  status: "pending" | "approved" | "rejected" | "paid";
  paymentId?: string;
}

interface EmployeeTimelineViewProps {
  employeeId?: string;
}

export default function EmployeeTimelineView({
  employeeId,
}: EmployeeTimelineViewProps) {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  // Sincronizar com o mês selecionado no perfil
  useEffect(() => {
    const handleSelectedMonthChange = () => {
      const storedMonth = localStorage.getItem("selectedMonth");
      if (storedMonth) {
        setSelectedMonth(new Date(storedMonth));
      }
    };

    // Carregar o mês inicial
    handleSelectedMonthChange();

    // Escutar por mudanças
    window.addEventListener("selectedMonthChanged", handleSelectedMonthChange);

    return () => {
      window.removeEventListener(
        "selectedMonthChanged",
        handleSelectedMonthChange,
      );
    };
  }, []);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState<
    Omit<EmployeeTask, "id" | "status"> & { hours: any; rate: any }
  >({
    type: "Horas Extras",
    description: "",
    date: new Date(),
    hours: "",
    rate: "",
  });

  // Carregar tarefas do localStorage
  const loadTasksFromStorage = () => {
    try {
      const storedTasks = localStorage.getItem("employeeTasks");
      if (storedTasks) {
        return JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          date: new Date(task.date),
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
    return [
      {
        id: "task-1",
        type: "Horas Extras",
        description: "Trabalho adicional no projeto X",
        date: new Date(2023, 4, 15),
        hours: 3,
        rate: 15,
        status: "paid",
      },
      {
        id: "task-2",
        type: "Trabalho Fim de Semana",
        description: "Suporte ao cliente no fim de semana",
        date: new Date(2023, 4, 20),
        hours: 6,
        rate: 20,
        status: "approved",
      },
      {
        id: "task-3",
        type: "Formação",
        description: "Curso de Excel avançado",
        date: new Date(2023, 4, 25),
        hours: 8,
        rate: 12,
        status: "pending",
      },
      {
        id: "task-4",
        type: "Deslocação",
        description: "Visita ao cliente em Faro",
        date: new Date(2023, 5, 2),
        hours: 4,
        rate: 10,
        status: "rejected",
      },
      {
        id: "task-5",
        type: "Horas Extras",
        description: "Preparação para lançamento do produto",
        date: new Date(2023, 5, 10),
        hours: 5,
        rate: 15,
        status: "paid",
      },
    ];
  };

  // Mock tasks data
  const [tasks, setTasks] = useState<EmployeeTask[]>(loadTasksFromStorage());

  // Filtrar tarefas pelo mês selecionado
  const filteredTasks = tasks.filter((task) => {
    // Verificar se a data da tarefa é válida
    if (
      !task.date ||
      !(task.date instanceof Date) ||
      isNaN(task.date.getTime())
    ) {
      console.warn("Tarefa com data inválida:", task);
      return false;
    }

    // Extrair mês e ano da tarefa e do mês selecionado
    const taskMonth = task.date.getMonth();
    const taskYear = task.date.getFullYear();
    const selectedMonthValue = selectedMonth.getMonth();
    const selectedYearValue = selectedMonth.getFullYear();

    // Comparar mês e ano
    return taskMonth === selectedMonthValue && taskYear === selectedYearValue;
  });

  // Sort tasks by date (oldest first for chronological order)
  const sortedTasks = [...filteredTasks].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" /> Pendente
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Aprovado
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
          >
            <Ban className="h-3 w-3" /> Rejeitado
          </Badge>
        );
      case "paid":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Pago
          </Badge>
        );
      default:
        return null;
    }
  };

  // Salvar tarefas no localStorage
  const saveTasksToStorage = (updatedTasks: EmployeeTask[]) => {
    try {
      localStorage.setItem("employeeTasks", JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Erro ao salvar tarefas:", error);
    }
  };

  const handleAddTask = () => {
    try {
      let updatedTasks: EmployeeTask[];

      if (editingTask) {
        // Editing existing task
        updatedTasks = tasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...newTask, status: task.status }
            : task,
        );
        setTasks(updatedTasks);
        setEditingTask(null);
        console.log("Tarefa atualizada com sucesso!", updatedTasks);
      } else {
        // Adding new task
        const newTaskObj: EmployeeTask = {
          id: `task-${Date.now()}`,
          ...newTask,
          status: "pending",
        };
        updatedTasks = [...tasks, newTaskObj];
        setTasks(updatedTasks);
        console.log("Nova tarefa adicionada:", newTaskObj);
        console.log("Lista atualizada de tarefas:", updatedTasks);
      }

      // Salvar no localStorage para persistência
      saveTasksToStorage(updatedTasks);

      // Fechar o formulário e resetar os campos
      setShowTaskForm(false);
      setNewTask({
        type: "Horas Extras",
        description: "",
        date: new Date(),
        hours: "",
        rate: "",
      });

      // Mostrar alerta de sucesso
      alert(
        editingTask
          ? "Tarefa atualizada com sucesso!"
          : "Tarefa adicionada com sucesso!",
      );
    } catch (error) {
      console.error("Erro ao adicionar/atualizar tarefa:", error);
      alert(
        "Erro ao adicionar/atualizar tarefa. Verifique o console para mais detalhes.",
      );
    }
  };

  const handleEditTask = (task: EmployeeTask) => {
    try {
      setEditingTask(task);
      setNewTask({
        type: task.type,
        description: task.description,
        date: task.date,
        hours: task.hours,
        rate: task.rate,
      });
      setShowTaskForm(true);
      console.log("Editando tarefa:", task);
    } catch (error) {
      console.error("Erro ao editar tarefa:", error);
      alert("Erro ao editar tarefa. Verifique o console para mais detalhes.");
    }
  };

  const handleApproveTask = (taskId: string) => {
    try {
      // Atualizar o status da tarefa para aprovado
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status: "approved" } : task,
      );
      setTasks(updatedTasks);

      // Salvar no localStorage para persistência
      saveTasksToStorage(updatedTasks);

      // Obter a tarefa aprovada
      const approvedTask = updatedTasks.find((task) => task.id === taskId);

      if (approvedTask) {
        // Salvar a tarefa aprovada no localStorage para que o componente de pagamentos possa acessá-la
        const existingTasks = localStorage.getItem("approvedTasks");
        let approvedTasks = [];

        if (existingTasks) {
          try {
            approvedTasks = JSON.parse(existingTasks);
          } catch (e) {
            console.error("Erro ao analisar tarefas aprovadas:", e);
            approvedTasks = [];
          }
        }

        // Adicionar a nova tarefa aprovada
        approvedTasks.push({
          id: approvedTask.id,
          employeeId: employeeId || "unknown",
          type: approvedTask.type,
          description: approvedTask.description,
          date: approvedTask.date,
          hours: approvedTask.hours,
          rate: approvedTask.rate,
          status: "approved",
        });

        // Salvar no localStorage
        localStorage.setItem("approvedTasks", JSON.stringify(approvedTasks));

        // Disparar evento para notificar outros componentes
        window.dispatchEvent(new Event("approvedTasksUpdated"));

        console.log(
          "Tarefa aprovada e disponibilizada para pagamento:",
          approvedTask,
        );
      }

      alert("Tarefa aprovada com sucesso!");
    } catch (error) {
      console.error("Erro ao aprovar tarefa:", error);
      alert("Erro ao aprovar tarefa. Verifique o console para mais detalhes.");
    }
  };

  const handleRejectTask = (taskId: string) => {
    try {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status: "rejected" } : task,
      );
      setTasks(updatedTasks);

      // Salvar no localStorage para persistência
      saveTasksToStorage(updatedTasks);

      console.log("Tarefa rejeitada com sucesso!");
    } catch (error) {
      console.error("Erro ao rejeitar tarefa:", error);
      alert("Erro ao rejeitar tarefa. Verifique o console para mais detalhes.");
    }
  };

  const handleDeleteTask = (taskId: string) => {
    try {
      if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);

        // Salvar no localStorage para persistência
        saveTasksToStorage(updatedTasks);

        console.log("Tarefa excluída com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert("Erro ao excluir tarefa. Verifique o console para mais detalhes.");
    }
  };

  const [editingTask, setEditingTask] = useState<EmployeeTask | null>(null);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Registro de Tarefas</CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setEditingTask(null);
              setNewTask({
                type: "Horas Extras",
                description: "",
                date: new Date(),
                hours: "",
                rate: "",
              });
              setShowTaskForm(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Nova Tarefa
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showTaskForm ? (
          <form
            className="space-y-4 mb-6 p-4 border rounded-md bg-gray-50"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTask();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Tarefa</Label>
                <Select
                  value={newTask.type}
                  onValueChange={(value) =>
                    setNewTask({ ...newTask, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Carregar tipos de atividades das configurações do sistema */}
                    {(() => {
                      // Tentar carregar tipos de atividades do localStorage
                      try {
                        const storedTypes =
                          localStorage.getItem("activityTypes");
                        if (storedTypes) {
                          const types = JSON.parse(storedTypes);
                          if (types && types.length > 0) {
                            return types.map((type: any) => (
                              <SelectItem key={type.id} value={type.name}>
                                {type.name}
                              </SelectItem>
                            ));
                          }
                        }
                      } catch (error) {
                        console.error(
                          "Erro ao carregar tipos de atividades:",
                          error,
                        );
                      }

                      // Tipos padrão caso não haja configurações
                      return (
                        <>
                          <SelectItem value="Horas Extras">
                            Horas Extras
                          </SelectItem>
                          <SelectItem value="Trabalho Fim de Semana">
                            Trabalho Fim de Semana
                          </SelectItem>
                          <SelectItem value="Formação">Formação</SelectItem>
                          <SelectItem value="Deslocação">Deslocação</SelectItem>
                          <SelectItem value="Trabalho em Feriado">
                            Trabalho em Feriado
                          </SelectItem>
                        </>
                      );
                    })()}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <DatePickerWithPresets
                  date={newTask.date}
                  onDateChange={(date) =>
                    date && setNewTask({ ...newTask, date })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours">Horas</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={newTask.hours}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      hours: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Taxa (€/h)</Label>
                <Input
                  id="rate"
                  type="number"
                  min="0"
                  step="0.5"
                  value={newTask.rate}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      rate: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      description: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowTaskForm(false)}
              >
                <X className="h-4 w-4 mr-2" /> Cancelar
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />{" "}
                {editingTask ? "Salvar Alterações" : "Adicionar Tarefa"}
              </Button>
            </div>
          </form>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="font-medium">Nenhuma tarefa encontrada</p>
            <p className="text-sm mt-1">
              Não há tarefas registradas no período selecionado
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-3 px-4 text-left font-medium">Data</th>
                    <th className="py-3 px-4 text-left font-medium">Tipo</th>
                    <th className="py-3 px-4 text-left font-medium">
                      Descrição
                    </th>
                    <th className="py-3 px-4 text-left font-medium">Horas</th>
                    <th className="py-3 px-4 text-left font-medium">Taxa</th>
                    <th className="py-3 px-4 text-left font-medium">Valor</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-left font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {format(task.date, "dd/MM/yyyy", { locale: pt })}
                      </td>
                      <td className="py-3 px-4">{task.type}</td>
                      <td className="py-3 px-4">{task.description}</td>
                      <td className="py-3 px-4">{task.hours}</td>
                      <td className="py-3 px-4">{task.rate}€/h</td>
                      <td className="py-3 px-4 font-medium">
                        {(task.hours * task.rate).toFixed(2)}€
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(task.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {task.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => handleApproveTask(task.id)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" /> Aprovar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleRejectTask(task.id)}
                              >
                                <Ban className="h-3 w-3 mr-1" /> Rejeitar
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handleEditTask(task)}
                            disabled={task.status === "paid"}
                          >
                            <Edit className="h-3 w-3 mr-1" /> Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeleteTask(task.id)}
                            disabled={task.status === "paid"}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
