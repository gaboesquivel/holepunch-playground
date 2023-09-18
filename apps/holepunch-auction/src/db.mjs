import hypercore from 'hypercore'
import Hyperbee from 'hyperbee'
import fs from 'fs'
import path from 'path'

let db = undefined

export function getDb(clientId) {
  if (db) return db

  const nodeDataDir = path.join('./node-data', clientId)
  if (!fs.existsSync(nodeDataDir)) {
    fs.mkdirSync(nodeDataDir, { recursive: true })
  }

  const feed = new hypercore(nodeDataDir)
  db = new Hyperbee(feed)
  return db
}
