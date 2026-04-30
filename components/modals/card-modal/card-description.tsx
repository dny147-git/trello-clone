"use client";
import { updateCard } from "@/actions/updae-card";
import FormSubmit from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { RefObject, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardDescriptionProps {
  data: CardWithList;
}
export default function CardDescription({ data }: CardDescriptionProps) {
  const queryClient = useQueryClient();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      toast.success(`Card ${data.title} updated`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef?.current?.focus();
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
  useOnClickOutside(formRef as RefObject<HTMLFormElement>, disableEditing);
  function onSubmit(formData: FormData) {
    const description = formData.get("description") as string;
    const boardId = params.boardId as string;
    execute({
      boardId,
      description,
      id: data.id,
    });
  }

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="w-5 h-5 mt-0.5 text-neutral-700 " />
      <div className="w-full">
        <p className="font-bold text-neutral-700 mb-2">Description</p>
        {isEditing ? (
          <form action={onSubmit} ref={formRef} className="space-y-2">
            <FormTextarea
              id="description"
              ref={textAreaRef}
              className="w-full mt-2"
              placeholder="Add a more detailed description"
              defaultValue={data.description || undefined}
              errors={fieldErrors}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
              <Button
                onClick={disableEditing}
                type="button"
                size={"sm"}
                variant={"ghost"}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-19.5 bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {data.description || "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
}
CardDescription.Skeleton = function CardDescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200 " />
      <div className="w-full ">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200 " />
        <Skeleton className="w-full h-19.5 bg-neutral-200 " />
      </div>
    </div>
  );
};
