"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  fetchUserCampaigns,
  endCampaign,
  cancelCampaign,
  withdrawFunds,
} from "@/lib/api";
import { useAnchorProgram } from "@/lib/anchor-client";
import { toast } from "sonner";
import type { Campaign } from "@/lib/types";
import { formatTimeLeft } from "@/lib/utils";

export function UserCampaigns() {
  const { connected, publicKey } = useWallet();
  const program = useAnchorProgram();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const loadCampaigns = async () => {
      if (!connected || !publicKey || !program) return;

      try {
        const data = await fetchUserCampaigns(program, publicKey.toString());
        setCampaigns(data);
      } catch (error) {
        console.error("Failed to fetch user campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    if (program) {
      loadCampaigns();
    } else {
      setLoading(false);
    }
  }, [connected, publicKey, program]);

  const handleEndCampaign = async (campaignId: string) => {
    if (!program) return;

    setActionLoading(campaignId);
    try {
      await endCampaign(program, campaignId);

      // Update the campaign in the local state
      setCampaigns(
        campaigns.map((campaign) =>
          campaign.id === campaignId ? { ...campaign, active: false } : campaign
        )
      );
      toast("Campaign ended");

      // Reload the page after a short delay to show updated campaign data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Failed to end campaign:", error);
      toast("Failed to end campaing");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelCampaign = async (campaignId: string) => {
    if (!program) return;

    setActionLoading(campaignId);
    try {
      await cancelCampaign(program, campaignId);

      // Update the campaign in the local state
      setCampaigns(
        campaigns.map((campaign) =>
          campaign.id === campaignId
            ? { ...campaign, active: false, canceled: true }
            : campaign
        )
      );
      toast("Campaign cancelled");

      // Reload the page after a short delay to show updated campaign data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Failed to cancel campaign:", error);
      toast("FAiled to cancel campaing");
    } finally {
      setActionLoading(null);
    }
  };

  const handleWithdrawFunds = async (campaignId: string) => {
    if (!program) return;

    setActionLoading(campaignId);
    try {
      await withdrawFunds(program, campaignId);

      // Update the campaign in the local state
      setCampaigns(
        campaigns.map((campaign) =>
          campaign.id === campaignId
            ? { ...campaign, fundsWithdrawn: true }
            : campaign
        )
      );
      toast("Funds withdraw");

      // Reload the page after a short delay to show updated campaign data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Failed to withdraw funds:", error);
      toast("FAiled to withdraw funds");
    } finally {
      setActionLoading(null);
    }
  };

  if (!connected) {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">
          Connect your wallet to view your campaigns
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">
          You havent created any campaigns yet
        </p>
        <Link href="/create">
          <Button>Create Campaign</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {campaigns.map((campaign) => (
        <Card key={campaign.id}>
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-medium">{campaign.title}</h3>
              <div className="flex gap-2">
                <Badge variant={campaign.active ? "outline" : "destructive"}>
                  {campaign.active
                    ? "Active"
                    : campaign.canceled
                    ? "Cancelled"
                    : "Ended"}
                </Badge>
                {campaign.fundsWithdrawn && (
                  <Badge variant="secondary">Funds Withdrawn</Badge>
                )}
              </div>
            </div>

            <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
              {campaign.description}
            </p>

            <div className="mb-4 space-y-2">
              <Progress value={(campaign.raised / campaign.goal) * 100} />
              <div className="flex justify-between text-sm">
                <span>{campaign.raised} SOL raised</span>
                <span>{campaign.goal} SOL goal</span>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Backers: </span>
                <span>{campaign.backers}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Time left: </span>
                <span>{formatTimeLeft(campaign.endsAt)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href={`/campaigns/${campaign.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>

              {campaign.active && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEndCampaign(campaign.id)}
                    disabled={actionLoading === campaign.id}
                  >
                    End Campaign
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelCampaign(campaign.id)}
                    disabled={actionLoading === campaign.id}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {!campaign.active &&
                campaign.raised > 0 &&
                !campaign.fundsWithdrawn && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleWithdrawFunds(campaign.id)}
                    disabled={actionLoading === campaign.id}
                  >
                    Withdraw Funds
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
