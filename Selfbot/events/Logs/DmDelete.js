const { Message, Client } = require('legend.js');

module.exports = {
    name: "messageDelete",
    /**
     * @param {Message} message
     * @param {Client} client
    */
    run: async (message, client) => {
        if (!message || !message.channel || 
            !message.author || message.author.id === client.user.id) return;

        if (message.content?.includes(`<@${client.user.id}>`)){
            const embed = {
                author: { name: message.author.username, icon_url: message.author.avatarURL ?? null },
                footer: { text: `${message.author.username}`, icon_url: message.author.avatarURL ?? null },
                color: parseInt(client.db.log_color, 16),
                title: "***__› Ghostping Ping__*** <a:star:1345073135095123978>",
                timestamp: new Date().toISOString(),
                fields: [
                    { name: client.language('Auteur :', 'Author :'), value: `${message.author.username} (${message.author.id})` },
                    { name: client.language('Serveur :', 'Server :'), value: `${message.guild ? `${message.guild.name} (${message.guild.id})` : client.language(`Pas dans un serveur`, `Not in a server`)}` },
                    { name: client.language('Salon :', 'Channel :'), value: `${message.channel}` },
                    { name: 'Message :', value: `${message.content.length > 1024 ? `${message.content.substring(0, 1021)}...` : message.content}` },
                ]
            }

            if (client.db.logger.ghostpings.enable && client.db.logger.ghostpings.url) 
                client.log(client.db.logger.ghostpings.url, { embeds: [embed] });
        }




        if (!["dm", "group"].includes(message.channel.type)) return;
        const embed = {
            author: { name: message.author.username, icon_url: message.author.avatarURL ?? null },
            color: parseInt(client.db.log_color, 16),
            title: client.language(`***__› Message Supprimé__*** <a:star:1345073135095123978>`,`***__› Message Deleted__*** <a:star:1345073135095123978>`),
            description: message.content?.length > 1024 ? `${message.content.substring(0, 1021)}...` : message.content ?? client.language(`Aucun contenu`, `No content`),
            timestamp: new Date().toISOString(),
            fields: [],
            footer: { text: client.user.username, icon_url: client.user.avatarURL ?? null }
        }

        const attachments = new Array();
        for (const attachment of message.attachments.values()) 
            await client.upload(attachment.url)
                .then(i => attachments.push(i))
                .catch(() => attachments.push(attachment.url));

        embed.fields.push({ name: client.language("Fichiers", 'Files'), value: `${attachments.map((r, i) => `- [\`${client.language('Fichier', 'Files')} ${i+1}\`](${r})`).join('\n')}` })

        if (client.db.logger.message_delete) client.log(client.db.logger.message_delete, { embeds: [embed] });
    }
}