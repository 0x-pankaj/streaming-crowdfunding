"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { WalletMultiButton } from "@/components/wallet-multi-button";
import { toast } from "sonner";
import { pledgeToCampaign, createStreamingPayment } from "@/lib/api";
import { useAnchorProgram } from "@/lib/anchor-client";
import { useStreamflowClient } from "@/lib/streamflow-client";
import { fetchCampaignById } from "@/lib/api";
import type { Campaign } from "@/lib/types";

interface PledgeFormProps {
  id: string;
}

export function PledgeForm({ id }: PledgeFormProps) {
  const { connected } = useWallet();
  const program = useAnchorProgram();
  const streamflowClient = useStreamflowClient();

  const [amount, setAmount] = useState("");
  const [streamDuration, setStreamDuration] = useState("30");
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const loadCampaign = async () => {
      if (program) {
        try {
          const campaignData = await fetchCampaignById(program, id);
          setCampaign(campaignData);
        } catch (error) {
          console.error("Error loading campaign:", error);
        }
      }
    };

    loadCampaign();
  }, [program, id]);

  const handlePledge = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast("Invalid amount");

      return;
    }

    if (!program) {
      toast("Program not initialized");

      return;
    }

    setLoading(true);
    try {
      await pledgeToCampaign(program, id, Number.parseFloat(amount));
      toast("Pledge successful");

      setAmount("");

      // Reload the page after a short delay to show updated campaign data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Pledge failed:", error);
      toast("Pledge failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStreamingPledge = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast("INvalid amount");

      return;
    }

    if (!streamflowClient) {
      toast("Streamflow client not initialized");

      return;
    }

    if (!campaign) {
      toast("Campaign not found");

      return;
    }

    setLoading(true);
    try {
      await createStreamingPayment(
        streamflowClient,
        id,
        campaign.creator, // Send to the campaign creator
        Number.parseFloat(amount),
        Number.parseInt(streamDuration)
      );
      toast("STreaming payment created");

      setAmount("");

      // No need to reload the page for streaming payments
    } catch (error) {
      console.error("Streaming payment failed:", error);
      toast("STreaming payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Support this campaign</CardTitle>
          <CardDescription>Connect your wallet to pledge</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <WalletMultiButton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support this campaign</CardTitle>
        <CardDescription>Choose how you want to contribute</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="one-time">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="one-time">One-time Pledge</TabsTrigger>
            <TabsTrigger value="streaming">Streaming Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="one-time">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="one-time-amount">Pledge Amount (SOL)</Label>
                <Input
                  id="one-time-amount"
                  type="number"
                  placeholder="0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={handlePledge}
                disabled={loading}
              >
                {loading ? "Processing on Solana..." : "Pledge Now"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="streaming">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stream-amount">Total Amount (SOL)</Label>
                <Input
                  id="stream-amount"
                  type="number"
                  placeholder="1.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stream-duration">Duration (days)</Label>
                <Input
                  id="stream-duration"
                  type="number"
                  value={streamDuration}
                  onChange={(e) => setStreamDuration(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-cancel">Auto-cancel if inactive</Label>
                  <p className="text-xs text-muted-foreground">
                    Stop the stream if the campaign becomes inactive
                  </p>
                </div>
                <Switch id="auto-cancel" defaultChecked />
              </div>

              <Button
                className="w-full"
                onClick={handleStreamingPledge}
                disabled={loading}
              >
                {loading ? "Creating Stream on Solana..." : "Start Streaming"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col text-xs text-muted-foreground">
        <p>
          Streaming payments use Streamflow to send funds continuously over
          time.
        </p>
        <p>You can cancel your stream at any time from your dashboard.</p>
      </CardFooter>
    </Card>
  );
}
