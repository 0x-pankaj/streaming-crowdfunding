"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { fetchAllStreams, cancelStream } from "@/lib/api";
import { useAnchorProgram } from "@/lib/anchor-client";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function StreamingPayments() {
  const { connected, publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const program = useAnchorProgram();

  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [campaignTitles, setCampaignTitles] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const loadStreams = async () => {
      if (!connected || !publicKey || !connection) return;

      try {
        const streamData = await fetchAllStreams(
          publicKey.toString(),
          connection
        );
        setStreams(streamData);

        // Try to fetch campaign titles for each stream
        const titles: Record<string, string> = {};
        for (const stream of streamData) {
          try {
            // This is a simplified approach - in a real app, you'd need to map
            // stream recipients to campaign IDs in a more robust way
            if (program) {
              const campaigns = await program.account.campaign.all();
              for (const campaign of campaigns) {
                if (
                  campaign.account.creator.toString() ===
                  stream.recipient.toString()
                ) {
                  titles[stream.id] = campaign.account.title;
                  break;
                }
              }
            }
          } catch (error) {
            console.error("Error fetching campaign title:", error);
          }
        }
        setCampaignTitles(titles);
      } catch (error) {
        console.error("Failed to fetch user streams:", error);
      } finally {
        setLoading(false);
      }
    };

    if (connected && publicKey && connection) {
      loadStreams();
    }
  }, [connected, publicKey, connection, program]);

  const handleCancelStream = async (streamId: string) => {
    if (!wallet || !connection) return;

    setActionLoading(streamId);
    try {
      await cancelStream(streamId, connection, wallet.adapter);

      // Remove the cancelled stream from the list
      setStreams(streams.filter((stream) => stream.id !== streamId));
      toast("Stream cancelled");
    } catch (error) {
      console.error("Failed to cancel stream:", error);
      toast("Failed to cancel stream");
    } finally {
      setActionLoading(null);
    }
  };

  const getStreamStatus = (stream: any) => {
    const now = Math.floor(Date.now() / 1000);
    if (stream.canceledAt) return "cancelled";
    if (now >= stream.end) return "completed";
    return "active";
  };

  const getStreamProgress = (stream: any) => {
    const now = Math.floor(Date.now() / 1000);
    const totalDuration = stream.end - stream.start;
    const elapsed = Math.min(now - stream.start, totalDuration);
    return (elapsed / totalDuration) * 100;
  };

  const formatStreamedAmount = (stream: any) => {
    const now = Math.floor(Date.now() / 1000);
    const totalDuration = stream.end - stream.start;
    const elapsed = Math.min(now - stream.start, totalDuration);
    const streamedRatio = elapsed / totalDuration;
    const streamedAmount =
      (stream.amount.toNumber() * streamedRatio) / LAMPORTS_PER_SOL;
    return streamedAmount.toFixed(4);
  };

  const formatTotalAmount = (stream: any) => {
    return (stream.amount.toNumber() / LAMPORTS_PER_SOL).toFixed(4);
  };

  if (!connected) {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">
          Connect your wallet to view your streaming payments
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

  if (streams.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">
          You don't have any active streaming payments
        </p>
        <Link href="/campaigns">
          <Button>Explore Campaigns</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {streams.map((stream) => {
        const status = getStreamStatus(stream);
        const progress = getStreamProgress(stream);
        const streamedAmount = formatStreamedAmount(stream);
        const totalAmount = formatTotalAmount(stream);
        const campaignTitle = campaignTitles[stream.id] || "Campaign";

        return (
          <Card key={stream.id}>
            <CardContent className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-medium">{campaignTitle}</h3>
                <Badge variant={status === "active" ? "outline" : "secondary"}>
                  {status}
                </Badge>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total: {totalAmount} SOL</span>
                  <span>Streamed: {streamedAmount} SOL</span>
                </div>
                <Progress value={progress} />
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p>{new Date(stream.start * 1000).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">End Date</p>
                  <p>{new Date(stream.end * 1000).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {status === "active" && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleCancelStream(stream.id)}
                    disabled={actionLoading === stream.id}
                  >
                    {actionLoading === stream.id
                      ? "Cancelling..."
                      : "Cancel Stream"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
