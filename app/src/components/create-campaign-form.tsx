"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WalletMultiButton } from "@/components/wallet-multi-button";
import { toast } from "sonner";
import { createCampaign } from "@/lib/api";
import { useAnchorProgram } from "@/lib/anchor-client";

export function CreateCampaignForm() {
  const { connected } = useWallet();
  const program = useAnchorProgram();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("30");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !goal || !duration) {
      toast("Missing fields");

      return;
    }

    if (!program) {
      toast("Program not initialized");

      return;
    }

    setLoading(true);
    try {
      const campaignId = await createCampaign(program, {
        title,
        description,
        goal: Number.parseFloat(goal),
        duration: Number.parseInt(duration),
      });
      toast("Campaing created");

      router.push(`/campaigns/${campaignId}`);
    } catch (error) {
      console.error("Campaign creation failed:", error);
      toast("Campaign creation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="mb-4 text-center text-muted-foreground">
            Connect your wallet to create a campaign
          </p>
          <WalletMultiButton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title</Label>
            <Input
              id="title"
              placeholder="Enter a clear, attention-grabbing title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Campaign Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your campaign in detail. What are you raising funds for? Why should people support you?"
              className="min-h-[200px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="goal">Funding Goal (SOL)</Label>
              <Input
                id="goal"
                type="number"
                placeholder="1.0"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Campaign Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Campaign..." : "Create Campaign"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
