import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import BoardList from "./_components/board-list";
import Info from "./_components/info";
export async function generateMetadata() {
  const { orgSlug } = await auth();
  return {
    title: orgSlug,
  };
}
export default async function OrganizationIdPage() {
  return (
    <div className="w-full mb-20 ">
      <Info />
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <Suspense fallback={<BoardList.Skeleton />}>
          {" "}
          <BoardList />
        </Suspense>
      </div>
    </div>
  );
}
