"use client";
import { updateCard } from "@/actions/updae-card";
import { FormInput } from "@/components/form/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
interface CardHeaderProps {
  data: CardWithList;
}
export default function CardHeader({ data }: CardHeaderProps) {
  const queryClient = useQueryClient();
  const params = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(data.title);
  const { execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card-logs", data.id] });

      toast.success(`Renamed to ${data.title}`);
      setTitle(data.title);
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  function onBlur() {
    inputRef.current?.form?.requestSubmit();
  }
  function onSubmit(formData: FormData) {
    const title = formData.get("title") as string;
    const boardId = params.boardId as string;
    if (title === data.title) return;
    execute({
      title,
      boardId,
      id: data.id,
    });
  }
  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="h-5 w-5 text-neutral-700" />
      <div className="w-full">
        <form action={onSubmit}>
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            defaultValue={title}
            className="font-semibold text-xl px-1 text-neutral-600 bg-transparent
             border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white
              focus-visible:border-input mb-0.5 truncate"
          />
        </form>
        <p className="tex-tsm text-muted-foreground ">
          in list <span className="underline">{data.list.title}</span>
        </p>
      </div>
    </div>
  );
}
CardHeader.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="h-6 w-6 mt-1 bg-neutral-200 " />
      <div>
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-6  bg-neutral-200" />
      </div>
    </div>
  );
};
