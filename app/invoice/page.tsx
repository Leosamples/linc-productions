import { Suspense } from "react";
import InvoiceTool from "@/components/InvoiceTool";

export const metadata = {
  title: "Invoice — Linc Productions",
};

export default function InvoicePage() {
  return (
    <Suspense fallback={null}>
      <InvoiceTool />
    </Suspense>
  );
}
