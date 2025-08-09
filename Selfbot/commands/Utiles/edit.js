const { Client, Message } = require('legend.js');
const already = {};

module.exports = {
    name: "edit",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        
        const limit = Number(parseInt(args[0])) ? parseInt(args[0]) : Infinity;
        const newText = args[1] ? args.slice(1).join(' ') : 
                        args[0] && limit  !== Infinity ? args.join(' ') : 
                        "***__› Stealy__***";

        if (already['edit'])
            return message.edit(client.language(
                '*La commande est déjà en cours d\'exécution dans ce salon. Veuillez patienter.*',
                '*The command is already running in this channel. Please wait.*'
            ));

        already[message.channel.id] = true;

        await message.edit(`***__› Stealy__*** <a:star:1345073135095123978>`);
        await message.delete();

        await editMessages(message.channel, limit, newText, client);
        delete already[message.channel.id];
    },
};

async function editMessages(channel, limit, newText, client) {
    const messages = await fetchAll(limit, channel, client);
    for (let i = 0; i < messages.length; i += 2) {
        try {
            await Promise.all([
                messages[i] ? messages[i].edit(newText) : false,
                messages[i + 1] ? messages[i + 1].edit(newText) : false,
            ]);
            await client.sleep(3000);
        } catch { }
    }
}

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