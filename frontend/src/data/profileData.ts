export interface ProfileStaticData {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  action?: string;
}

export const profileStaticData: ProfileStaticData[] = [
  {
    id: 'garage',
    label: 'Sui Garage',
    description: 'Your learning hub for Sui development',
    icon: '🏗️',
    color: '#FF6B9D',
    action: 'lesson'
  },
  {
    id: 'status',
    label: 'Character Card',
    description: 'Create your first NFT smart contract',
    icon: '⚡',
    color: '#4ECDC4',
    action: 'lesson'
  },
  {
    id: 'wallet',
    label: 'NFT & Visual Ownership',
    description: 'Learn about NFT creation and visual assets',
    icon: '🎨',
    color: '#1E90FF',
    action: 'lesson'
  },
  {
    id: 'balance',
    label: 'Balance',
    description: 'Your Sui token balance',
    icon: '💰',
    color: '#FFD700'
  },
  {
    id: 'transactions',
    label: 'Transactions',
    description: 'Your on-chain activities',
    icon: '📊',
    color: '#00FF88'
  },
  {
    id: 'nfts',
    label: 'NFTs Owned',
    description: 'Your digital collectibles',
    icon: '🎨',
    color: '#FF8C00'
  },
  {
    id: 'connected',
    label: 'Connected Since',
    description: 'When you first connected',
    icon: '⏰',
    color: '#9370DB'
  },
  {
    id: 'activity',
    label: 'Last Activity',
    description: 'Your most recent action',
    icon: '📍',
    color: '#FF4500'
  }
];
