import Hyperswarm from 'hyperswarm'
import crypto from 'crypto'

// Generate a topic as a 32-byte buffer
const topic = crypto.createHash('sha256').update('auctions').digest()

const swarm = new Hyperswarm()

swarm.join(topic, {
  lookup: true, // find and connect to peers
  announce: true, // announce self as a connection target
})

swarm.on('connection', (connection, info) => {
  console.log(`Connected to peer`, JSON.stringify(info))

  // Handle incoming data from the connected peer
  connection.on('data', (data) => {
    console.log(`Received data from: ${data.toString()}`)
  })

  // Send a message to the connected peer
  connection.write('Hello, peer!')

  // Handle connection errors
  connection.on('error', (error) => {
    console.error(`Connection error with: ${error.message}`, JSON.stringify(info))
  })
})
