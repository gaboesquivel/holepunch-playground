import hyperswarm from 'hyperswarm'
import crypto from 'crypto'
import { executeCommand } from './auctions.mjs'
import { runScenario } from './simulation.mjs'
import { config } from './config.mjs'

const topic = crypto.createHash('sha256').update('auctions').digest()
const swarm = new hyperswarm()
swarm.join(topic, {
  lookup: true,
  announce: true,
})

let execAuction = false

swarm.on('connection', async (socket, peerInfo) => {
  console.log('New connection!') // JSON.stringify(peerInfo)

  if (!execAuction) {
    await runScenario(socket, config.clientName)
    execAuction = true
  }

  socket.on('data', async (data) => {
    try {
      const { command, payload } = JSON.parse(data.toString())
      await executeCommand(command, payload, config.clientName)
    } catch (e) {
      console.error('Failed to process message', e)
    }
  })
})
