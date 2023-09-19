import { getDb } from './hyperbee.mjs'

export async function executeCommand(command, payload, clientId) {
  switch (command) {
    case 'new_auction':
      await handleNewAuction(payload, clientId)
      break
    case 'auction_bid':
      await handleNewBid(payload)
      break
    case 'close_auction':
      await handleCloseAuction(payload, clientId)
      break
    default:
      console.warn(`Unknown command received: ${command}`)
  }
}

export async function handleNewAuction({ photoId, startingPrice }, clientId) {
  const db = getDb(clientId)
  const auctionId = `${clientId}->${photoId}`
  const data = { clientId, photoId, startingPrice, highestBid: startingPrice }
  await db.put(auctionId, JSON.stringify(data))
  console.log(`New auction started by ${clientId} for ${photoId} with a starting price of ${startingPrice}`)
}

export async function handleNewBid({ auctionId, clientId, bidAmount }) {
  const db = getDb(clientId)
  const data = await db.get(auctionId)
  if (data) {
    const auctionData = JSON.parse(data.value.toString())
    auctionData.highestBid = bidAmount
    await db.put(auctionId, JSON.stringify(auctionData))
    console.log(`New highest bid in auction ${auctionId} by ${clientId} with an amount of ${bidAmount}`)
  }
}

export async function handleCloseAuction({ auctionId }, clientId) {
  const db = getDb(clientId)
  await db.del(auctionId)
  console.log(`The auction ${auctionId} has been closed.`)
}
