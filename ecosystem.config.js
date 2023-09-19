module.exports = {
  apps: [
    {
      script: './apps/holepunch-auction/src/index.mjs',
      instances: 4,
      exec_mode: 'cluster',
    },
  ],
}
