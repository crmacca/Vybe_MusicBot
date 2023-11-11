const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const defaultSettings = {
    djSettings: {
        enabled: false,
        roles: [0],
    },
    skipSettings: {
        voteSkip: false,
        skipPercentage: 0.5
    }
}

module.exports = async function getProfile(guildId) {
    const serverProfile = prisma.guild.upsert({
        where: {
            id: guildId
        },
        update: {},
        create: {
            id: guildId,
            settings: defaultSettings
        }
    })

    return serverProfile
}