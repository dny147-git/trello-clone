"use client";

import { updateList } from "@/actions/update-list";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { List } from "@/lib/generated/prisma/client";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import ListOptions from "./list-options";

interface ListHeaderProps {
  onAddCard: () => void;
  data: List;
}
export default function ListHeader({ data, onAddCard }: ListHeaderProps) {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      inputRef?.current?.focus();
      inputRef?.current?.select();
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
  const { execute, fieldErrors } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`Renamed to ${data.title}`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  function handleSubmit(formData: FormData) {
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;
    if (title === data.title) {
      return disableEditing();
    }
    execute({
      title,
      boardId,
      id,
    });
  }
  function onBlur() {
    console.log("blur");
    formRef?.current?.requestSubmit();
  }
  return (
    <div className="pt-2 px-2 font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <form action={handleSubmit} ref={formRef} className="flex-1 px-0.5">
          <input type="hidden" id="id" name="id" value={data.id} />
          <input
            type="hidden"
            id="boardId"
            name="boardId"
            value={data.boardId}
          />
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            placeholder="Enter list title..."
            defaultValue={title}
            className="text-sm px-1.75 py-1 h-7 font-medium border-transparent
             hover:border-input focus:border-input
            transition truncate bg-transparent focus:bg-white"
            errors={fieldErrors}
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
        >
          {title}
        </div>
      )}
      <ListOptions data={data} onAddCard={onAddCard} />
    </div>
  );
}
