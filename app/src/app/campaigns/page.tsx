import { CampaignsList } from "@/components/campaigns-list";
import { CampaignsFilter } from "@/components/campaigns-filter";

export default function CampaignsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Explore Campaigns</h1>
      <div className="mb-6">
        <CampaignsFilter />
      </div>
      <CampaignsList />
    </div>
  );
}
