module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, client) {
    if (!interaction.isCommand) return;
    const command = client.commands.get(interaction.commandName)
    if (!command) return;
    
    try {
        await command.execute(interaction, client);
    } catch (err) {
        if (err) {
            console.error(err);
        }
    }
    
}
};