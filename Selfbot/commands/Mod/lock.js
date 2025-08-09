const { Client, Message } = require('legend.js')

module.exports = {
    name: "lock",
    permission: "MANAGE_CHANNELS",
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
            await channel.overwritePermissions(role ?? message.guild.id, { SEND_MESSAGES: false });
            message.edit(client.language(`*Salon verrouillé : ${channel} pour le rôle ${role ? role.name : 'tous'}.*`, `*Channel locked: ${channel} for role ${role ? role.name : 'all'}.*`));
        } catch (err) {
            console.error(err);
            message.edit(client.language(`*Erreur lors du verrouillage du salon.*`, `*An error occurred while locking the channel.*`));
        }
    }
};