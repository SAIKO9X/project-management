import { useForm } from "react-hook-form";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormMessage,
  FormControl,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { inviteToProject } from "@/state/Project/projectSlice";

export const InviteUserForm = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(inviteToProject({ email: data.email, projectId: id }));
    console.log(data);
  };

  return (
    <>
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="border w-full border-gray-700 py-5 px-5"
                    placeholder="email do parceiro"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogClose>
            <Button type="submit" className="w-full">
              Convidar Parceiro
            </Button>
          </DialogClose>
        </form>
      </Form>
    </>
  );
};
