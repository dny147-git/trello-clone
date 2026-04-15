import { auth } from "@clerk/nextjs/server";

export default async function OrganizationIdPage() {
  const { userId, orgId } = await auth();
  return <div className="text-black">Hello {userId}</div>;
}
