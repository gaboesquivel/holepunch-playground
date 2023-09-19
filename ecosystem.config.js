module.exports = {
  apps: [
    {
      script: './apps/holepunch-auction/src/index.mjs',
      instances: 8,
      exec_mode: 'cluster',
    },
  ],
}
