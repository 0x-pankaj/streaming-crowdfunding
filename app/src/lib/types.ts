export interface Campaign {
  id: string;
  title: string;
  description: string;
  creator: string;
  goal: number;
  raised: number;
  backers: number;
  createdAt: number;
  endsAt: number;
  active: boolean;
  canceled: boolean;
  fundsWithdrawn: boolean;
}

export interface Pledge {
  id: string;
  campaignId: string;
  campaignTitle: string;
  backer: string;
  amount: number;
  date: number;
}

export interface Stream {
  id: string;
  campaignId: string;
  campaignTitle: string;
  sender: string;
  recipient: string;
  totalAmount: number;
  streamedAmount: number;
  startTime: number;
  endTime: number;
  status: "active" | "completed" | "canceled";
}

export interface CampaignStats {
  totalPledged: number;
  backers: number;
  streamingPayments: number;
  dailyFunding: Array<{
    date: string;
    amount: number;
  }>;
}

export interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  date: number;
}

export interface CreateCampaignParams {
  title: string;
  description: string;
  goal: number;
  duration: number;
}

export interface WithdrawEvent {
  campaignId: string;
  creator: string;
  amount: number;
  timestamp: number;
}
