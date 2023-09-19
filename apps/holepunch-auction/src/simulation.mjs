// we simulate a real-time auction with random data
import { handleNewAuction, handleNewHighestBid, handleAuctionClosed } from './auctions.mjs'

// TODO: make this random
export async function runScenario(socket, clientId) {
  await handleNewAuction({ photoId: 'Pic#1', startingPrice: 75 }, clientId)
  await handleNewAuction({ photoId: 'Pic#2', startingPrice: 60 }, clientId)
  await handleNewHighestBid({ auctionId: `${clientId}->Pic#1`, clientId: 'Client#2', bidAmount: 80 })
  await handleAuctionClosed({ auctionId: `${clientId}->Pic#1` }, clientId)
}
