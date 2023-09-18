import hyperswarm from 'hyperswarm'
import crypto from 'crypto'
import { executeCommand, runScenario } from './auctions.mjs'

const clientId = process.argv[2]
if (!clientId) {
  console.error('Please provide a clientId as an argument. Example: node index.mjs Client#3')
  process.exit(1)
}

const topic = crypto.createHash('sha256').update('auctions').digest()
const swarm = new hyperswarm()

let scenarioRan = false

swarm.join(topic, {
  lookup: true,
  announce: true,
})

swarm.on('connection', async (socket, peerInfo) => {
  console.log('New connection!', JSON.stringify(peerInfo))

  if (!scenarioRan) {
    await runScenario(socket, clientId)
    scenarioRan = true
  }

  socket.on('data', async (data) => {
    try {
      const { command, payload } = JSON.parse(data.toString())
      await executeCommand(command, payload, clientId)
    } catch (e) {
      console.error('Failed to process message', e)
    }
  })
})
