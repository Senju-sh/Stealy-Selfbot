const { Message, Client } = require('legend.js');

module.exports = {
    name: "messageUpdate",
    once: false,
    /**
     * @param {Message} oldMessage
     * @param {Message} newMessage
     * @param {Client} client
    */
    run: async (oldMessage, newMessage, client) => {
        if (!oldMessage || !newMessage || oldMessage.webhookId || 
            !oldMessage.author || !["dm", "group"].includes(oldMessage.channel.type) ||
            oldMessage.content === newMessage.content ||
            oldMessage.author.id === client.user.id
        ) return;

        const embed = {
            author: { name: oldMessage.author.username, icon_url: oldMessage.author.avatarURL },
            color: parseInt(client.db.log_color, 16),
            title: client.language(`***__› Message Modifié__*** <a:star:1345073135095123978>`,`***__› Message Updated__*** <a:star:1345073135095123978>`),
            fields: [
                { name: client.language('Ancien Message :', 'Old Message :'), value: oldMessage.content ? oldMessage.content?.length > 1024 ? `${oldMessage.content.substring(0, 1010)}...` : oldMessage.content : client.language('Aucun contenu', 'No content') },
                { name: client.language('Nouveau Message :', 'New Message :'), value: newMessage.content ? newMessage.content?.length > 1024 ? `${newMessage.content.substring(0, 1010)}...` : newMessage.content : client.language('Aucun contenu', 'No content') },
                { name: client.language('Salon :', 'Channel :'), value: `${oldMessage.channel}` }
            ],
            timestamp: new Date().toISOString(),
            footer: { text: `${client.user.username}`, icon_url: client.user.avatarURL ?? null }
        }

        if (client.db.logger.message_update.enable && client.db.logger.message_update.url) 
            client.log(client.db.logger.message_update.url, { embeds: [embed] })
    }
};