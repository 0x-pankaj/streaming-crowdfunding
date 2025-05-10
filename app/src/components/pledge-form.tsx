"use client";

import { useState } from "react";
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

interface PledgeFormProps {
  id: string;
}

export function PledgeForm({ id }: PledgeFormProps) {
  const { connected } = useWallet();
  const program = useAnchorProgram();
  // const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [streamDuration, setStreamDuration] = useState("30");
  const [loading, setLoading] = useState(false);

  const handlePledge = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast("Invalid amount, Please enter a valid amount to pledge.");

      return;
    }

    if (!program) {
      toast("Program not initialized , Please try again in a moment.");

      return;
    }

    setLoading(true);
    try {
      await pledgeToCampaign(program, id, Number.parseFloat(amount));
      toast(
        `Pledge successful!, You have successfully pledge ${amount} SOL to this campaign`
      );

      setAmount("");
    } catch (error) {
      console.error("Pledge failed:", error);
      toast("Pledge failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStreamingPledge = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast("Invalid amount, Please enter a valid amount to stream.");

      return;
    }

    setLoading(true);
    try {
      await createStreamingPayment(
        id,
        Number.parseFloat(amount),
        Number.parseInt(streamDuration)
      );
      toast(
        `Streaming payment created, successfully set up a payment of ${amount} SOL over ${streamDuration} days`
      );

      setAmount("");
    } catch (error) {
      console.error("Streaming payment failed:", error);
      toast("Streaming payment failed");
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
                {loading ? "Processing..." : "Pledge Now"}
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
                {loading ? "Processing..." : "Start Streaming"}
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
