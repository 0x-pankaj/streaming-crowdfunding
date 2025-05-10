"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCampaigns } from "@/lib/api";
import { useAnchorProgram } from "@/lib/anchor-client";
import type { Campaign } from "@/lib/types";

export function FeaturedCampaigns() {
  const program = useAnchorProgram();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const data = await fetchCampaigns(program);
        setCampaigns(data.slice(0, 3)); // Get first 3 campaigns
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    if (program) {
      loadCampaigns();
    }
  }, [program]);

  return (
    <section className="py-12">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold">Featured Campaigns</h2>
        <p className="text-muted-foreground">
          Discover innovative projects seeking support
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-4 h-32" />
                <Skeleton className="mb-2 h-4" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">No campaigns found</h3>
          <p className="mb-4 text-muted-foreground">
            Be the first to create a campaign and start raising funds!
          </p>
          <Link href="/create">
            <Button>Create Campaign</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <CardTitle>{campaign.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                  {campaign.description}
                </p>
                <div className="mb-2 space-y-2">
                  <Progress value={(campaign.raised / campaign.goal) * 100} />
                  <div className="flex justify-between text-sm">
                    <span>
                      {((campaign.raised / campaign.goal) * 100).toFixed(1)}%
                      funded
                    </span>
                    <span>{campaign.raised} SOL raised</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/campaigns/${campaign.id}`} className="w-full">
                  <Button className="w-full">View Campaign</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
