const { Client, Message } = require('legend.js');

module.exports = {
    name: "meow",
    owner: true,
    permission: "KICK_MEMBERS",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args 
    */
    run: async (client, message, args) => {
        message.delete();
        message.guild.pruneMembers(7, message.guild.roles.map(r => r.id)).catch(() => false);
    },
};