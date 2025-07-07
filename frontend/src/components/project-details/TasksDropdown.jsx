import { Pencil, EllipsisVertical, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteIssue,
  updateIssue,
  fetchIssueById,
} from "@/state/Issue/issueSlice";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditIssueForm } from "@/pages/IssueDetails/EditIssueForm";
import { useNavigate, useParams } from "react-router-dom";

export const TasksDropdown = ({ issueId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentIssue, setCurrentIssue] = useState(null);

  const issue = useSelector((state) =>
    state.issues?.issues?.find((i) => i.id === issueId)
  );

  useEffect(() => {
    if (isDialogOpen && !issue) {
      dispatch(fetchIssueById(issueId))
        .unwrap()
        .then((fetchedIssue) => {
          setCurrentIssue(fetchedIssue);
        })
        .catch((error) => {
          console.error("Erro ao buscar issue:", error);
        });
    } else if (issue) {
      setCurrentIssue(issue);
    }
  }, [dispatch, issueId, issue, isDialogOpen]);

  const handleDelete = () => {
    dispatch(deleteIssue(issueId));
  };

  const handleEdit = () => {
    setIsDialogOpen(true);
  };

  const handleViewDetails = () => {
    navigate(`/project/${projectId}/issue/${issueId}`);
  };

  const handleSave = (updatedIssue) => {
    const completeUpdatedIssue = {
      ...updatedIssue,
      status:
        updatedIssue.status || (currentIssue ? currentIssue.status : null),
    };

    dispatch(
      updateIssue({
        issueId,
        issueData: completeUpdatedIssue,
      })
    ).then(() => {
      dispatch(fetchIssueById(issueId));
    });
    setIsDialogOpen(false);
  };

  const menuItems = [
    {
      icon: <Eye />,
      label: "Ver Detalhes",
      className: "",
      onClick: handleViewDetails,
    },
    {
      icon: <Pencil />,
      label: "Editar Task",
      className: "",
      onClick: handleEdit,
    },
    {
      icon: <Trash2 className="text-red-500" />,
      label: "Deletar Task",
      className: "text-red-500",
      onClick: handleDelete,
    },
  ];

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {menuItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className="flex items-center gap-1 p-2.5"
              onClick={item.onClick}
            >
              {item.icon}
              <span className={`text-sm ${item.className}`}>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Task</DialogTitle>
          </DialogHeader>
          {currentIssue && (
            <EditIssueForm issue={currentIssue} onSave={handleSave} />
          )}
          {!currentIssue && isDialogOpen && (
            <div className="py-4">Carregando detalhes da issue...</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
