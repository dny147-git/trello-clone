import z from "zod";

export const CreateBoard = z.object({
  title: z.string().min(3, {
    message: "Title is too short",
  }),
  image: z.any().refine((val) => typeof val === "string" && val.length > 0, {
    message: "Image is required",
  }),
});
