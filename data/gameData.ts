import { Asset, Location, Event, Achievement } from '../types/game'

export const initialAssets: Asset[] = [
  { id: 'btc', name: 'Bitcoin', quantity: 1, price: 30000 },
  { id: 'eth', name: 'Ethereum', quantity: 5, price: 2000 },
  { id: 'nft1', name: 'Virtual Real Estate', quantity: 0, price: 5000, isNFT: true },
  { id: 'nft2', name: 'Crypto Art', quantity: 0, price: 1000, isNFT: true },
  { id: 'gpu', name: 'GPU', quantity: 0, price: 500 },
  { id: 'asic', name: 'ASIC Miner', quantity: 0, price: 2000 },
  { id: 'miningRig', name: 'Mining Rig', quantity: 0, price: 5000, isCraftable: true, ingredients: { gpu: 4, asic: 1 } },
]

export const locations: Location[] = [
  { id: 'market1', name: 'Crypto Exchange', priceMultiplier: 1 },
  { id: 'market2', name: 'NFT Marketplace', priceMultiplier: 1.2 },
  { id: 'market3', name: 'DeFi Platform', priceMultiplier: 0.9 },
  { id: 'market4', name: 'Mining Equipment Store', priceMultiplier: 1.1 },
]

export const events: Event[] = [
  {
    id: 'bull_run',
    name: 'Bull Run',
    description: 'A sudden surge in crypto prices!',
    effect: (assets) => assets.map(asset => ({ ...asset, price: asset.price * 1.5 }))
  },
  {
    id: 'market_crash',
    name: 'Market Crash',
    description: 'Crypto prices are plummeting!',
    effect: (assets) => assets.map(asset => ({ ...asset, price: asset.price * 0.6 }))
  },
  {
    id: 'nft_boom',
    name: 'NFT Boom',
    description: 'NFTs are gaining popularity!',
    effect: (assets) => assets.map(asset => asset.isNFT ? { ...asset, price: asset.price * 2 } : asset)
  },
  {
    id: 'mining_difficulty',
    name: 'Mining Difficulty Increase',
    description: 'Mining equipment is less effective!',
    effect: (assets) => assets.map(asset => 
      asset.id === 'gpu' || asset.id === 'asic' || asset.id === 'miningRig' 
        ? { ...asset, price: asset.price * 0.8 } 
        : asset
    )
  },
]

export const initialAchievements: Achievement[] = [
  {
    id: 'first_trade',
    name: 'First Trade',
    description: 'Complete your first trade',
    condition: (state) => state.totalTrades > 0,
    achieved: false
  },
  {
    id: 'crypto_millionaire',
    name: 'Crypto Millionaire',
    description: 'Accumulate over $1,000,000 in funds',
    condition: (state) => state.funds > 1000000,
    achieved: false
  },
  {
    id: 'nft_collector',
    name: 'NFT Collector',
    description: 'Own at least 5 NFTs',
    condition: (state) => state.assets.filter(a => a.isNFT).reduce((sum, a) => sum + a.quantity, 0) >= 5,
    achieved: false
  },
  {
    id: 'master_crafter',
    name: 'Master Crafter',
    description: 'Craft your first Mining Rig',
    condition: (state) => state.assets.find(a => a.id === 'miningRig')?.quantity > 0,
    achieved: false
  },
]

