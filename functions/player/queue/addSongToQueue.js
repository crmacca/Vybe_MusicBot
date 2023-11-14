const { PrismaClient } = require("@prisma/client")
const getQueue = require("./getQueue")
const prisma = new PrismaClient()

module.exports = addSongToQueue = async (client, guild, song) => {
    const guildQueue = await getQueue(guild.id) || await prisma.queue.create({data: {guildId: guild.id, songs: [], previouslyPlayed: []}})
    if(songs.length === 0) console.log('no songs')

}