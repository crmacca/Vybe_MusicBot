const { SlashCommandBuilder } = require("discord.js");
const embeds = require("../../lang/english/embeds");
const getSongInfo = require("../../functions/scraper/getSongInfo");
const addSongToQueue = require("../../functions/player/queue/addSongToQueue");
const { getVoiceConnection } = require("@discordjs/voice");
const new_connection = require("../../functions/voice/new_connection");

const isValidUrl = (urlString) => {
    try {
        new URL(urlString);
        return true;
    } catch (error) {
        return false;
    }
};


// Function to determine the platform from a URL
const determinePlatform = (url) => {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
        return "youtube";
    } else if (hostname.includes("soundcloud.com")) {
        return "soundcloud";
    } else if (hostname.includes("spotify.com")) {
        return "spotify";
    } else if (hostname.includes("music.apple.com")) {
        return "applemusic";
    } else {
        return null;
    }
};

module.exports = {
    category: "public",
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription(`Play a song`)
        .addStringOption((option) => option
            .setName('query')
            .setDescription('Query or URL to song you wish to play')
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName('source')
            .setDescription('Source of the song you wish to play')
            .setChoices(
                {name: 'YouTube', value: 'youtube'},
                {name: 'Spotify', value: 'spotify'},
                {name: 'SoundCloud', value: 'soundcloud'},
                {name: 'Apple Music', value: 'applemusic'},
            )
        ),
    async execute(interaction, client) {
        const permissions = await hasDJPermissions(client, interaction.member, interaction.guild);
        if(!permissions) return interaction.reply({embeds: [embeds.error.djMode], ephemeral: true})

        const memberVoiceChannel = interaction.member.voice.channel;
        if(!memberVoiceChannel) return interaction.reply({embeds: [embeds.error.notInVoice], ephemeral: true})

        const query = await interaction.options.getString('query');
        let source = await interaction.options.getString('source') || null;

        const queryIsUrl = await isValidUrl(query)
        if(queryIsUrl) {
            source = await determinePlatform(query);
            if(source === null) return interaction.reply({embeds: [embeds.error.songNotFound], ephemeral: true});
        }

        const song = await getSongInfo(query, source === null ? 'soundcloud' : source, queryIsUrl, null, source !== null);
        if(!song.success) {
            if(song.reason === 'SONG_NOT_FOUND') return interaction.reply({embeds: [embeds.error.songNotFound], ephemeral: true});
            return interaction.reply({embeds: [embeds.error.unknown], ephemeral: true});
        }

        await interaction.deferReply(); //Now we can take as long as we like without Discord wondering whats happening...

        let voiceConnection = await getVoiceConnection(interaction.guild.id);
        if(!voiceConnection) {
            const connection = await new_connection(client, interaction, interaction.member.voice.channel);
            if(!connection.success) {
                if(connection.reason === 'API_ERROR') return interaction.reply({embeds: [embeds.error.unknown], ephemeral: true})
                if(connection.reason === 'ALREADY_IN_VOICE') {
                    let currentChannel = connection.connection.joinConfig.channelId
                    return interaction.editReply({embeds: [await embeds.error.alreadyInVoice(memberVoiceChannel)], ephemeral: true})
                }
                return interaction.editReply({embeds: [embeds.error.unknown], ephemeral: true})
            }

            voiceConnection = connection.connection
        }

        const addSongRequest = addSongToQueue(client, interaction.guild, song.song);

    }
}