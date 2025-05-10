import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  className?: string;
}

export function BackButton({ href, className }: BackButtonProps) {
  return (
    <Link href={href}>
      <Button variant="ghost" className={className}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
    </Link>
  );
}
