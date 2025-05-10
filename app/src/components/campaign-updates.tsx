"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCampaignUpdates } from "@/lib/api";
import type { CampaignUpdate } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface CampaignUpdatesProps {
  id: string;
}

export function CampaignUpdates({ id }: CampaignUpdatesProps) {
  const [updates, setUpdates] = useState<CampaignUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUpdates = async () => {
      try {
        const data = await fetchCampaignUpdates(id);
        setUpdates(data);
      } catch (error) {
        console.error("Failed to fetch campaign updates:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUpdates();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (updates.length === 0) {
    return <p>No updates have been posted for this campaign yet.</p>;
  }

  return (
    <div className="space-y-6">
      {updates.map((update) => (
        <div key={update.id} className="space-y-2">
          <h3 className="text-lg font-medium">{update.title}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(update.date)}
          </p>
          <div className="whitespace-pre-line rounded-md bg-muted p-4 text-sm">
            {update.content}
          </div>
        </div>
      ))}
    </div>
  );
}
