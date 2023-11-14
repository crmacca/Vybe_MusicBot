const ytsr = require('ytsr');
const ytdl = require("ytdl-core");
const scdlCreate = require('soundcloud-downloader').create
const configuration = require('../../utilities/configuration')

const getSongInfo = async (query, source, isUrl, clientId, sourceDefined) => {
    let songInfo = {
            name: null,
            source: source,
            location: null,
            duration: 0,
            artworkUrl: null,
            isPremiumOnly: false,
            author: {
                username: null,
                location: null,
                artworkUrl: null
            }
        }

        let scdl 
        if(clientId) {
            soundcloudDL = await scdlCreate({
                clientID: clientId, 
                saveClientID: false
            })
        } else {
            scdl = await scdlCreate({
                clientID: configuration.apiKeys.soundCloud,
                saveClientID: true,
            })
        }

    switch (source) {
        case 'youtube':
            let yturl
            if(!isUrl) {
                const searchResults = await ytsr(query, { limit: 1 });
                if(searchResults.results === 0) return {success: false, reason: 'SONG_NOT_FOUND', songInfo: null}
                yturl = searchResults.items[0].url
            } else yturl = query
            
            songBasicInfo = await ytdl.getBasicInfo(yturl)
            .catch(err => {
                if (err.toString() === 'UnrecoverableError: Video unavailable') {
                    return { success: false, reason: 'SONG_NOT_FOUND', songInfo: null };
                } else {
                    return { success: false, reason: 'UNKNOWN', songInfo: null };
                }
            })
            
            if(songBasicInfo.success !== undefined && songBasicInfo.success === false) return songBasicInfo

            songInfo.name = songBasicInfo.videoDetails.title
            songInfo.duration = parseInt(songBasicInfo.videoDetails.lengthSeconds) * 1000
            songInfo.artworkUrl = songBasicInfo.videoDetails.thumbnails[0].url || null
            songInfo.location = songBasicInfo.videoDetails.video_url
            songInfo.author.username = songBasicInfo.videoDetails.author.name
            songInfo.author.artworkUrl = songBasicInfo.videoDetails.author.thumbnails[0].url || null    
            songInfo.author.location = songBasicInfo.videoDetails.author.channel_url
            break;

        case 'soundcloud':
            if(!isUrl) {
                const searchResults = await scdl.search({ query: query, limit: 1, resourceType: 'tracks' })
                if(searchResults.total_results === 0) {
                    if(sourceDefined) return {success: false, reason: 'SONG_NOT_FOUND', songInfo: null}
                    return getSongInfo(query, 'youtube', false)
                }

                songInfo.name = searchResults.collection[0].title
                songInfo.duration = parseInt(searchResults.collection[0].full_duration)
                songInfo.artworkUrl = searchResults.collection[0].artwork_url || null
                songInfo.location = searchResults.collection[0].permalink_url
                songInfo.author.username = searchResults.collection[0].user.username
                songInfo.author.artworkUrl = searchResults.collection[0].user.avatar_url || null
                songInfo.author.location = searchResults.collection[0].user.permalink_url
                songInfo.isPremiumOnly = searchResults.collection[0].monetization_model.startsWith('SUB_')

            } else {

                const songData = await scdl.getInfo(query)
                .catch(err => {
                    if (err.toString() === 'Error: The given URL does not link to a Soundcloud track') {
                        return { success: false, reason: 'SONG_NOT_FOUND', songInfo: null };
                    } else {
                        return { success: false, reason: 'UNKNOWN', songInfo: null };
                    }
                })
                if(songData.success !== undefined && songData.success === false) return songData

                songInfo.name = songData.title
                songInfo.duration = parseInt(songData.full_duration)
                songInfo.artworkUrl = songData.artwork_url || null
                songInfo.location = songData.permalink_url
                songInfo.author.username = songData.user.username
                songInfo.author.artworkUrl = songData.user.avatar_url || null
                songInfo.author.location = songData.user.permalink_url
                songInfo.isPremiumOnly = songData.monetization_model.startsWith('SUB_')
            }
            break;
    }


    return {
        success: true,
        song: songInfo
    }
};

module.exports = getSongInfo