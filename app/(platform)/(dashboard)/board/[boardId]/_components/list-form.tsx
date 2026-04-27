"use client";

import { createList } from "@/actions/create-list";
import { FormInput } from "@/components/form/form-input";
import FormSubmit from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Plus, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import ListWrapper from "./list-wrapper";

export default function ListForm() {
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} created`);
      disableEditing();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 0);
  }
  function disableEditing() {
    setIsEditing(false);
  }
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      disableEditing();
    }
  }
  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);
  function onSubmit(formData: FormData) {
    const title = formData.get("title") as string;
    const boardId = formData.get("boardId") as string;
    execute({
      title,
      boardId,
    });
  }
  if (isEditing) {
    return (
      <ListWrapper>
        <form
          action={onSubmit}
          ref={formRef}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
        >
          <FormInput
            ref={inputRef}
            id="title"
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
            placeholder="Enter list title..."
            errors={fieldErrors}
          />
          <input type="hidden" value={params.boardId} name="boardId" />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add list</FormSubmit>
            <Button onClick={disableEditing} size={"sm"} variant={"ghost"}>
              <X />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }
  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className="w-full rounded-md bg-white/80 hover:bg-white/50
         transition duration-300 p-3 flex items-center font-medium text-sm  cursor-pointer"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add a list
      </button>
    </ListWrapper>
  );
}
