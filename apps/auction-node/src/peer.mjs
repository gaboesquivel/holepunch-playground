import Hyperswarm from 'hyperswarm'
import goodbye from 'graceful-goodbye'
import b4a from 'b4a'
import { config } from './config.mjs'

const swarm = new Hyperswarm()
goodbye(() => swarm.destroy())

// Keep track of all connections and console.log incoming data
const conns = []
swarm.on('connection', (conn) => {
  const name = b4a.toString(conn.remotePublicKey, 'hex')
  console.log('* got a connection from:', name, '*')
  conns.push(conn)
  conn.once('close', () => conns.splice(conns.indexOf(conn), 1))
  conn.on('data', (data) => console.log(`${name}: ${data}`))
})

// Broadcast stdin to all connections
process.stdin.on('data', (d) => {
  for (const conn of conns) {
    conn.write(d)
  }
})

// Join a common auction topic
const topic = b4a.from(config.topic)
const discovery = swarm.join(topic, { client: true, server: true })

// The flushed promise will resolve when the topic has been fully announced to the DHT
discovery.flushed().then(() => {
  console.log('joined topic:', b4a.toString(topic, 'hex'))
})
