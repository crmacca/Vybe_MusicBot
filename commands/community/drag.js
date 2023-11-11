const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../../lang/english/embeds");
const hasDJPermissions = require("../../functions/guild/hasDJPermissions");
const new_connection = require("../../functions/voice/new_connection");

module.exports = {
    category: "public",
    data: new SlashCommandBuilder()
        .setName('drag')
        .setDescription(`Drag the bot to your current voice channel.`),
    async execute(interaction, client) {
        const permissions = await hasDJPermissions(client, interaction.member, interaction.guild);
        if(!permissions) return interaction.reply({embeds: [embeds.error.djMode], ephemeral: true})

        const memberVoiceChannel = interaction.member.voice.channel;
        if (!memberVoiceChannel) return interaction.reply({ embeds: [embeds.error.notInVoice], ephemeral: true });

        const connection = await new_connection(client, interaction, memberVoiceChannel, true);

        if (!connection) {
            return interaction.reply({ embeds: [embeds.error.unknown], ephemeral: true });
        }

        return interaction.reply({ embeds: [embeds.success.draggedInto] });
    }
}
