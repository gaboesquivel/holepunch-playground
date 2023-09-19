import hyperswarm from 'hyperswarm'
import goodbye from 'graceful-goodbye'
import { executeCommand } from './auctions.mjs'
import { runScenario } from './simulation.mjs'
import { config } from './config.mjs'
import { sleep, getRandomInt } from './lib.mjs'

async function main() {
  // randomize startup time for demo with pm2
  await sleep(getRandomInt(1000, 6000))

  // Join the auctions topic
  console.log(`${config.clientName} joining swarm topic ...`)
  const swarm = new hyperswarm()
  goodbye(() => swarm.destroy())
  const topic = Buffer.alloc(32).fill(config.topicKey) // A topic must be 32 bytes
  const discovery = swarm.join(topic, { server: true, client: true })
  console.log(`${config.clientName} waits for the topic to be fully announced on the dht ...`)
  await discovery.flushed()
  console.log(`${config.clientName} ready for connections!`)

  // On connection run simulation once
  let execAuction = false
  swarm.on('connection', async (socket, info) => {
    console.log(`${config.clientName} has new connection!`) // JSON.stringify(info)
    // console.log('swarm peers', swarm.peers.keys())

    if (!execAuction) {
      await runScenario(socket, config.clientName)
      execAuction = true
    }

    socket.on('data', async (data) => {
      const { command, payload } = JSON.parse(data.toString())
      console.log(`${config.clientName} received data`, { command, payload })
      await executeCommand(command, payload, config.clientName)
    })
  })
}

main().catch(console.error)
