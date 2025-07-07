import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/state/Auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Lock, User, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const EditProfileForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const profileForm = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      profilePicture: null,
    },
  });

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = (data) => {
    const { fullName, profilePicture } = data;
    dispatch(updateProfile({ fullName, profilePicture })).then((result) => {
      if (result.meta.requestStatus === "fulfilled" && onClose) onClose();
      if (result.meta.requestStatus === "rejected") {
        profileForm.setError("root", { message: result.payload });
      }
    });
  };

  const onPasswordSubmit = (data) => {
    const { currentPassword, newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      passwordForm.setError("confirmPassword", {
        type: "manual",
        message: "As senhas não coincidem",
      });
      return;
    }

    dispatch(updateProfile({ currentPassword, newPassword })).then((result) => {
      if (result.meta.requestStatus === "fulfilled" && onClose) onClose();
      if (result.meta.requestStatus === "rejected") {
        passwordForm.setError("root", { message: result.payload });
      }
    });
  };

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">Perfil</TabsTrigger>
        <TabsTrigger value="password">Senha</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-4"
          >
            <FormField
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Digite seu nome completo"
                      icon={<User className="h-5 w-5 text-gray-500" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="profilePicture"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Foto de Perfil</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => onChange(e.target.files[0])}
                      {...rest}
                      accept="image/*"
                      icon={<Image className="h-5 w-5 text-gray-500" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && profileForm.formState.errors.root && (
              <p className="text-red-500">
                {profileForm.formState.errors.root.message}
              </p>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Perfil"}
            </Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="password">
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <FormField
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha Atual</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Digite sua senha atual"
                      icon={<Lock className="h-5 w-5 text-gray-500" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Digite sua nova senha"
                      icon={<Lock className="h-5 w-5 text-gray-500" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Nova Senha</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirme sua nova senha"
                      icon={<Lock className="h-5 w-5 text-gray-500" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && passwordForm.formState.errors.root && (
              <p className="text-red-500">
                {passwordForm.formState.errors.root.message}
              </p>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Alterar Senha"}
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};
