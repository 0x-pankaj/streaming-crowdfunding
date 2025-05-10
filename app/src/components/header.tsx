"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WalletMultiButton } from "@/components/wallet-multi-button";
import { useWallet } from "@solana/wallet-adapter-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

export function Header() {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold">
          SolStream
        </Link>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 pt-10">
              <Link href="/campaigns">
                <Button variant="ghost" className="w-full justify-start">
                  Explore
                </Button>
              </Link>
              <Link href="/create">
                <Button variant="ghost" className="w-full justify-start">
                  Create
                </Button>
              </Link>
              {mounted && connected && (
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full justify-start">
                    Dashboard
                  </Button>
                </Link>
              )}
              <Link href="/onboarding">
                <Button variant="ghost" className="w-full justify-start">
                  How It Works
                </Button>
              </Link>
              <div className="mt-4">
                <WalletMultiButton />
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop menu */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/campaigns">
            <Button variant="ghost">Explore</Button>
          </Link>
          <Link href="/create">
            <Button variant="ghost">Create</Button>
          </Link>
          {mounted && connected && (
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          )}
          <Link href="/onboarding">
            <Button variant="ghost">How It Works</Button>
          </Link>
          <ModeToggle />
          <WalletMultiButton />
        </nav>
      </div>
    </header>
  );
}
