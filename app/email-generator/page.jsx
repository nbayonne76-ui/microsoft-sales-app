import NicolasEmailGenerator from '../../components/NicolasEmailGenerator';
import { Toaster } from "@/components/ui/sonner";

export default function EmailGeneratorPage() {
  return (
    <div className="container mx-auto py-8">
      <NicolasEmailGenerator />
      <Toaster />
    </div>
  );
}
