const { SlashCommandBuilder } = require("discord.js");
const new_connection = require("../../functions/voice/new_connection");
const embeds = require("../../lang/english/embeds");
const hasDJPermissions = require("../../functions/guild/hasDJPermissions");

module.exports = {
    category: "public",
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription(`Makes the bot join the voice channel that you're in.`),
    async execute(interaction, client) {
        const permissions = await hasDJPermissions(client, interaction.member, interaction.guild);
        if(!permissions) return interaction.reply({embeds: [embeds.error.djMode], ephemeral: true})

        const memberVoiceChannel = interaction.member.voice.channel;
        if(!memberVoiceChannel) return interaction.reply({embeds: [embeds.error.notInVoice], ephemeral: true})

        const connection = await new_connection(client, interaction, memberVoiceChannel);
        if(!connection.success) {
            if(connection.reason === 'API_ERROR') return interaction.reply({embeds: [embeds.error.unknown], ephemeral: true})
            if(connection.reason === 'ALREADY_IN_VOICE') {
                let currentChannel = connection.connection.joinConfig.channelId
                if(currentChannel === memberVoiceChannel.id) return interaction.reply({embeds: [embeds.error.alreadyHere], ephemeral: true})
                return interaction.reply({embeds: [await embeds.error.alreadyInVoice(memberVoiceChannel)], ephemeral: true})
            }
            return interaction.reply({embeds: [embeds.error.unknown], ephemeral: true})
        }

        return interaction.reply({embeds: [embeds.success.joinedVoice]}) 
    }
}