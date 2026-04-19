"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
interface FormSubmitButton {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primary";
}
export default function FormSubmit({
  children,
  disabled,
  className,
  variant = "primary",
}: FormSubmitButton) {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending || disabled}
      type="submit"
      variant={variant}
      size={"sm"}
      className={cn(className)}
    >
      {children}
    </Button>
  );
}
