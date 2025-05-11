# SolStream - Decentralized Crowdfunding with Streaming Payments

![SolStream Banner](/placeholder.svg?height=300&width=800)

[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com/)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Streamflow](https://img.shields.io/badge/Streamflow-Protocol-blue?style=for-the-badge)](https://streamflow.finance/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

SolStream is a decentralized crowdfunding platform built on Solana that enables creators to raise funds through both traditional one-time pledges and innovative streaming payments. By leveraging Solana's speed and low transaction costs, SolStream provides a transparent, efficient, and flexible funding experience for both creators and backers.

## 🌟 Features

### For Creators
- **Campaign Creation**: Launch customizable funding campaigns with detailed descriptions, funding goals, and durations
- **Transparent Funding**: Track pledges and streaming payments in real-time on the Solana blockchain
- **Fund Management**: Withdraw funds once campaigns end successfully
- **Campaign Controls**: End or cancel campaigns as needed

### For Backers
- **Flexible Support Options**: Choose between one-time pledges or continuous streaming payments
- **Streaming Payments**: Support creators with pay-per-second micropayments using Streamflow Protocol
- **Payment Control**: Cancel streaming payments at any time, keeping remaining funds
- **Campaign Discovery**: Browse and filter campaigns to find projects that align with your interests

### Platform Features
- **Solana Integration**: Fast, low-cost transactions on the Solana blockchain
- **Wallet Connectivity**: Seamless integration with popular Solana wallets (Phantom, Solflare)
- **Responsive Design**: Fully responsive interface that works on desktop and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes

## 🚀 Technologies

- **Blockchain**: Solana, Anchor Framework
- **Frontend**: Next.js, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Wallet Integration**: Solana Wallet Adapter
- **Streaming Payments**: Streamflow Protocol
- **State Management**: React Hooks

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or later)
- npm or yarn
- A Solana wallet (Phantom, Solflare, etc.)
- Solana CLI tools (optional, for development)

## 🔧 Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/solstream.git
   cd solstream
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_PROGRAM_ID=BYTpfCh7SyGQWzGv24aE5G2r5vD1stRj3dRZ8LTe3SF4
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 💻 Usage Guide

### Setting Up Your Wallet

1. Install a Solana wallet extension (Phantom, Solflare, or Backpack)
2. Create a new wallet or import an existing one
3. Switch to the Solana devnet network in your wallet settings
4. Get some devnet SOL from a [Solana faucet](https://solfaucet.com/)

### Creating a Campaign

1. Connect your wallet using the "Connect Wallet" button in the header
2. Navigate to the "Create" page
3. Fill in your campaign details:
   - Title: A clear, attention-grabbing title
   - Description: Detailed information about your project
   - Funding Goal: Amount of SOL you aim to raise
   - Duration: Number of days your campaign will run
4. Click "Create Campaign" to launch your campaign on the Solana blockchain

### Supporting a Campaign

1. Browse campaigns on the "Explore" page
2. Click on a campaign to view details
3. Connect your wallet if not already connected
4. Choose your support method:
   - **One-time Pledge**: Enter an amount and click "Pledge Now"
   - **Streaming Payment**: Enter a total amount and duration, then click "Start Streaming"
5. Approve the transaction in your wallet

### Managing Your Campaigns and Pledges

1. Navigate to the "Dashboard" page
2. View your created campaigns under "My Campaigns"
   - End, cancel, or withdraw funds from your campaigns
3. View your pledges under "My Pledges"
4. Manage your streaming payments under "Streaming Payments"
   - Cancel active streams if needed

## 📁 Project Structure

\`\`\`
solstream/
├── app/                  # Next.js app directory
│   ├── campaigns/        # Campaign pages
│   ├── create/           # Campaign creation page
│   ├── dashboard/        # User dashboard page
│   ├── onboarding/       # Onboarding guide page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/               # UI components (shadcn)
│   ├── campaign-*.tsx    # Campaign-related components
│   ├── user-*.tsx        # User-related components
│   └── ...               # Other components
├── lib/                  # Utility functions and types
│   ├── anchor-client.ts  # Solana/Anchor client
│   ├── api.ts            # API functions
│   ├── streamflow-client.ts # Streamflow integration
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
├── public/               # Static assets
├── .env.local            # Environment variables
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
\`\`\`

## 🖼️ Screenshots

### Home Page
![Home Page](/placeholder.svg?height=200&width=400)

### Campaign Details
![Campaign Details](/placeholder.svg?height=200&width=400)

### Dashboard
![Dashboard](/placeholder.svg?height=200&width=400)

### Create Campaign
![Create Campaign](/placeholder.svg?height=200&width=400)

## 🔄 Solana Program

The Solana program (smart contract) for SolStream is built using the Anchor framework and includes the following functionality:

- Campaign creation and management
- Pledge processing
- Fund withdrawal
- Campaign status updates (end/cancel)

The program ID is: `BYTpfCh7SyGQWzGv24aE5G2r5vD1stRj3dRZ8LTe3SF4`

## 🌊 Streamflow Integration

SolStream uses the Streamflow Protocol to enable streaming payments. Key features include:

- Pay-per-second micropayments
- Automatic fund distribution
- Cancellable streams with refunds
- Real-time payment tracking

## 🛣️ Roadmap

- [ ] Campaign categories and tags
- [ ] Campaign image uploads
- [ ] Social sharing functionality
- [ ] Campaign updates and comments
- [ ] Campaign verification badges
- [ ] Advanced analytics dashboard
- [ ] Mobile app version
- [ ] Mainnet deployment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Solana](https://solana.com/) - Blockchain platform
- [Anchor](https://project-serum.github.io/anchor/) - Framework for Solana program development
- [Streamflow](https://streamflow.finance/) - Streaming payment protocol
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Next.js](https://nextjs.org/) - React framework

---

<p align="center">
  Built with ❤️ for the Solana ecosystem
</p>
