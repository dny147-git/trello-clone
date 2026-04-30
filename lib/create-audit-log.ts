import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./db";
import { ACTION, ENTITY_TYPE } from "./generated/prisma/enums";

interface Props {
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
}

export async function createAuditLog({
  entityId,
  entityType,
  entityTitle,
  action,
}: Props) {
  try {
    const { orgId } = await auth();

    const user = await currentUser();
    if (!orgId || !user) {
      throw new Error("User not found");
    }
    await prisma.auditLog.create({
      data: {
        orgId: orgId as string,
        action,
        entityId,
        entityType,
        entityTitle,
        userId: user.id,
        userImage: user.imageUrl,
        userName: user?.firstName + " " + user?.lastName,
      },
    });
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
  }
}
