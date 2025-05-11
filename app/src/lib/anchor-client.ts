"use client";

import { AnchorProvider, Program, BN, type Idl } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { Campaign } from "./types";

interface CampaignAccount {
  creator: PublicKey;
  title: string;
  description: string;
  goal: BN;
  raised: BN;
  backers: BN;
  createdAt: BN; // camelCase version of created_at from IDL
  endsAt: BN; // camelCase version of ends_at from IDL
  active: boolean;
  canceled: boolean;
  fundsWithdrawn: boolean; // camelCase version of funds_withdrawn from IDL
}

// This is a more complete IDL based on your crowdfunding.json
const IDL: Idl = {
  version: "0.1.0",
  name: "crowdfunding",
  instructions: [
    {
      name: "createCampaign",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "creator", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "title", type: "string" },
        { name: "description", type: "string" },
        { name: "goal", type: "u64" },
        { name: "duration", type: "i64" },
      ],
    },
    {
      name: "pledge",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "backer", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
    {
      name: "endCampaign",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "creator", isMut: true, isSigner: true },
      ],
      args: [],
    },
    {
      name: "cancelCampaign",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "creator", isMut: true, isSigner: true },
      ],
      args: [],
    },
    {
      name: "withdrawFunds",
      accounts: [
        { name: "campaign", isMut: true, isSigner: false },
        { name: "creator", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "Campaign",
      type: {
        kind: "struct",
        fields: [
          { name: "creator", type: "publicKey" },
          { name: "title", type: "string" },
          { name: "description", type: "string" },
          { name: "goal", type: "u64" },
          { name: "raised", type: "u64" },
          { name: "backers", type: "u64" },
          { name: "createdAt", type: "i64" },
          { name: "endsAt", type: "i64" },
          { name: "active", type: "bool" },
          { name: "canceled", type: "bool" },
          { name: "fundsWithdrawn", type: "bool" },
        ],
      },
    },
  ],
  events: [
    {
      name: "CancelEvent",
      fields: [{ name: "campaign", type: "publicKey", index: false }],
    },
    {
      name: "GoalReachedEvent",
      fields: [
        { name: "campaign", type: "publicKey", index: false },
        { name: "goal", type: "u64", index: false },
        { name: "raised", type: "u64", index: false },
      ],
    },
    {
      name: "PledgeEvent",
      fields: [
        { name: "campaign", type: "publicKey", index: false },
        { name: "backer", type: "publicKey", index: false },
        { name: "amount", type: "u64", index: false },
      ],
    },
    {
      name: "WithdrawEvent",
      fields: [
        { name: "campaign", type: "publicKey", index: false },
        { name: "creator", type: "publicKey", index: false },
        { name: "amount", type: "u64", index: false },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "CampaignNotActive",
      msg: "Campaign is not active, canceled, or has ended",
    },
    {
      code: 6001,
      name: "Unauthorized",
      msg: "Unauthorized: Only the creator can perform this action",
    },
    { code: 6002, name: "InvalidInput", msg: "Invalid input parameters" },
    {
      code: 6003,
      name: "FundsAlreadyWithdrawn",
      msg: "Funds have already been withdrawn",
    },
    {
      code: 6004,
      name: "InsufficientFunds",
      msg: "Insufficient funds for operation",
    },
  ],
};

const PROGRAM_ID = new PublicKey(
  "Gntdfwnopf3u53vU7MLZhdGLY7o8B5eaokpuXkwbgoPg"
);
console.log("PROGRAM_ID: ", PROGRAM_ID.toString());

// Mock campaigns for development fallback
const mockCampaigns = [
  {
    id: "campaign1",
    title: "Decentralized Art Gallery",
    description:
      "Building a virtual gallery for NFT artists to showcase their work with immersive experiences.",
    creator: "8Kw7UrFzqFU8j7ESoKAPb1EqJ2WJ3GhvPBTpwxwK7GLi",
    goal: 10,
    raised: 6.5,
    backers: 24,
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    endsAt: Date.now() + 15 * 24 * 60 * 60 * 1000,
    active: true,
    canceled: false,
    fundsWithdrawn: false,
  },
  {
    id: "campaign2",
    title: "Solana Educational Platform",
    description:
      "Creating interactive tutorials and courses to help developers learn Solana blockchain development.",
    creator: "8Kw7UrFzqFU8j7ESoKAPb1EqJ2WJ3GhvPBTpwxwK7GLi",
    goal: 20,
    raised: 12.8,
    backers: 56,
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    endsAt: Date.now() + 10 * 24 * 60 * 60 * 1000,
    active: true,
    canceled: false,
    fundsWithdrawn: false,
  },
  {
    id: "campaign3",
    title: "DeFi Analytics Dashboard",
    description:
      "Building a comprehensive analytics dashboard for Solana DeFi protocols with real-time data visualization.",
    creator: "5FHwkrdxkRZxNWKEcKy9rgPP3aTtMGWuABJhQhQjQnQA",
    goal: 15,
    raised: 9.2,
    backers: 37,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    endsAt: Date.now() + 20 * 24 * 60 * 60 * 1000,
    active: true,
    canceled: false,
    fundsWithdrawn: false,
  },
];

export function useAnchorProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<Program | null>(null);

  useEffect(() => {
    if (!wallet) return;

    try {
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
      });

      const program = new Program(IDL, PROGRAM_ID, provider);
      setProgram(program);
      console.log(
        "Program initialized successfully with ID:",
        PROGRAM_ID.toString()
      );
    } catch (error) {
      console.error("Error initializing Anchor program:", error);
    }
  }, [connection, wallet]);

  return program;
}

export async function createCampaign(
  program: Program,
  title: string,
  description: string,
  goal: number,
  durationDays: number
) {
  if (!program || !program.provider.publicKey) {
    throw new Error("Wallet not connected");
  }

  const [campaignPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("campaign"),
      program.provider.publicKey.toBuffer(),
      Buffer.from(title),
    ],
    PROGRAM_ID // Use the same PROGRAM_ID constant here
  );

  const goalLamports = new BN(goal * LAMPORTS_PER_SOL);
  const durationSeconds = new BN(durationDays * 24 * 60 * 60);

  try {
    console.log("Creating campaign with:", {
      title,
      description,
      goal: goalLamports.toString(),
      duration: durationSeconds.toString(),
      campaignPda: campaignPda.toString(),
      creator: program.provider.publicKey.toString(),
      programId: program.programId.toString(),
    });

    const tx = await program.methods
      .createCampaign(title, description, goalLamports, durationSeconds)
      .accounts({
        campaign: campaignPda,
        creator: program.provider.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Campaign created with transaction signature", tx);
    return campaignPda.toString();
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
}

export async function pledgeToCampaign(
  program: Program,
  campaignAddress: string,
  amount: number
) {
  if (!program || !program.provider.publicKey) {
    throw new Error("Wallet not connected");
  }

  const campaignPubkey = new PublicKey(campaignAddress);
  const amountLamports = new BN(amount * LAMPORTS_PER_SOL);

  try {
    const tx = await program.methods
      .pledge(amountLamports)
      .accounts({
        campaign: campaignPubkey,
        backer: program.provider.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Pledge successful with transaction signature", tx);
    return tx;
  } catch (error) {
    console.error("Error pledging to campaign:", error);
    throw error;
  }
}

export async function endCampaign(program: Program, campaignAddress: string) {
  if (!program || !program.provider.publicKey) {
    throw new Error("Wallet not connected");
  }

  const campaignPubkey = new PublicKey(campaignAddress);

  try {
    const tx = await program.methods
      .endCampaign()
      .accounts({
        campaign: campaignPubkey,
        creator: program.provider.publicKey,
      })
      .rpc();

    console.log("Campaign ended with transaction signature", tx);
    return tx;
  } catch (error) {
    console.error("Error ending campaign:", error);
    throw error;
  }
}

export async function cancelCampaign(
  program: Program,
  campaignAddress: string
) {
  if (!program || !program.provider.publicKey) {
    throw new Error("Wallet not connected");
  }

  const campaignPubkey = new PublicKey(campaignAddress);

  try {
    const tx = await program.methods
      .cancelCampaign()
      .accounts({
        campaign: campaignPubkey,
        creator: program.provider.publicKey,
      })
      .rpc();

    console.log("Campaign cancelled with transaction signature", tx);
    return tx;
  } catch (error) {
    console.error("Error cancelling campaign:", error);
    throw error;
  }
}

export async function withdrawFunds(program: Program, campaignAddress: string) {
  if (!program || !program.provider.publicKey) {
    throw new Error("Wallet not connected");
  }

  const campaignPubkey = new PublicKey(campaignAddress);

  try {
    const tx = await program.methods
      .withdrawFunds()
      .accounts({
        campaign: campaignPubkey,
        creator: program.provider.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Funds withdrawn with transaction signature", tx);
    return tx;
  } catch (error) {
    console.error("Error withdrawing funds:", error);
    throw error;
  }
}

export async function fetchCampaign(
  program: Program,
  campaignAddress: string
): Promise<Campaign> {
  if (!program) {
    throw new Error("Program not initialized");
  }

  try {
    const campaignPubkey = new PublicKey(campaignAddress);

    // Use real blockchain data
    const account = (await program.account.campaign.fetch(
      campaignPubkey
    )) as unknown as CampaignAccount;
    return {
      id: campaignAddress,
      title: account.title,
      description: account.description,
      creator: account.creator.toString(),
      goal: account.goal.toNumber() / LAMPORTS_PER_SOL,
      raised: account.raised.toNumber() / LAMPORTS_PER_SOL,
      backers: account.backers.toNumber(),
      createdAt: account.createdAt.toNumber() * 1000, // Convert to milliseconds
      endsAt: account.endsAt.toNumber() * 1000, // Convert to milliseconds
      active: account.active,
      canceled: account.canceled,
      fundsWithdrawn: account.fundsWithdrawn,
    };
  } catch (error) {
    console.error("Error fetching campaign:", error);

    // Fallback to mock data if there's an error
    const mockCampaign = mockCampaigns.find((c) => c.id === campaignAddress);
    if (!mockCampaign) {
      throw new Error("Campaign not found");
    }
    return mockCampaign;
  }
}

export async function fetchAllCampaigns(program: Program): Promise<Campaign[]> {
  if (!program) {
    console.log("Program not initialized, returning mock data");
    return mockCampaigns;
  }

  try {
    // Use real blockchain data
    const accounts = await program.account.campaign.all();
    // Map each account to your Campaign interface
    return accounts.map((account) => {
      const data = account.account as unknown as CampaignAccount;
      return {
        id: account.publicKey.toString(),
        title: data.title,
        description: data.description,
        creator: data.creator.toString(),
        goal: data.goal.toNumber() / LAMPORTS_PER_SOL,
        raised: data.raised.toNumber() / LAMPORTS_PER_SOL,
        backers: data.backers.toNumber(),
        createdAt: data.createdAt.toNumber() * 1000, // Convert to milliseconds
        endsAt: data.endsAt.toNumber() * 1000, // Convert to milliseconds
        active: data.active,
        canceled: data.canceled,
        fundsWithdrawn: data.fundsWithdrawn,
      };
    });
  } catch (error) {
    console.error("Error fetching all campaigns:", error);
    return mockCampaigns; // Return mock data on error
  }
}

export async function fetchUserCampaigns(
  program: Program,
  walletAddress: string
) {
  if (!program) {
    console.log("Program not initialized, returning mock data");
    return mockCampaigns.filter(
      (campaign) => campaign.creator === walletAddress
    );
  }

  try {
    // Use real blockchain data
    const allCampaigns = await fetchAllCampaigns(program);
    return allCampaigns.filter(
      (campaign) => campaign.creator === walletAddress
    );
  } catch (error) {
    console.error("Error fetching user campaigns:", error);
    return mockCampaigns.filter(
      (campaign) => campaign.creator === walletAddress
    ); // Return filtered mock data on error
  }
}
