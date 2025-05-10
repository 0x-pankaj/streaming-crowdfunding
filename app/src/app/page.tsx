import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/hero-section";
import { FeaturedCampaigns } from "@/components/featured-campaigns";
import { HowItWorks } from "@/components/how-it-works";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <FeaturedCampaigns />
      <HowItWorks />
      <div className="mt-16 flex justify-center">
        <Link href="/campaigns">
          <Button size="lg" className="font-semibold">
            Explore All Campaigns
          </Button>
        </Link>
      </div>
    </div>
  );
}
