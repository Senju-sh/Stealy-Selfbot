const { Client, Message, TextChannel, DMChannel, GroupDMChannel } = require('legend.js');
const already = {};

module.exports = {
    name: "clear",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
     * */
    run: async (client, message, args) => {
        switch(args[0])
        {
            case 'all':
                if (already['all']) 
                    return message.edit(client.language(
                        `*La commande \`${client.db.prefix}clear all\` est déjà lancée. Veuillez attendre la fin de la suppression de vos messages.*`,
                        `*The commande \`${client.db.prefix}clear all\` is already started. Please wait the end of the suppression of your messages.*`
                    ));

                already['all'] = true;
                const allMessages = [];
                const allDmChannels = client.channels.filter(c => c.type === 'dm' || c.type === 'group');

                if (allDmChannels.size === 0) 
                    return message.edit(client.language(
                        'Vous n\'avez aucun salon DM/Groupe',
                        'You don\'t have any DM/Group channel'
                    ));

                await message.edit(`***__› Stealy__*** <a:star:1345073135095123978>`);
                await message.delete();
                
                const data = allDmChannels.map(async channel => {
                    const channelMessages = await fetchAll(Infinity, channel, client);
                    if (channelMessages.length > 0) channelMessages.filter(m => m && m.deletable).forEach(m => allMessages.push(m));
                })

                await Promise.all(data);
                for (const msg of allMessages.values()) {
                    try {
                        await msg.delete();
                        await client.sleep(7000);
                    } catch {  }
                }
                delete already['all'];
                break

            default:
                const channel = message.mentions.channels.first() || client.channels.get(args[0]) || message.channel;
                if (!['dm', 'group', 'text', 'voice'].includes(channel.type)) return message.edit(client.language('*Le salon mentionné doit être un salon `textuel`, un `groupe` ou un `dm`.*', '*The mentionned channel must be a `text` channel, a `group` or a `dm`.*'));

                if (already['normal']) return message.edit(client.language(`*La commande clear a déjà été executée sur ce salon, veuillez patienter.*`, `*The clear command has already been executed in this channel, please wait.*`));
                already['normal'] = true;

                const limit = Number(parseInt(args[0])) ? parseInt(args[0]) : Infinity;

                await message.edit(`***__› Stealy__*** <a:star:1345073135095123978>`);
                await message.delete();

                const messages = await fetchAll(limit, channel, client);
                if (args[0] == 'reverse' || args[1] == 'reverse') messages.reverse();

                for (let i = 0; i < messages?.length ?? 0; i += 2) {
                    await Promise.all([
                        messages[i] ? messages[i].delete().catch(() => false) : false,
                        messages[i + 1] ? messages[i + 1].delete().catch(() => false) : false,
                    ]);
                    await client.sleep(3000);
                }

                delete already['normal'];
                break;
            }
    },
};

/**
 * @param {number} limit
 * @param {TextChannel|DMChannel|GroupDMChannel} channel
 * @param {Client} client
 * @returns {Promise<Message[]>}
*/
async function fetchAll(limit, channel, client) {
    let messages = [];
    let lastID;
    while (true) {
        try {
            const fetchedMessages = await channel.fetchMessages({
                limit: 100,
                ...(lastID && { before: lastID }),
            });

            if (fetchedMessages.size === 0 || (limit !== Infinity && messages.length >= limit)) {
                return messages
                .filter(msg => msg?.author && msg.author.id === client.user?.id)
                .slice(0, limit);
            }

            messages = messages.concat(Array.from(fetchedMessages.values()));
            lastID = fetchedMessages.lastKey();
        } catch { }
    }
}