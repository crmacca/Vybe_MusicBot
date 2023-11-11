const { SlashCommandBuilder } = require("discord.js");
const new_connection = require("../../functions/voice/new_connection");
const embeds = require("../../lang/english/embeds");

module.exports = {
    category: "public",
    data: new SlashCommandBuilder()
        .setName('drag')
        .setDescription(`Drags the bot to the voice channel you are in`),
    async execute(interaction, client) {
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

        console.log(connection)

        return interaction.reply({embeds: [embeds.success.joinedVoice]}) 
    }
}