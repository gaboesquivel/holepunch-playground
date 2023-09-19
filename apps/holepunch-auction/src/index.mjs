import hyperswarm from 'hyperswarm'
import { executeCommand } from './auctions.mjs'
import { runScenario } from './simulation.mjs'
import { config } from './config.mjs'

async function main() {
  // Join the auctions topic
  console.log('joining swarm topic ...')
  const swarm = new hyperswarm()
  const topic = Buffer.alloc(32).fill(config.topicKey) // A topic must be 32 bytes
  const discovery = swarm.join(topic, {
    lookup: true,
    announce: true,
  })
  console.log('wait for for the topic to be fully announced on the dht ...')
  await discovery.flushed()
  console.log('ready !')

  // On connection run simulation once
  let execAuction = false
  swarm.on('connection', async (socket, info) => {
    console.log('new connection!') // JSON.stringify(info)

    if (!execAuction) {
      await runScenario(socket, config.clientName)
      execAuction = true
    }

    socket.on('data', async (data) => {
      const { command, payload } = JSON.parse(data.toString())
      await executeCommand(command, payload, config.clientName)
    })
  })
}

main().catch(console.error)
