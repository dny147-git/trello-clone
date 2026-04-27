"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { UpdateList } from "./schema";
import { InputType, ReturnType } from "./types";

export async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }
  const { title, id, boardId } = data;
  let list;
  try {
    list = await prisma.list.update({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
      data: {
        title,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to create",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { data: list };
}
export const updateList = createSafeAction(UpdateList, handler);
