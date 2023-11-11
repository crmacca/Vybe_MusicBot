const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { Collection } = require("discord.js");
const configuration = require('../utilities/configuration');
require('colors');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        let commands = [];
        client.commands = new Collection();

        const commandFolders = fs.readdirSync('./commands');

        for await (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                commands.push(command.data.toJSON());
                client.commands.set(command.data.name, command);
            }
        }

        const rest = new REST({ version: "9" }).setToken(configuration.discord.token);

        (async () => {
            try {
                await rest.put(Routes.applicationGuildCommands(client.user.id, configuration.discord.guildID), {
                    body: commands
                });
                console.log('Commands: '.green.bold + 'Successfully registered'.green);
            } catch (err) {
                if (err) console.error(err);
            }
        })();
    }
};
