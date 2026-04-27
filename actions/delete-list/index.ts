"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { DeleteList } from "./schema";
import { InputType, ReturnType } from "./types";

async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }
  const { id, boardId } = data;
  let list;
  try {
    list = await prisma.list.delete({
      where: {
        id: id,
        boardId: boardId,
        board: {
          orgId,
        },
      },
    });
  } catch (error) {
    console.log("error", error);
    return {
      error: "Failed to delete board",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { data: list };
}
export const deleteList = createSafeAction(DeleteList, handler);
