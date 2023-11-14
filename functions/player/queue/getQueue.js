const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = async function getQueue(guildId) {
    const queue = prisma.queue.findFirst({
        where: {
            guildId: guildId
        }
    })

    return queue || null
}