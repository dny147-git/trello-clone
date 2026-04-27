"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { UpdateListOrder } from "./schema";
import { InputType, ReturnType } from "./types";

export async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }
  const { items, boardId } = data;
  let lists;
  try {
    const transaction = items.map((list) =>
      prisma.list.update({
        where: {
          id: list.id,
          board: {
            orgId,
          },
        },
        data: {
          order: list.order,
        },
      }),
    );
    lists = await prisma.$transaction(transaction);
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to reorder",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { data: lists };
}
export const updateListOrder = createSafeAction(UpdateListOrder, handler);
