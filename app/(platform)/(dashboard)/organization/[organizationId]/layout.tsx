import React from "react";
import OrgControl from "./_components/org-control";

export default function OrganizationIdPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <OrgControl />
      {children}
    </div>
  );
}
