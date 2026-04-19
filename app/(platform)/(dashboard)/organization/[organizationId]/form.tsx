"use client";

import { createBoard } from "@/actions/create-board/index";
import { FormInput } from "@/components/form/form-input";
import FormSubmit from "@/components/form/form-submit";
import { useAction } from "@/hooks/use-action";

export default function Form() {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => console.log(data),
    onError: (error) => console.log(error),
  });
  async function onSubmit(formData: FormData) {
    const title = formData.get("title") as string;
    await execute({ title });
  }
  return (
    <form action={onSubmit}>
      <FormInput id="title" errors={fieldErrors} />
      <FormSubmit>Save</FormSubmit>
    </form>
  );
}
