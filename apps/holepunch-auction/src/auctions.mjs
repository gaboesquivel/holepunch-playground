import {getDb} from './db.mjs'

export async function executeCommand(command, payload, clientId) {
  switch (command) {
    case 'newAuction':
      await handleNewAuction(payload, clientId)
      break
    case 'newHighestBid':
      await handleNewHighestBid(payload)
      break
    case 'auctionClosed':
      await handleAuctionClosed(payload, clientId)
      break
    default:
      console.warn(`Unknown command received: ${command}`)
  }
}

async function handleNewAuction({ photoId, startingPrice }, clientId) {
  const db = getDb(clientId)
  const auctionId = `${clientId}->${photoId}`
  const data = { clientId, photoId, startingPrice, highestBid: startingPrice }
  await db.put(auctionId, JSON.stringify(data))
  console.log(`New auction started by ${clientId} for ${photoId} with a starting price of ${startingPrice}`)
}

async function handleNewHighestBid({ auctionId, clientId, bidAmount }) {
  const db = getDb(clientId)
  const data = await db.get(auctionId)
  if (data) {
    const auctionData = JSON.parse(data.value.toString())
    auctionData.highestBid = bidAmount
    await db.put(auctionId, JSON.stringify(auctionData))
    console.log(`New highest bid in auction ${auctionId} by ${clientId} with an amount of ${bidAmount}`)
  }
}

async function handleAuctionClosed({ auctionId }, clientId) {
  const db = getDb(clientId)
  await db.del(auctionId)
  console.log(`The auction ${auctionId} has been closed.`)
}

export async function runScenario(socket, clientId) {
  await handleNewAuction({ photoId: 'Pic#1', startingPrice: 75 }, clientId)
  await handleNewAuction({ photoId: 'Pic#2', startingPrice: 60 }, clientId)
  await handleNewHighestBid({ auctionId: `${clientId}->Pic#1`, clientId: 'Client#2', bidAmount: 80 })
  await handleAuctionClosed({ auctionId: `${clientId}->Pic#1` })
}
