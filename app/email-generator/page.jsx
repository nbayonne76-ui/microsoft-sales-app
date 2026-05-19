import { Suspense } from 'react';
import KBEmailGenerator from '../../components/KBEmailGenerator';
import { Toaster } from "@/components/ui/sonner";

export default function EmailGeneratorPage() {
  return (
    <>
      <Suspense fallback={null}>
        <KBEmailGenerator />
      </Suspense>
      <Toaster />
    </>
  );
}
