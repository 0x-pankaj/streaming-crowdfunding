"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUserPledges } from "@/lib/api";
import type { Pledge } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function UserPledges() {
  const { connected, publicKey } = useWallet();
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPledges = async () => {
      if (!connected || !publicKey) return;

      try {
        const data = await fetchUserPledges(publicKey.toString());
        setPledges(data);
      } catch (error) {
        console.error("Failed to fetch user pledges:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPledges();
  }, [connected, publicKey]);

  if (!connected) {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">
          Connect your wallet to view your pledges
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (pledges.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">
          You haven't made any pledges yet
        </p>
        <Link href="/campaigns">
          <Button>Explore Campaigns</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pledges.map((pledge) => (
        <Card key={pledge.id}>
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-medium">{pledge.campaignTitle}</h3>
              <span className="text-lg font-semibold">{pledge.amount} SOL</span>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">
              Pledged on {formatDate(pledge.date)}
            </p>

            <Link href={`/campaigns/${pledge.campaignId}`}>
              <Button variant="outline" size="sm">
                View Campaign
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
