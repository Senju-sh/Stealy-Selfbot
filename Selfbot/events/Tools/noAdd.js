const { GroupDMChannel, User, Client } = require("legend.js")

module.exports = {
    name: "channelRecipientAdd",
    once: false,
    /**
     * @param {GroupDMChannel} channel
     * @param {User} user
     * @param {Client} client
    */
    run: async (channel, user, client) => {
        if (client.db.anti_group.no_add.includes(channel.id)) 
            fetch(`https://discord.com/api/v9/channels/${channel.id}/recipients/${user.id}`, 
            { 
                method: "DELETE", 
                headers: 
                { 
                    'Authorization': client.token 
                }
            }
        ).catch(() => false)
    }
}