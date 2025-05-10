import { CampaignDetails } from "@/components/campaign-details";
import { PledgeForm } from "@/components/pledge-form";
import { BackButton } from "@/components/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignStats } from "@/components/campaign-stats";
import { CampaignUpdates } from "@/components/campaign-updates";

export default function CampaignPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton href="/campaigns" className="mb-6" />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <CampaignDetails id={params.id} />
          <Tabs defaultValue="stats" className="mt-8">
            <TabsList>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
            </TabsList>
            <TabsContent value="stats">
              <Card>
                <CardContent className="pt-6">
                  <CampaignStats id={params.id} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="updates">
              <Card>
                <CardContent className="pt-6">
                  <CampaignUpdates id={params.id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <PledgeForm id={params.id} />
        </div>
      </div>
    </div>
  );
}
