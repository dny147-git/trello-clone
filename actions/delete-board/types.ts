import { ActionState } from "@/lib/create-safe-action";
import { Board } from "@/lib/generated/prisma/client";
import z from "zod";
import { DeleteBoard } from "./schema";

export type InputType = z.infer<typeof DeleteBoard>;
export type ReturnType = ActionState<InputType, Board>;
