import React from "react";
interface ListWrapperProps {
  children: React.ReactNode;
}
export default function ListWrapper({ children }: ListWrapperProps) {
  return <li className="shrink-0 h-full w-68 select-none">{children}</li>;
}
