"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CreateCard } from "./schema";
import { InputType, ReturnType } from "./types";

async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }
  const { title, boardId, listId } = data;
  let card;
  try {
    const list = await prisma.list.findUnique({
      where: {
        id: listId,
        board: {
          orgId,
        },
      },
    });
    if (!list) {
      return { error: "List not found" };
    }
    const lastCard = await prisma.card.findFirst({
      where: {
        listId,
      },
      orderBy: {
        order: "desc",
      },
      select: { order: true },
    });
    const newOrder = lastCard ? lastCard.order + 1 : 1;
    card = await prisma.card.create({
      data: {
        title,
        listId,
        order: newOrder,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to create",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { data: card };
}
export const createCard = createSafeAction(CreateCard, handler);
