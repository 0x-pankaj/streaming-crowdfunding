"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCampaignStats } from "@/lib/api";
import type { CampaignStats as CampaignStatsType } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CampaignStatsProps {
  id: string;
}

export function CampaignStats({ id }: CampaignStatsProps) {
  const [stats, setStats] = useState<CampaignStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchCampaignStats(id);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch campaign stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!stats) {
    return <p>No stats available for this campaign.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Pledged</p>
          <h3 className="text-2xl font-bold">{stats.totalPledged} SOL</h3>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Backers</p>
          <h3 className="text-2xl font-bold">{stats.backers}</h3>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Streaming Payments</p>
          <h3 className="text-2xl font-bold">{stats.streamingPayments}</h3>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Funding Progress</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.dailyFunding}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
