import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <div className="py-16 text-center md:py-24">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
        Support Creators with{" "}
        <span className="text-primary">Streaming Payments</span>
      </h1>
      <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
        Fund your favorite projects with continuous micro-payments on Solana.
        Pay-per-second support for creators, transparent and decentralized.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link href="/campaigns">
          <Button size="lg" className="font-semibold">
            Explore Campaigns
          </Button>
        </Link>
        <Link href="/create">
          <Button size="lg" variant="outline" className="font-semibold">
            Start a Campaign
          </Button>
        </Link>
      </div>
    </div>
  );
}
