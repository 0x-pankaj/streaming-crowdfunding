import { UserCampaigns } from "@/components/user-campaign";
import { UserPledges } from "@/components/user-pledges";
import { StreamingPayments } from "@/components/streaming-payment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { WalletMultiButton } from "@/components/wallet-multi-button";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <WalletMultiButton />
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList className="mb-6">
          <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
          <TabsTrigger value="pledges">My Pledges</TabsTrigger>
          <TabsTrigger value="streams">Streaming Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card>
            <CardContent className="pt-6">
              <UserCampaigns />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pledges">
          <Card>
            <CardContent className="pt-6">
              <UserPledges />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streams">
          <Card>
            <CardContent className="pt-6">
              <StreamingPayments />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
