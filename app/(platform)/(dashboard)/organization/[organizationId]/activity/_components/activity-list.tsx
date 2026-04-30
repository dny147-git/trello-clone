import ActivityItem from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ActivityList() {
  const { orgId } = await auth();
  if (!orgId) {
    redirect("/select-org");
  }
  const auditLogs = await prisma.auditLog.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <ol className="space-y-4 mt-4">
      <p className="hidden last:block text-xs text-center text-muted-foreground">
        No activity found inside this organization
      </p>
      {auditLogs.map((log) => {
        return <ActivityItem key={log.id} data={log} />;
      })}
    </ol>
  );
}
ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="w-[80%] h-4" />
      <Skeleton className="w-[50%] h-4" />
      <Skeleton className="w-[70%] h-4" />
      <Skeleton className="w-[80%] h-4" />
      <Skeleton className="w-[75%] h-4" />
    </ol>
  );
};
