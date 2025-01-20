// ... (previous types remain unchanged)

export interface MiningOperation {
  assetId: string
  startTime: number
  duration: number
}

export interface MarketTrend {
  assetId: string
  trend: 'up' | 'down' | 'stable'
  strength: number // 1-5, with 5 being the strongest trend
}

export interface GameState {
  // ... (previous properties remain unchanged)
  miningOperations: MiningOperation[]
  marketTrends: MarketTrend[]
}

