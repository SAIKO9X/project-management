import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { assignRole } from "@/state/Roles/projectRolesSlice";
import { UserAvatar } from "./UserAvatar";
import { fetchProjectById } from "@/state/Project/projectSlice";

export const RoleManagement = ({ projectId }) => {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.selectedProject);
  const user = useSelector((state) => state.auth.user);
  const { loading, error } = useSelector((state) => state.projectRoles);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("MEMBER");

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }
  }, [dispatch, projectId]);

  if (!project || project.id !== parseInt(projectId)) {
    return <div>Carregando detalhes do projeto...</div>;
  }

  if (!user || project.owner.id !== user.id) {
    return (
      <div>Você não tem permissão para gerenciar roles neste projeto.</div>
    );
  }

  const handleAssignRole = async () => {
    if (selectedUser) {
      try {
        await dispatch(
          assignRole({ projectId, userId: selectedUser.id, role: selectedRole })
        ).unwrap();

        dispatch(getProjectById(projectId));

        setSelectedUser(null);
        setSelectedRole("MEMBER");
      } catch (error) {
        console.error("Erro ao atribuir role:", error);
      }
    }
  };

  const availableUsers = project.team.filter(
    (teamUser) =>
      !project.roles.some((role) => role.user && role.user.id === teamUser.id)
  );

  console.log("Project roles:", project.roles);
  console.log("Available users:", availableUsers);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-semibold">Membros com Roles:</h3>
        {project.roles.length === 0 ? (
          <p className="text-gray-500">Nenhum role atribuído ainda.</p>
        ) : (
          project.roles.map((role) => (
            <div
              key={role.id}
              className="flex items-center gap-2 p-2 border rounded"
            >
              {role.user ? (
                <>
                  <UserAvatar user={role.user} />
                  <span>
                    {role.user.fullName} - {role.role}
                  </span>
                </>
              ) : (
                <span className="text-orange-600">
                  Cargo sem usuário associado - {role.role}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {error && (
        <div className="text-red-500 p-2 border border-red-300 rounded">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="font-semibold">Atribuir Novo Role:</h3>
        <div className="flex gap-2">
          <Select
            value={selectedUser?.id?.toString() || ""}
            onValueChange={(value) =>
              setSelectedUser(
                project.team.find((u) => u.id === parseInt(value))
              )
            }
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecione um usuário" />
            </SelectTrigger>
            <SelectContent>
              {availableUsers.length === 0 ? (
                <SelectItem value="no-users" disabled>
                  Todos os usuários já têm roles
                </SelectItem>
              ) : (
                availableUsers.map((teamUser) => (
                  <SelectItem key={teamUser.id} value={teamUser.id.toString()}>
                    {teamUser.fullName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OWNER">Owner</SelectItem>
              <SelectItem value="ADMINISTRATOR">Administrator</SelectItem>
              <SelectItem value="MEMBER">Member</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleAssignRole}
            disabled={loading || !selectedUser || availableUsers.length === 0}
          >
            {loading ? "Atribuindo..." : "Atribuir"}
          </Button>
        </div>
      </div>
    </div>
  );
};
