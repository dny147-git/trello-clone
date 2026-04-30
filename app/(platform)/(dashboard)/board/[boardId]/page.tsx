import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ListContainer from "./_components/list-container";

interface BoardIdPageProps {
  params: Promise<{ boardId: string }>;
}
export default async function BoardIdPage({ params }: BoardIdPageProps) {
  const { orgId } = await auth();
  const { boardId } = await params;
  if (!orgId) {
    redirect("/select-org");
  }
  const lists = await prisma.list.findMany({
    where: {
      boardId,
      board: {
        orgId,
      },
    },
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });
  return (
    <div className="p-4 h-full overflow-x-auto ">
      <ListContainer boardId={boardId} data={lists} />
    </div>
  );
}
