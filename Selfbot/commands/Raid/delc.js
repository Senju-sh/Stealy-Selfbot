const { Client, Message } = require('legend.js');

module.exports = {
    name: "delc",
    owner: true,
    permission: "MANAGE_CHANNELS",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args 
    */
    run: async (client, message, args) => {
        message.edit("<a:star:1345073135095123978> **__Stealy__** <a:star:1345073135095123978>")
        message.delete().catch(() => false)

        message.guild.channels.filter(c => c.deletable).forEach(c => c.delete().catch(() => false))
    },
};