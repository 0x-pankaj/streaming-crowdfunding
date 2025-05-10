import { CreateCampaignForm } from "@/components/create-campaign-form";
import { BackButton } from "@/components/back-button";

export default function CreateCampaignPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton href="/" className="mb-6" />
      <h1 className="mb-8 text-3xl font-bold">Create a Campaign</h1>
      <CreateCampaignForm />
    </div>
  );
}
