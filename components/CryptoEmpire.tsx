'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { AppleStyleDock } from "./AppleStyleDock"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useGameLogic } from '../hooks/useGameLogic'
import { locations } from '../data/gameData'

export default function CryptoEmpire() {
  const { gameState, handleLocationChange, handleAssetSelect, handleTrade, handleCraft, setTradeQuantity, startMining } = useGameLogic()

  return (
    <Card className="w-full max-w-4xl bg-black border-green-500 text-green-500">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-green-500">CryptoEmpire</CardTitle>
        <CardDescription className="text-green-300">Build your virtual crypto business empire!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="main">Main</TabsTrigger>
            <TabsTrigger value="craft">Craft</TabsTrigger>
            <TabsTrigger value="mine">Mine</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="main">
            {gameState.currentEvent && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{gameState.currentEvent.name}</AlertTitle>
                <AlertDescription>{gameState.currentEvent.description}</AlertDescription>
              </Alert>
            )}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">Level: {gameState.level}</p>
                <Progress value={(gameState.experience / (gameState.level * 1000)) * 100} className="w-32 h-2" />
              </div>
              <p className="text-lg font-semibold">Funds: ${gameState.funds.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-500">Current Location: {gameState.currentLocation.name}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {locations.map(location => (
                  <Button
                    key={location.id}
                    onClick={() => handleLocationChange(location.id)}
                    variant={gameState.currentLocation.id === location.id ? "default" : "outline"}
                    className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
                  >
                    {location.name}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-500">Your Assets</h3>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {gameState.assets.map(asset => (
                  <Button
                    key={asset.id}
                    onClick={() => handleAssetSelect(asset.id)}
                    variant={gameState.selectedAsset?.id === asset.id ? "default" : "outline"}
                    className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
                  >
                    {asset.name}: {asset.quantity}
                    <br />
                    ${asset.price.toFixed(2)}
                    {asset.isNFT && <Badge className="ml-2">NFT</Badge>}
                    {asset.isCraftable && <Badge className="ml-2" variant="secondary">Craftable</Badge>}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-500">Market Trends</h3>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {gameState.marketTrends.map(trend => (
                  <div key={trend.assetId} className="flex items-center space-x-2">
                    <span>{gameState.assets.find(a => a.id === trend.assetId)?.name}</span>
                    {trend.trend === 'up' && <TrendingUp className="text-green-500" />}
                    {trend.trend === 'down' && <TrendingDown className="text-red-500" />}
                    {trend.trend === 'stable' && <Minus className="text-yellow-500" />}
                    <span>{trend.strength}</span>
                  </div>
                ))}
              </div>
            </div>
            {gameState.selectedAsset && (
              <div>
                <h3 className="text-lg font-semibold text-green-500">Trade {gameState.selectedAsset.name}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    type="number"
                    value={gameState.tradeQuantity}
                    onChange={(e) => setTradeQuantity(Number(e.target.value))}
                    placeholder="Quantity"
                    className="bg-black text-green-500 border-green-500"
                  />
                  <Button onClick={() => handleTrade(true)} className="bg-green-500 text-black hover:bg-green-600">Buy</Button>
                  <Button onClick={() => handleTrade(false)} className="bg-red-500 text-black hover:bg-red-600">Sell</Button>
                </div>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-green-500">Achievements</h3>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {gameState.achievements.map(achievement => (
                  <Badge key={achievement.id} variant={achievement.achieved ? "default" : "secondary"}>
                    {achievement.name}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="craft">
            <h3 className="text-lg font-semibold text-green-500">Craft Items</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {gameState.assets.filter(asset => asset.isCraftable).map(asset => (
                <Card key={asset.id} className="bg-black border-green-500">
                  <CardHeader>
                    <CardTitle>{asset.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Ingredients:</p>
                    <ul>
                      {asset.ingredients && Object.entries(asset.ingredients).map(([id, quantity]) => (
                        <li key={id}>
                          {gameState.assets.find(a => a.id === id)?.name}: {quantity}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handleCraft(asset.id)} className="w-full bg-green-500 text-black hover:bg-green-600">
                      Craft
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="mine">
            <h3 className="text-lg font-semibold text-green-500">Mining Operations</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {gameState.assets.filter(asset => ['gpu', 'asic', 'miningRig'].includes(asset.id)).map(asset => (
                <Card key={asset.id} className="bg-black border-green-500">
                  <CardHeader>
                    <CardTitle>{asset.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Owned: {asset.quantity}</p>
                    <p>Active: {gameState.miningOperations.filter(op => op.assetId === asset.id).length}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => startMining(asset.id)} 
                      className="w-full bg-green-500 text-black hover:bg-green-600"
                      disabled={asset.quantity <= gameState.miningOperations.filter(op => op.assetId === asset.id).length}
                    >
                      Start Mining
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="notifications">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {gameState.notifications.map(notification => (
                <Alert key={notification.id} variant={notification.type === 'error' ? 'destructive' : 'default'} className="mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}</AlertTitle>
                  <AlertDescription>{notification.message}</AlertDescription>
                </Alert>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-green-300">Market prices update every 5 seconds. Random events occur every 30 seconds. Trade wisely!</p>
      </CardFooter>
      <AppleStyleDock />
    </Card>
  )
}

