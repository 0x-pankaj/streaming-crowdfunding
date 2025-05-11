"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { fetchUserStreams, cancelStreamPayment } from "@/lib/api";
import { useStreamflowClient } from "@/lib/streamflow-client";
import type { Stream } from "@/lib/types";

export function StreamingPayments() {
  const { connected, publicKey } = useWallet();
  const streamflowClient = useStreamflowClient();

  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const loadStreams = async () => {
      if (!connected || !publicKey || !streamflowClient) return;

      try {
        const data = await fetchUserStreams(
          streamflowClient,
          publicKey.toString()
        );
        setStreams(data);
      } catch (error) {
        console.error("Failed to fetch user streams:", error);
      } finally {
        setLoading(false);
      }
    };

    if (streamflowClient) {
      loadStreams();
    } else {
      setLoading(false);
    }
  }, [connected, publicKey, streamflowClient]);

  const handleCancelStream = async (streamId: string) => {
    if (!streamflowClient) {
      toast("STreamflow client not initialized");

      return;
    }

    setActionLoading(streamId);
    try {
      await cancelStreamPayment(streamflowClient, streamId);

      // Update the stream in the local state
      setStreams(streams.filter((stream) => stream.id !== streamId));
      toast("Stream cancelled");
    } catch (error) {
      console.error("Failed to cancel stream:", error);
      toast("Failed to cancel stream");
    } finally {
      setActionLoading(null);
    }
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

  if (!streamflowClient) {
    return (
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">
          Streamflow client is initializing. Please wait or refresh the page.
        </p>
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
      {streams.map((stream) => (
        <Card key={stream.id}>
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-medium">{stream.campaignTitle}</h3>
              <Badge
                variant={stream.status === "active" ? "outline" : "secondary"}
              >
                {stream.status}
              </Badge>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total: {stream.totalAmount.toFixed(2)} SOL</span>
                <span>Streamed: {stream.streamedAmount.toFixed(2)} SOL</span>
              </div>
              <Progress
                value={(stream.streamedAmount / stream.totalAmount) * 100}
              />
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Start Date</p>
                <p>{new Date(stream.startTime).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">End Date</p>
                <p>
                  {stream.endTime
                    ? new Date(stream.endTime).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {stream.campaignId && (
                <Link
                  href={`/campaigns/${stream.campaignId}`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    View Campaign
                  </Button>
                </Link>
              )}
              {stream.status === "active" && (
                <Button
                  variant="destructive"
                  className="flex-1"
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
      ))}
    </div>
  );
}
