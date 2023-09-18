module.exports = {
  apps: [
    {
      script: './apps/holepunch-node/src/index.mjs',
      instances: 8,
      exec_mode: 'cluster',
    },
  ],
}
