const { Client, Message } = require('legend.js')

module.exports = {
    name: "unlock",
    permission: "MANAGEE_CHANNELS",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */    
    run: async (client, message, args) => {
        const channel = message.mentions.channels.first() || message.guild.channels.get(args[0]) || message.channel;
        const role = message.mentions.roles.first() || message.guild.roles.get(args[1]);

        if (!channel) 
            return message.edit(client.language(
                `*Salon introuvable.*`,
                `*Channel not found.*`
            ));

        try {
            await channel.overwritePermissions(role ? role.id : message.guild.id, { SEND_MESSAGES: true });
            message.edit(client.language(`*Le salon ${channel} a été déverrouillé pour le rôle ${role ? role.name : `tout le monde`}.*`, `*The channel ${channel} has been unlocked for the role ${role ? role.name : `everyone`}.*`));
        } catch (err) {
            console.error(err);
            message.edit(client.language(`*Erreur lors du déverrouillage du salon.*`, `*An error occurred while unlocking the channel.*`));
        }
    }
};