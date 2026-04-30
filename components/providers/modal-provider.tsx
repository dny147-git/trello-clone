"use client";
import { useEffect, useState } from "react";
import CardModal from "../modals/card-modal";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return;
  }
  return (
    <div>
      <CardModal />
    </div>
  );
}
