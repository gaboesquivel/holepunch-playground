# P2P Auction - Peer-to-Peer Auction Application

This is a Peer-to-Peer (P2P) auction application that utilizes Hypercore and Hyperbee for data storage and Hyperswarm for communication between nodes. Each node in the network has its own independent database, allowing each client to conduct auctions and place bids independently.

A fork of https://github.com/cjmont/p2p-auction

## Installation

```bash
pnpm install
cd apps/holepunch-auction
pnpm start Client#1
# on a new termnial window
pnpm start Client#2
```

## Usage

### Starting a Node

To start a node in the P2P auction network, you should provide a unique `clientId` as a command-line argument. For example:

```bash
node index.js Client#1 
# or
pnpm start Client#1
```

Replace `Client#1` with the desired identifier for your node. Each node in the network must have a unique identifier.

### Available Commands

Once your node is up and running, you can use the following commands to interact with the application:

- `newAuction`: Start a new auction. Example:

  ```bash
  node index.js Client#1 newAuction '{"photoId": "Pic#3", "startingPrice": 50}'
  ```

- `newHighestBid`: Place a bid on an existing auction. Example:

  ```bash
  node index.js Client#2 newHighestBid '{"auctionId": "Client#1->Pic#3", "bidAmount": 60}'
  ```

- `auctionClosed`: Close an auction. Example:

  ```bash
  node index.js Client#1 auctionClosed '{"auctionId": "Client#1->Pic#3"}'
  ```

### Running a Scenario

The code provides an example scenario that you can execute on a running node. The scenario includes creating auctions, placing bids, and closing auctions. To run the scenario on your node:

```bash
node index.js Client#1 scenario
```

### Stopping the Node

To stop the node, simply close the terminal window in which it is running.
