const { Client, Message } = require("legend.js");

module.exports = {
    name: "sync",
    permission: "MANAGE_CHANNELS",
    owner: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (args[0] === "all"){
            message.guild.channels.filter(c => c.type !== 'category' && c.parentID).forEach(channel => channel.lockPermissions().catch(() => null))
            message.channel.send(client.language(`*Synchronisation de tous les salons du serveur terminée.*`, `*Synchronization of all server channels completed.*`));
        }
        else {
            const channel = message.mentions.channels.first() || message.guild.channels.get(args[0]) || message.channel
            
            if (channel.type === 'category'){
                channel.children.forEach((children) => children.lockPermissions().catch(() => null));
                message.channel.send(client.language(`*Synchronisation des salons de ${channel} terminée.*`, `*Synchronization of channels in ${channel} completed.*`));
            }
            else {
                channel.lockPermissions()
                .then( () => message.channel.send(client.language(`*Synchronisation du salon ${channel} terminée.*`, `*Synchronization of channel ${channel} completed.*`)))
                .catch(() => message.channel.send(client.language(`*Impossible de synchroniser le salon ${channel}.*`, `*Unable to sync channel ${channel}.*`)));
            }            
        }
    }
};
