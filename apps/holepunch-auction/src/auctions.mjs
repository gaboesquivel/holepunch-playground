import { getDb } from './hyperbee.mjs'

export async function execAction(action, payload, clientName) {
  switch (action) {
    case 'new_auction':
      await handleNewAuction(payload, clientName)
      break
    case 'auction_bid':
      await handleNewBid(payload)
      break
    case 'close_auction':
      await handleCloseAuction(payload, clientName)
      break
    default:
      console.warn(`Unknown action received: ${action}`)
  }
}

export async function handleNewAuction({ pictureId, startingPrice }, clientName) {
  const db = getDb(clientName)
  const auctionId = `${clientName}->${pictureId}`
  const data = { clientName, pictureId, startingPrice, highestBid: startingPrice }
  await db.put(auctionId, JSON.stringify(data))
  console.log(`New auction started by ${clientName} for ${pictureId} with a starting price of ${startingPrice}`)
}

export async function handleNewBid({ auctionId, clientName, bidAmount }) {
  const db = getDb(clientName)
  const data = await db.get(auctionId)
  if (data) {
    const auctionData = JSON.parse(data.value.toString())
    auctionData.highestBid = bidAmount
    await db.put(auctionId, JSON.stringify(auctionData))
    console.log(`New highest bid in auction ${auctionId} by ${clientName} with an amount of ${bidAmount}`)
  }
}

export async function handleCloseAuction({ auctionId }, clientName) {
  const db = getDb(clientName)
  await db.del(auctionId)
  console.log(`The auction ${auctionId} has been closed.`)
}
