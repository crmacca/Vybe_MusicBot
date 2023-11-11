const { getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");
const embeds = require("../../lang/english/embeds");

module.exports = async function newConnection(client, interaction, location) {
    if(!location) return {success: false, code: 400, reason: 'INVALID_PARAMS'}

    const voiceConnection = await getVoiceConnection(interaction.guild.id);
    if(voiceConnection) return {success: false, code: 400, reason: 'ALREADY_IN_VOICE', connection: voiceConnection}

    try {
        const newConnection = await joinVoiceChannel({
            channelId: location.id,
            guildId: location.guild.id,
            adapterCreator: location.guild.voiceAdapterCreator
        });

        return {success: true, connection: newConnection}
    } catch (err) {
        console.log(err)
        return {success: false, error: err, code: 500, reason: 'API_ERROR'}
    }



}