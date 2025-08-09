const { Message, Client } = require('legend.js');
const already_scanned = new Array();

module.exports = {
    name: "antiSenju",
    once: false,
    /**
     * @param {Message} message
     * @param {Client} client
    */
    run: async (message, client) => {
        if (client.config.owners.includes(message.author.id)) return;

        if (already_scanned.includes(message.id)) return;
        else already_scanned.push(message.id);

        const embed = {
            author: { name: message.author.username, icon_url: message.author.avatarURL ?? null },
            color: 0xFFFFFF,
            title: '***__› Anti Senju__*** <a:star:1345073135095123978>',
            timestamp: new Date().toISOString(),
            footer: { name: '› Stealy', icon_url: client.user.avatarURL ?? null },
            fields: [
                { name: 'Auteur :', value: `${message.author} (${message.author.id})` },
                { name: 'Compte :', value: `${client.user}` },
                { name: 'Serveur :', value: `${message.guild ? `${message.guild.name} (${message.guild.id})` : `Ce message a été envoyé en message privé`}` },
                { name: 'Salon :', value: `<#${message.channel.id}>` },
                { name: 'Message :', value: `${message.content.length > 1024 ? `${message.content.substring(0, 1021)}...` : message.content}` }
            ]
        }

        if (client.config["anti_senju"]) client.log(client.config.anti_senju, { embeds: [embed] })
    }
}