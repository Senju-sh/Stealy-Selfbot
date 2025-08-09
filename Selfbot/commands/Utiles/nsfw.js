const { Client, Message } = require("legend.js");

module.exports = {
    name: "nsfw",
    permission: "MANAGE_CHANNELS",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const channel = message.mentions.channels.first() || message.guild.channels.get(args[1]) || message.channel;
        if (!channel) 
            return message.edit(client.language(
                `*Cette commande est utilisable sur un serveur uniquement.*`,
                `*This command is usable only in a guild.*`
            ));

        switch(args[0]){
            case "on":
                channel.setNSFW(true)
                message.edit(client.language(`*Le salon ${channel} a été mis en NSFW.*`, `*The channel ${channel} has been set to NSFW.*`))
                break;
            case "off":
                channel.setNSFW(false)
                message.edit(client.language(`*Le salon ${channel} n'est plus en NSFW.*`, `*The channel ${channel} is no longer NSFW.*`))
                break;
        }
    }
}