import { generateLogMessage } from "@/lib/generate-log-message";
import { AuditLog } from "@/lib/generated/prisma/client";
import { format } from "date-fns";
import { Avatar, AvatarImage } from "./ui/avatar";
interface ActivityItemProps {
  data: AuditLog;
}
export default function ActivityItem({ data }: ActivityItemProps) {
  return (
    <li className="flex items-center gap-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={data.userImage} />
      </Avatar>
      <div className="flex flex-col space-y-0.5">
        <p className="text-sm text-muted-foreground flex">
          <span className="font-semibold lowercase text-neutral-700 mr-1">
            {data.userName}
          </span>
          {generateLogMessage(data)}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </li>
  );
}
