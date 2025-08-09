const { Client, Message } = require('legend.js')

module.exports = {
    name: "renew",
    permission: "MANAGE_CHANNELS",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const channel = message.mentions.channels.first() || message.guild.channels.get(args[0]) || message.channel

        const ee = await channel.clone({
            name: channel.name,
            permissions: channel.permissionsOverwrites,
            type: channel.type,
            topic: channel.withTopic,
            nsfw: channel.nsfw,
            birate: channel.bitrate,
            userLimit: channel.userLimit,
            rateLimitPerUser: channel.rateLimitPerUser,
            permissions: channel.withPermissions,
            position: channel.position
        })

        channel.delete()
        .catch(async () => {
            ee.delete()
            message.edit(client.language("*Je ne peux pas supprimer ce salon, sûrement à cause de la communauté activé.*", "*I cannot delete this channel maybe because the community is enabled.*"))
        })
    }
}