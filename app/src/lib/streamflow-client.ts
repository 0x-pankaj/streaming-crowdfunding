"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { type Stream, StreamflowSolana } from "@streamflow/stream";

// SOL mint address
const SOL_MINT = new PublicKey("So11111111111111111111111111111111111111112");

export function useStreamflowClient() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [client, setClient] = useState<StreamflowSolana | null>(null);

  useEffect(() => {
    if (!wallet || !connection) return;

    try {
      // Initialize Streamflow client
      const streamClient = new StreamflowSolana({
        network: "devnet",
        wallet: wallet as any,
        connection,
      });

      setClient(streamClient);
    } catch (error) {
      console.error("Error initializing Streamflow client:", error);
    }
  }, [connection, wallet]);

  return client;
}

export async function createStream(
  client: StreamflowSolana,
  recipientAddress: string,
  amount: number,
  durationDays: number
): Promise<string> {
  if (!client) {
    throw new Error("Streamflow client not initialized");
  }

  try {
    const amountInLamports = amount * LAMPORTS_PER_SOL;
    const startTime = Math.floor(Date.now() / 1000); // current time in seconds
    const endTime = startTime + durationDays * 24 * 60 * 60; // end time in seconds

    const createStreamParams = {
      recipient: new PublicKey(recipientAddress),
      mint: SOL_MINT,
      start: startTime,
      amount: amountInLamports.toString(),
      period: 60, // 60 seconds per period
      cliff: startTime,
      cliffAmount: "0",
      amountPerPeriod: (amountInLamports / (durationDays * 24 * 60)).toString(), // Amount per minute
      name: "Campaign Support Stream",
      canTopup: false,
      cancelableBySender: true,
      cancelableByRecipient: false,
      transferableBySender: true,
      transferableByRecipient: false,
      automaticWithdrawal: true,
      withdrawalFrequency: 3600, // Withdraw every hour
    };

    const { txId, id } = await client.create(createStreamParams);
    console.log("Stream created with ID:", id, "and transaction:", txId);
    return id;
  } catch (error) {
    console.error("Error creating stream:", error);
    throw error;
  }
}

export async function cancelStream(
  client: StreamflowSolana,
  streamId: string
): Promise<string> {
  if (!client) {
    throw new Error("Streamflow client not initialized");
  }

  try {
    const { txId } = await client.cancel(streamId);
    console.log("Stream cancelled with transaction:", txId);
    return txId;
  } catch (error) {
    console.error("Error cancelling stream:", error);
    throw error;
  }
}

export async function fetchUserStreams(
  client: StreamflowSolana,
  walletAddress: string
): Promise<Stream[]> {
  if (!client) {
    throw new Error("Streamflow client not initialized");
  }

  try {
    // Fetch streams where the user is the sender
    const streams = await client.get({
      sender: new PublicKey(walletAddress),
    });

    return streams;
  } catch (error) {
    console.error("Error fetching user streams:", error);
    return [];
  }
}
