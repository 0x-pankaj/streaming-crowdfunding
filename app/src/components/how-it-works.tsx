import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet, Sparkles, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HowItWorks() {
  return (
    <section className="py-12">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold">How It Works</h2>
        <p className="text-muted-foreground">
          SolStream makes crowdfunding with crypto simple and powerful
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Wallet className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Set up a Solana wallet like Phantom or Solflare to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your wallet is your identity on Solana. It allows you to interact
              with campaigns and make streaming payments securely.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Sparkles className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Support Campaigns</CardTitle>
            <CardDescription>
              Browse campaigns and pledge SOL to projects you believe in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Make one-time pledges or set up continuous streaming payments that
              support creators in real-time, second by second.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Clock className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Stream Payments</CardTitle>
            <CardDescription>
              Set up continuous micro-payments that stream funds in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Streamflow enables pay-per-second support, giving creators
              predictable income and backers more control over their funds.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Link href="/onboarding">
          <Button variant="outline" size="lg">
            Learn More About Getting Started
          </Button>
        </Link>
      </div>
    </section>
  );
}
