import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export function OnboardingSteps() {
  return (
    <Tabs defaultValue="wallet">
      <TabsList className="mb-6 grid w-full grid-cols-3">
        <TabsTrigger value="wallet">1. Wallet Setup</TabsTrigger>
        <TabsTrigger value="crypto">2. Why Crypto?</TabsTrigger>
        <TabsTrigger value="streaming">3. Streaming Payments</TabsTrigger>
      </TabsList>

      <TabsContent value="wallet">
        <Card>
          <CardHeader>
            <CardTitle>Setting Up Your Solana Wallet</CardTitle>
            <CardDescription>
              Your wallet is your gateway to the Solana blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">1. Choose a Wallet</h3>
              <p className="text-muted-foreground">
                We recommend Phantom, Solflare, or Backpack for the best
                experience. These wallets are secure, user-friendly, and fully
                compatible with SolStream.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://phantom.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">Phantom</Button>
                </a>
                <a
                  href="https://solflare.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">Solflare</Button>
                </a>
                <a
                  href="https://www.backpack.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">Backpack</Button>
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                2. Install the Browser Extension
              </h3>
              <p className="text-muted-foreground">
                Download and install your chosen wallet as a browser extension.
                Follow the wallet's instructions to create a new wallet or
                import an existing one.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">3. Secure Your Wallet</h3>
              <p className="text-muted-foreground">
                Write down your recovery phrase and store it in a safe place.
                Never share this phrase with anyone. This is the only way to
                recover your wallet if you lose access.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">4. Add SOL to Your Wallet</h3>
              <p className="text-muted-foreground">
                You'll need SOL to interact with campaigns and make pledges. You
                can purchase SOL on exchanges like Coinbase, Binance, or FTX and
                transfer it to your wallet.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="crypto">
        <Card>
          <CardHeader>
            <CardTitle>Why Use Crypto for Crowdfunding?</CardTitle>
            <CardDescription>
              Understanding the benefits of blockchain-based crowdfunding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Global Accessibility</h3>
              <p className="text-muted-foreground">
                Anyone with an internet connection can participate in campaigns,
                regardless of location or banking access. This opens up funding
                opportunities to a global audience.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Lower Fees</h3>
              <p className="text-muted-foreground">
                Traditional crowdfunding platforms often charge 5-10% in fees.
                With Solana's low transaction costs, more of your money goes
                directly to the creators you support.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Transparency</h3>
              <p className="text-muted-foreground">
                All transactions are recorded on the blockchain, providing
                complete transparency. You can verify exactly how much has been
                raised and where the funds are going.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Innovative Funding Models</h3>
              <p className="text-muted-foreground">
                Blockchain enables new ways to support creators, like streaming
                payments that provide continuous funding over time rather than
                one-time pledges.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="streaming">
        <Card>
          <CardHeader>
            <CardTitle>Understanding Streaming Payments</CardTitle>
            <CardDescription>
              How continuous micro-payments work on SolStream
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                What Are Streaming Payments?
              </h3>
              <p className="text-muted-foreground">
                Streaming payments allow you to support creators continuously
                over time, rather than with a single lump sum. Funds are
                transferred second-by-second from your wallet to the creator's.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Benefits for Backers</h3>
              <p className="text-muted-foreground">
                You maintain control of your funds throughout the streaming
                period. If a project stops delivering value, you can cancel the
                stream and keep the remaining funds.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Benefits for Creators</h3>
              <p className="text-muted-foreground">
                Creators receive a steady, predictable income stream rather than
                unpredictable one-time donations. This helps with planning and
                sustainability.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">How to Start a Stream</h3>
              <p className="text-muted-foreground">
                When pledging to a campaign, select the "Streaming Payment"
                option. Choose the total amount and duration, and the funds will
                be locked in a Streamflow contract and released gradually.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Managing Your Streams</h3>
              <p className="text-muted-foreground">
                You can view and manage all your active streams from your
                dashboard. Cancel a stream at any time to stop the payments and
                reclaim your remaining funds.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
