import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createComment } from "@/state/Comment/commentsSlice";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

export const CreateCommentForm = ({ issueId }) => {
  const dispatch = useDispatch();

  const form = useForm({
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data) => {
    const issueIdNumber = parseInt(issueId, 10);
    if (isNaN(issueIdNumber)) {
      console.error("Invalid issueId:", issueId);
      return;
    }

    dispatch(createComment({ content: data.content, issueId: issueIdNumber }));
  };

  return (
    <Form {...form}>
      <form
        className="flex gap-2 items-center"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-2 items-center">
                <div>
                  <Avatar>
                    <AvatarFallback>S</AvatarFallback>
                  </Avatar>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="w-[20rem]"
                    placeholder="adicione um comentário"
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">enviar</Button>
      </form>
    </Form>
  );
};
