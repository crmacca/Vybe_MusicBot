const colors = require('../../utilities/colors')

const { EmbedBuilder } = require('discord.js')

module.exports = {
    error: {
        notInVoice: new EmbedBuilder()
            .setTitle('🚷 Not in a voice channel')
            .setDescription('You are not in a voice channel, please join one and try again!')
            .setColor(colors.error),
        alreadyInVoice: async function(voiceChannel) {
            return new EmbedBuilder()
            .setTitle('🎙 Already playing elsewhere')
            .setDescription(`I am already playing music in ${voiceChannel}, run \`/drag\` or join my voice channel!`)
            .setColor(colors.error)
        },
        djMode: new EmbedBuilder()
        .setTitle('💿 DJ Mode Enabled')
        .setDescription('This server has DJ mode enabled, only users with the DJ role can use this command (at this time)!')
        .setColor(colors.error),
        unknown: new EmbedBuilder()
            .setTitle('❔ Unknown Error')
            .setDescription('An unknown error has occured, please try again later.')
            .setColor(colors.error),
        alreadyHere: new EmbedBuilder()
        .setTitle(':question: Already in your channel!')
        .setDescription('I am already in your voice channel; did you mean \`/stop\`?')
        .setColor(colors.error)
    },
    success: {
        joinedVoice: new EmbedBuilder()
            .setTitle('🎙 Joined Voice Channel')
            .setDescription('I have joined your voice channel!')
            .setColor(colors.primary),
        draggedInto: new EmbedBuilder()
            .setTitle('🎙 Dragged into Voice Channel')
            .setDescription('I have been dragged into your voice channel!')
            .setColor(colors.primary),
    }
}