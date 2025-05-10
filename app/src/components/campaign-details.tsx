"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { fetchCampaignById } from "@/lib/api";
import { useAnchorProgram } from "@/lib/anchor-client";
import type { Campaign } from "@/lib/types";
import { formatTimeLeft } from "@/lib/utils";

interface CampaignDetailsProps {
  id: string;
}

export function CampaignDetails({ id }: CampaignDetailsProps) {
  const program = useAnchorProgram();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const data = await fetchCampaignById(program, id);
        setCampaign(data);
      } catch (error) {
        console.error("Failed to fetch campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    if (program) {
      loadCampaign();
    }
  }, [id, program]);

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-4 h-8 w-3/4" />
        <Skeleton className="mb-8 h-64" />
        <Skeleton className="mb-2 h-4" />
        <Skeleton className="mb-6 h-4 w-2/3" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Campaign not found</p>
        </CardContent>
      </Card>
    );
  }

  const percentFunded = (campaign.raised / campaign.goal) * 100;
  const timeLeft = formatTimeLeft(campaign.endsAt);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{campaign.title}</h1>
        {!campaign.active && <Badge variant="destructive">Ended</Badge>}
        {campaign.fundsWithdrawn && (
          <Badge variant="outline">Funds Withdrawn</Badge>
        )}
      </div>

      <div className="mb-8 rounded-lg bg-muted p-6">
        <p className="whitespace-pre-line text-base">{campaign.description}</p>
      </div>

      <div className="mb-6 space-y-2">
        <Progress value={percentFunded} />
        <div className="flex justify-between text-sm">
          <span className="font-medium">
            {percentFunded.toFixed(1)}% funded
          </span>
          <span>
            {campaign.raised} SOL of {campaign.goal} SOL goal
          </span>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{timeLeft}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{campaign.backers} backers</span>
        </div>
      </div>
    </div>
  );
}
