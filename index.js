const { ShardingManager } = require('discord.js');
const configuration = require('./utilities/configuration');
require('colors');

const manager = new ShardingManager('./client.js', { token: configuration.discord.token });

manager.on('shardCreate', shard => {
  console.log(`Launched shard ${shard.id}`);
  
  shard.once('ready', () => {
    console.log(`Shard ${shard.id} is now online`);
  });

  shard.on('error', error => {
    console.error(`Shard ${shard.id} encountered an error:`, error);
    Sentry.captureException(error);
  });
});

(async () => {
  try {
    manager.spawn();
  } catch (e) {
    return console.error(e);
  }
})();
