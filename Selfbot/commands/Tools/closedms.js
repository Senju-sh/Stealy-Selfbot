const { Client, Message } = require("legend.js")

module.exports = {
    name: "closedms",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        message.edit("***__› Stealy__*** <a:star:1345073135095123978>")
        message.delete().catch(() => false)
        client.channels
            .filter((channel) => channel.type === "dm" | channel.type === "group")
            .map((channel) => channel.delete(true).catch(() => false))
    }
}