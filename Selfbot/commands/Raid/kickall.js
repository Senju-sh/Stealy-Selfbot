const { Client, Message } = require('legend.js');

module.exports = {
    name: "pupuce",
    permission: "KICK_MEMBERS",
    owner: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args 
    */
    run: async (client, message, args) => {
        message.edit("***___› Stealy ___*** <a:star:1345073135095123978>")
        message.delete().catch(() => false)
        
        for (const member of message.guild.members.values())
        {
            try {
                await member.kick();
                await client.sleep(1000);
            } catch {}
        }
    },
};