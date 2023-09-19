# P2P Auction

This application operates on a Peer-to-Peer (P2P) auction model, leveraging Hypercore and Hyperbee for data storage and Hyperswarm for node-to-node communication. Each participant within the network maintains its distinct database, enabling individual clients to host auctions and make bids autonomously.

## Installation

```bash
pnpm install
```

## Usage

### Starting a Node

To start a node in the P2P auction network, you can provide a unique `clientName` as an env var. See `.env-sample`
Replace `Client#1` with the desired identifier for your node, otherwise you will get a random name.

### Stopping the Node

To stop the node, simply close the terminal window in which it is running.

## Credits

https://github.com/cjmont/p2p-auction
