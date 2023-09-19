module.exports = {
  apps: [
    {
      script: './apps/holepunch-auction/src/index.mjs',
      instances: 4,
      exec_mode: 'cluster',
      watch: ['apps/holepunch-auction'],
      // Delay between restart
      watch_delay: 1000,
      ignore_watch: ['node_modules', 'node-data', '\\.git', '*.log'],
    },
  ],
}
