import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { AuditLog } from "@/lib/generated/prisma/client";
import { CardWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import CardActions from "./card-actions";
import CardActivity from "./card-activity";
import CardDescription from "./card-description";
import CardHeader from "./card-header";

export default function CardModal() {
  const { id, isOpen, onClose } = useCardModal();
  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
  });
  const { data: auditLogsData } = useQuery<AuditLog[]>({
    queryKey: ["card-logs", id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-xl">
        {!cardData ? <CardHeader.Skeleton /> : <CardHeader data={cardData} />}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {cardData ? (
                <CardDescription data={cardData} />
              ) : (
                <CardDescription.Skeleton />
              )}
            </div>
          </div>
          {!cardData ? (
            <CardActions.Skeleton />
          ) : (
            <CardActions data={cardData} />
          )}
        </div>
        {!auditLogsData ? (
          <CardActivity.Skeleton />
        ) : (
          <CardActivity data={auditLogsData} />
        )}
      </DialogContent>
    </Dialog>
  );
}
