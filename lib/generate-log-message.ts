export type ACTION = "CREATE" | "UPDATE" | "DELETE";

export type ENTITY_TYPE = "CARD" | "BOARD" | "LIST";
interface AuditLog {
  id: string;
  orgId: string;
  action: ACTION;
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  userId: string;
  userName: string;
  userImage: string;
  createdAt: Date;
  updatedAt: Date;
}

export function generateLogMessage(log: AuditLog) {
  const { action, entityTitle, entityType } = log;
  switch (action) {
    case "CREATE":
      return `created at ${entityType.toLowerCase()} ${entityTitle}`;
    case "DELETE":
      return `deleted at ${entityType.toLowerCase()} ${entityTitle}`;
    case "UPDATE":
      return `updated at ${entityType.toLowerCase()} ${entityTitle}`;
    default:
      return `unknown action ${entityType.toLocaleLowerCase()}`;
  }
}
