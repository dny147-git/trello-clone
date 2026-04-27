"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { UpdateCardOrder } from "./schema";
import { InputType, ReturnType } from "./types";

export async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }
  const { items, boardId } = data;
  let updatedCards;
  try {
    const transaction = items.map((card) =>
      prisma.card.update({
        where: {
          id: card.id,
          list: {
            board: {
              orgId,
            },
          },
        },
        data: {
          order: card.order,
          listId: card.listId,
        },
      }),
    );
    updatedCards = await prisma.$transaction(transaction);
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to reorder",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { data: updatedCards };
}
export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);
