import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  fetchMilestones,
  createMilestone,
  deleteMilestone,
} from "@/state/Milestone/milestoneSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const MilestoneManagement = () => {
  const dispatch = useDispatch();
  const { id: projectId } = useParams();
  const { milestones, loading } = useSelector((state) => state.milestone);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [status, setStatus] = useState("PLANEJADO");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchMilestones(projectId));
    }
  }, [dispatch, projectId]);

  const handleCreateMilestone = async () => {
    if (!name.trim()) return;

    const milestoneData = {
      name,
      description,
      startDate: new Date().toISOString().split("T")[0],
      endDate: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      status,
      projectId: Number(projectId),
    };

    await dispatch(createMilestone(milestoneData)).unwrap();
    setName("");
    setDescription("");
    setDueDate(null);
    setStatus("PLANEJADO");
    setIsDialogOpen(false);
  };

  const handleDeleteMilestone = async (id) => {
    await dispatch(deleteMilestone(id)).unwrap();
  };

  const formatDate = (date) => {
    if (!date) return "Sem data definida";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gerenciar Sprints</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Nova Sprint
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Criar Nova Milestone
              </DialogTitle>
              <Separator className="my-4" />
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Lançamento da Versão 1.0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Finalizar e revisar o backend completo..."
                  className="resize-none"
                />
              </div>
              <div className="grid gap-2">
                <Label>Data de Vencimento</Label>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? (
                      format(dueDate, "PPP")
                    ) : (
                      <span>Escolha uma data</span>
                    )}
                  </Button>
                  {isCalendarOpen && (
                    <div className="absolute z-50 mt-2 bg-white rounded-md shadow-lg p-4 border">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={(date) => {
                          setDueDate(date);
                          setIsCalendarOpen(false);
                        }}
                        initialFocus
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANEJADO">Planejado</SelectItem>
                    <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                    <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreateMilestone}>Criar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-sm text-muted-foreground mb-6 max-w-2xl text-justify">
        <strong>O que é uma Sprint?</strong>
        <br />
        Sprints (ou marcos) são pontos importantes no seu projeto que ajudam a
        organizar e acompanhar o progresso. No contexto do sistema, uma sprint
        está associada a um projeto e pode conter várias (tasks). Exemplos
        incluem: “Lançamento da Versão 1.0”, “Testes Concluídos”.
      </p>

      {loading ? (
        <div className="flex justify-center py-8">Carregando milestones...</div>
      ) : milestones?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {milestones.map((milestone) => (
            <Card key={milestone.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{milestone.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteMilestone(milestone.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {milestone.description || "Sem descrição"}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(milestone.endDate)}</span>
                </div>
                <p className="text-sm mt-2">Status: {milestone.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-2">
          Nenhuma sprint encontrada. Crie uma nova para começar!
        </div>
      )}
    </div>
  );
};
