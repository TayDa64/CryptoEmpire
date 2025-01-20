import { useState, useEffect } from 'react'
import { GameState, Asset, Location, Event, Achievement, Notification, MiningOperation, MarketTrend } from '../types/game'
import { initialAssets, locations, events, initialAchievements } from '../data/gameData'

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>({
    assets: initialAssets,
    currentLocation: locations[0],
    funds: 10000,
    selectedAsset: null,
    tradeQuantity: 0,
    level: 1,
    experience: 0,
    currentEvent: null,
    achievements: initialAchievements,
    totalTrades: 0,
    notifications: [],
    miningOperations: [],
    marketTrends: initialAssets.map(asset => ({
      assetId: asset.id,
      trend: 'stable' as const,
      strength: 0
    })),
  })

  useEffect(() => {
    const priceInterval = setInterval(() => {
      updatePrices()
      updateMarketTrends()
    }, 5000)

    const eventInterval = setInterval(() => {
      triggerRandomEvent()
    }, 30000)

    return () => {
      clearInterval(priceInterval)
      clearInterval(eventInterval)
    }
  }, [])

  useEffect(() => {
    checkAchievements()
  }, [gameState.funds, gameState.assets, gameState.totalTrades])

  const updatePrices = () => {
    setGameState(prevState => ({
      ...prevState,
      assets: prevState.assets.map(asset => {
        const trend = prevState.marketTrends.find(t => t.assetId === asset.id)
        const trendMultiplier = trend ? (trend.trend === 'up' ? 1 : trend.trend === 'down' ? -1 : 0) * (trend.strength / 10) : 0
        const randomFactor = (Math.random() - 0.5) * 0.1
        const priceChange = asset.price * (randomFactor + trendMultiplier)
        return {
          ...asset,
          price: Math.max(1, asset.price + priceChange)
        }
      })
    }))
  }

  const updateMarketTrends = () => {
    setGameState(prevState => ({
      ...prevState,
      marketTrends: prevState.assets.map(asset => ({
        assetId: asset.id,
        trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable' as const,
        strength: Math.floor(Math.random() * 5) + 1
      }))
    }))
  }

  const triggerRandomEvent = () => {
    const randomEvent = events[Math.floor(Math.random() * events.length)]
    setGameState(prevState => ({
      ...prevState,
      currentEvent: randomEvent,
      assets: randomEvent.effect(prevState.assets)
    }))
    addNotification(randomEvent.name, randomEvent.description, 'warning')
    setTimeout(() => setGameState(prevState => ({ ...prevState, currentEvent: null })), 5000)
  }

  const handleLocationChange = (locationId: string) => {
    const newLocation = locations.find(loc => loc.id === locationId)
    if (newLocation) {
      setGameState(prevState => ({
        ...prevState,
        currentLocation: newLocation,
        assets: prevState.assets.map(asset => ({
          ...asset,
          price: asset.price * newLocation.priceMultiplier
        }))
      }))
      addNotification('Location Changed', `You've moved to ${newLocation.name}`, 'info')
    }
  }

  const handleAssetSelect = (assetId: string) => {
    const asset = gameState.assets.find(a => a.id === assetId)
    if (asset) {
      setGameState(prevState => ({
        ...prevState,
        selectedAsset: asset,
        tradeQuantity: 0
      }))
    }
  }

  const handleTrade = (isBuying: boolean) => {
    if (!gameState.selectedAsset) return

    const cost = gameState.selectedAsset.price * gameState.tradeQuantity
    if (isBuying && cost > gameState.funds) {
      addNotification('Trade Failed', "Not enough funds!", 'error')
      return
    }

    if (!isBuying && gameState.tradeQuantity > (gameState.selectedAsset.quantity || 0)) {
      addNotification('Trade Failed', "Not enough assets to sell!", 'error')
      return
    }

    setGameState(prevState => {
      const newAssets = prevState.assets.map(asset => 
        asset.id === prevState.selectedAsset!.id
          ? { ...asset, quantity: asset.quantity + (isBuying ? prevState.tradeQuantity : -prevState.tradeQuantity) }
          : asset
      )

      const newFunds = prevState.funds + (isBuying ? -cost : cost)
      const newTotalTrades = prevState.totalTrades + 1

      // Add experience and level up
      const expGained = Math.floor(cost / 100)
      const newExperience = prevState.experience + expGained
      let newLevel = prevState.level
      let finalExperience = newExperience

      if (newExperience >= prevState.level * 1000) {
        newLevel = prevState.level + 1
        finalExperience = newExperience - prevState.level * 1000
        addNotification('Level Up!', `You've reached level ${newLevel}!`, 'success')
      }

      return {
        ...prevState,
        assets: newAssets,
        funds: newFunds,
        tradeQuantity: 0,
        totalTrades: newTotalTrades,
        level: newLevel,
        experience: finalExperience
      }
    })

    addNotification('Trade Successful', `${isBuying ? 'Bought' : 'Sold'} ${gameState.tradeQuantity} ${gameState.selectedAsset.name}`, 'success')
  }

  const handleCraft = (assetId: string) => {
    const craftableAsset = gameState.assets.find(a => a.id === assetId && a.isCraftable)
    if (!craftableAsset || !craftableAsset.ingredients) return

    const canCraft = Object.entries(craftableAsset.ingredients).every(([id, required]) => {
      const asset = gameState.assets.find(a => a.id === id)
      return asset && asset.quantity >= required
    })

    if (!canCraft) {
      addNotification('Crafting Failed', "Not enough ingredients!", 'error')
      return
    }

    setGameState(prevState => ({
      ...prevState,
      assets: prevState.assets.map(asset => {
        if (asset.id === assetId) {
          return { ...asset, quantity: asset.quantity + 1 }
        }
        if (craftableAsset.ingredients && craftableAsset.ingredients[asset.id]) {
          return { ...asset, quantity: asset.quantity - craftableAsset.ingredients[asset.id] }
        }
        return asset
      })
    }))

    addNotification('Crafting Successful', `Crafted 1 ${craftableAsset.name}`, 'success')
  }

  const startMining = (assetId: string) => {
    const miningAsset = gameState.assets.find(a => a.id === assetId)
    if (!miningAsset) return

    let duration = 0
    let reward = 0

    switch (assetId) {
      case 'gpu':
        duration = 60000 // 1 minute
        reward = 0.0001 // 0.0001 BTC
        break
      case 'asic':
        duration = 30000 // 30 seconds
        reward = 0.0005 // 0.0005 BTC
        break
      case 'miningRig':
        duration = 15000 // 15 seconds
        reward = 0.001 // 0.001 BTC
        break
      default:
        return
    }

    const newOperation: MiningOperation = {
      assetId,
      startTime: Date.now(),
      duration,
    }

    setGameState(prevState => ({
      ...prevState,
      miningOperations: [...prevState.miningOperations, newOperation]
    }))

    setTimeout(() => {
      setGameState(prevState => {
        const updatedAssets = prevState.assets.map(asset => 
          asset.id === 'btc' ? { ...asset, quantity: asset.quantity + reward } : asset
        )
        const updatedOperations = prevState.miningOperations.filter(op => op !== newOperation)
        addNotification('Mining Complete', `Mined ${reward} BTC with your ${miningAsset.name}`, 'success')
        return {
          ...prevState,
          assets: updatedAssets,
          miningOperations: updatedOperations
        }
      })
    }, duration)
  }

  const checkAchievements = () => {
    setGameState(prevState => ({
      ...prevState,
      achievements: prevState.achievements.map(achievement => {
        if (!achievement.achieved && achievement.condition(prevState)) {
          addNotification('Achievement Unlocked!', achievement.name, 'success')
          return { ...achievement, achieved: true }
        }
        return achievement
      })
    }))
  }

  const addNotification = (title: string, message: string, type: Notification['type']) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message: `${title}: ${message}`,
      type
    }
    setGameState(prevState => ({
      ...prevState,
      notifications: [newNotification, ...prevState.notifications].slice(0, 5)
    }))
  }

  const setTradeQuantity = (quantity: number) => {
    setGameState(prevState => ({ ...prevState, tradeQuantity: quantity }))
  }

  return {
    gameState,
    handleLocationChange,
    handleAssetSelect,
    handleTrade,
    handleCraft,
    setTradeQuantity,
    startMining,
  }
}

