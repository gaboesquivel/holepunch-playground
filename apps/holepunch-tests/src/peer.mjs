import Hyperswarm from 'hyperswarm'
import goodbye from 'graceful-goodbye'
import crypto from 'hypercore-crypto'
import b4a from 'b4a'

const swarm = new Hyperswarm()
goodbye(() => swarm.destroy())

// Keep track of all connections and console.log incoming data
const conns = []
swarm.on('connection', (conn, peerInfo) => {
  console.log('got connection', peerInfo)
  const name = b4a.toString(conn.remotePublicKey, 'hex')
  console.log('* got a connection from:', name, '*', peerInfo)
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

// Join a common topic
console.log(`connecting to topic ${process.argv[2]}`)
const topic = process.argv[2] ? b4a.from(process.argv[2]) : crypto.randomBytes(32)
const discovery = swarm.join(topic, { client: true, server: true })

// The flushed promise will resolve when the topic has been fully announced to the DHT
discovery.flushed().then(() => {
  console.log('topic', topic, b4a.toString(topic), topic.toString())
  console.log('joined topic:', b4a.toString(topic))
})
