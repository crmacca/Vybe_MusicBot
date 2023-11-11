const { getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");
const getProfile = require("./getProfile");
const { PermissionsBitField } = require("discord.js");

module.exports = async function hasDJPermissions(client, member, guild) {
    const serverProfile = await getProfile(guild.id);

    if(serverProfile.settings.djSettings.enabled === false) return true;

    const djRoles = serverProfile.settings.djSettings.roles;

    console.log(await  member.roles)
    console.log(await member.permissions.has(PermissionsBitField.Flags.Administrator))
}