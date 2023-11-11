const { GatewayIntentBits, Client } = require('discord.js');
const configuration = require('./utilities/configuration');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

async function loadEvents() {
  const eventFolders = fs.readdirSync('./events').filter(file => !file.endsWith('.js'));
  const generalEventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

  function loadEvent(event, eventType) {
    const eventHandler = (...args) => event.execute(...args, client);
    if (event.once) {
      client.once(event.name, eventHandler);
    } else {
      client.on(event.name, eventHandler);
    }
  }

  for (const file of generalEventFiles) {
    const event = require(`./events/${file}`);
    loadEvent(event, 'general');
  }

  for (const folder of eventFolders) {
    const eventFiles = fs.readdirSync(`./bot/events/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
      const event = require(`./events/${folder}/${file}`);
      loadEvent(event, folder);
    }
  }
}

loadEvents();

process.on('uncaughtException', err => {
  console.error(err);
  console.log('Node NOT Exiting...');
});

client.login(configuration.discord.token);
