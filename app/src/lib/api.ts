import type {
  Campaign,
  Pledge,
  Stream,
  CampaignStats,
  CampaignUpdate,
  CreateCampaignParams,
} from "./types";
import {
  createCampaign as anchorCreateCampaign,
  pledgeToCampaign as anchorPledgeToCampaign,
  endCampaign as anchorEndCampaign,
  cancelCampaign as anchorCancelCampaign,
  withdrawFunds as anchorWithdrawFunds,
  fetchCampaign as anchorFetchCampaign,
  fetchAllCampaigns as anchorFetchAllCampaigns,
  fetchUserCampaigns as anchorFetchUserCampaigns,
} from "./anchor-client";

// Mock data for parts that aren't implemented yet in the blockchain
const mockCampaignStats: CampaignStats = {
  totalPledged: 6.5,
  backers: 24,
  streamingPayments: 3,
  dailyFunding: [
    { date: "May 1", amount: 0.5 },
    { date: "May 2", amount: 1.2 },
    { date: "May 3", amount: 0.8 },
    { date: "May 4", amount: 1.5 },
    { date: "May 5", amount: 0.9 },
    { date: "May 6", amount: 1.1 },
    { date: "May 7", amount: 0.5 },
  ],
};

const mockCampaignUpdates: CampaignUpdate[] = [
  {
    id: "update1",
    campaignId: "campaign1",
    title: "First milestone reached!",
    content:
      "We're excited to announce that we've reached our first milestone! The basic structure of the virtual gallery is now complete, and we're starting to work on the immersive experience features.\n\nThank you to all our backers for your support!",
    date: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: "update2",
    campaignId: "campaign1",
    title: "New partnership announcement",
    content:
      "We've partnered with a leading NFT marketplace to integrate their API into our gallery. This will allow artists to easily import their existing collections and showcase them in our virtual space.\n\nStay tuned for more updates!",
    date: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
];

const mockPledges: Pledge[] = [
  {
    id: "pledge1",
    campaignId: "campaign1",
    campaignTitle: "Decentralized Art Gallery",
    backer: "8Kw7UrFzqFU8j7ESoKAPb1EqJ2WJ3GhvPBTpwxwK7GLi",
    amount: 1.5,
    date: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: "pledge2",
    campaignId: "campaign2",
    campaignTitle: "Solana Educational Platform",
    backer: "8Kw7UrFzqFU8j7ESoKAPb1EqJ2WJ3GhvPBTpwxwK7GLi",
    amount: 2.0,
    date: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
];

const mockStreams: Stream[] = [
  {
    id: "stream1",
    campaignId: "campaign1",
    campaignTitle: "Decentralized Art Gallery",
    sender: "8Kw7UrFzqFU8j7ESoKAPb1EqJ2WJ3GhvPBTpwxwK7GLi",
    recipient: "5FHwkrdxkRZxNWKEcKy9rgPP3aTtMGWuABJhQhQjQnQA",
    totalAmount: 5.0,
    streamedAmount: 2.5,
    startTime: Date.now() - 15 * 24 * 60 * 60 * 1000,
    endTime: Date.now() + 15 * 24 * 60 * 60 * 1000,
    status: "active",
  },
];

// API functions that use the Anchor client
export async function fetchCampaigns(program: any): Promise<Campaign[]> {
  try {
    return await anchorFetchAllCampaigns(program);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return [];
  }
}

export async function fetchCampaignById(
  program: any,
  id: string
): Promise<Campaign | null> {
  try {
    return await anchorFetchCampaign(program, id);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return null;
  }
}

export async function fetchCampaignStats(id: string): Promise<CampaignStats> {
  // In a real implementation, this would fetch from the blockchain
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCampaignStats), 1000);
  });
}

export async function fetchCampaignUpdates(
  id: string
): Promise<CampaignUpdate[]> {
  // In a real implementation, this would fetch from the blockchain
  return new Promise((resolve) => {
    setTimeout(() => {
      const updates = mockCampaignUpdates.filter((u) => u.campaignId === id);
      resolve(updates);
    }, 1000);
  });
}

export async function fetchUserCampaigns(
  program: any,
  walletAddress: string
): Promise<Campaign[]> {
  try {
    return await anchorFetchUserCampaigns(program, walletAddress);
  } catch (error) {
    console.error("Error fetching user campaigns:", error);
    return [];
  }
}

export async function fetchUserPledges(
  walletAddress: string
): Promise<Pledge[]> {
  // In a real implementation, this would fetch from the blockchain
  return new Promise((resolve) => {
    setTimeout(() => {
      const pledges = mockPledges.filter((p) => p.backer === walletAddress);
      resolve(pledges);
    }, 1000);
  });
}

export async function fetchUserStreams(
  walletAddress: string
): Promise<Stream[]> {
  // In a real implementation, this would fetch from the blockchain
  return new Promise((resolve) => {
    setTimeout(() => {
      const streams = mockStreams.filter((s) => s.sender === walletAddress);
      resolve(streams);
    }, 1000);
  });
}

export async function createCampaign(
  program: any,
  params: CreateCampaignParams
): Promise<string> {
  if (!program) throw new Error("Program not initialized");

  try {
    return await anchorCreateCampaign(
      program,
      params.title,
      params.description,
      params.goal,
      params.duration
    );
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
}

export async function pledgeToCampaign(
  program: any,
  campaignId: string,
  amount: number
): Promise<string> {
  if (!program) throw new Error("Program not initialized");

  try {
    return await anchorPledgeToCampaign(program, campaignId, amount);
  } catch (error) {
    console.error("Error pledging to campaign:", error);
    throw error;
  }
}

export async function endCampaign(
  program: any,
  campaignId: string
): Promise<string> {
  if (!program) throw new Error("Program not initialized");

  try {
    return await anchorEndCampaign(program, campaignId);
  } catch (error) {
    console.error("Error ending campaign:", error);
    throw error;
  }
}

export async function cancelCampaign(
  program: any,
  campaignId: string
): Promise<string> {
  if (!program) throw new Error("Program not initialized");

  try {
    return await anchorCancelCampaign(program, campaignId);
  } catch (error) {
    console.error("Error cancelling campaign:", error);
    throw error;
  }
}

export async function withdrawFunds(
  program: any,
  campaignId: string
): Promise<string> {
  if (!program) throw new Error("Program not initialized");

  try {
    return await anchorWithdrawFunds(program, campaignId);
  } catch (error) {
    console.error("Error withdrawing funds:", error);
    throw error;
  }
}

export async function createStreamingPayment(
  campaignId: string,
  amount: number,
  durationDays: number
): Promise<void> {
  // In a real implementation, this would use Streamflow SDK
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock streaming payment creation
      resolve();
    }, 1500);
  });
}

export async function cancelStream(streamId: string): Promise<void> {
  // In a real implementation, this would use Streamflow SDK
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock stream cancellation
      resolve();
    }, 1500);
  });
}
