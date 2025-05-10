"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton as SolanaWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function WalletMultiButton() {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" className="h-10 px-4">
        Connect Wallet
      </Button>
    );
  }

  return <SolanaWalletMultiButton className="wallet-adapter-button-trigger" />;
}
