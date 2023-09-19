import hyperswarm from 'hyperswarm'
import goodbye from 'graceful-goodbye'
import b4a from 'b4a'
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
  // console.log(`${config.clientName} waits for the topic to be fully announced on the dht ...`)
  // await discovery.flushed()
  console.log(`${config.clientName} ready for connections!`)

  // On connection run simulation once
  let execAuction = false
  // Keep track of all connections and console.log incoming data
  const conns = []
  swarm.on('connection', async (conn, info) => {
    // console.log('swarm peers', swarm.peers.keys())
    const connPubKey = b4a.toString(conn.remotePublicKey, 'hex')
    console.log(`${config.clientName} has connected with ${connPubKey}!`)
    conns.push(conn)
    conn.once('close', () => conns.splice(conns.indexOf(conn), 1))

    // testing p2p communication
    conn.write(`hi ${connPubKey}, I'm ${config.clientName}`)
    setTimeout(
      () => {
        for (const conn of conns) {
          conn.write('lets make some p2p auctions folks')
        }
      },
      getRandomInt(500, 5000)
    )

    conn.on('data', (data) => {
      console.log(`${config.clientName} received data from ${connPubKey}`, data.toString())
      // const { command, payload } = JSON.parse(data.toString())
      // await executeCommand(command, payload, config.clientName)
    })

    // simulation on hyperbee db
    if (!execAuction) {
      await runScenario(conn, config.clientName)
      execAuction = true
    }
  })
}

main().catch(console.error)
