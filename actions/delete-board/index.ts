/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DeleteBoard } from "./schema";
import { InputType, ReturnType } from "./types";

async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }
  const { id } = data;
  let board;
  try {
    board = await prisma.board.delete({
      where: {
        id: id,
        orgId,
      },
    });
  } catch (error) {
    console.log("error", error);
    return {
      error: "Failed to delete board",
    };
  }
  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
}
export const deleteBoard = createSafeAction(DeleteBoard, handler);
