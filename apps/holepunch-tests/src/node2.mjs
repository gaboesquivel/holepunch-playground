import Hyperswarm from 'hyperswarm';
import crypto from 'crypto';

const swarm = new Hyperswarm();

const topic = crypto.createHash('sha256').update('my-hyperswarm-topic').digest();

swarm.join(topic, {
  lookup: true, // find and connect to peers
  announce: true, // announce self as a connection target
});

swarm.on('connection', (connection, info) => {
  console.log('Connected to', info);
  connection.write('Hello from Node 2!');
  connection.on('data', (data) => {
    console.log('Node 2 received data:', data.toString());
  });
});
