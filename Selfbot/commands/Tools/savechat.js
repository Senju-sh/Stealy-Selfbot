const { Client, Message } = require("legend.js");

module.exports = {
    name: "savechat",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        const channel = message.mentions.channels.first() || client.channels.get(args[0]) || message.channel;
        
        if (!channel) 
            return message.edit(client.language(
                "*Aucun salon de trouvé.*",
                "*No channel found.*"
            ));

        await message.delete().catch(() => false);
        const number = parseInt(args[1]) || Infinity;

        const allMessages = await fetchAll(number, channel, client);
        const results = allMessages
            .reverse()
            .slice(allMessages.length - number, allMessages.length)
            .map(msg => `Author : ${msg.author.username}\nContent : ${msg.content}\nDate : ${formatDateWithTime(msg.createdTimestamp)}\nAttachments : ${msg.attachments.size > 0 ? msg.attachments.first().url : "None"}\n-\n`)
            .join('\n');

        message.channel.send('', {
            files: [{
                attachment: Buffer.from(results, 'utf-8'),
                name: `savechat-${channel.id}.txt`
            }]
        });
    }
};

/**
 * @param {number} limit
 * @param {TextChannel|DMChannel|GroupDMChannel} channel
 * @param {Client} client
 * @returns {Promise<Message[]>}
*/
async function fetchAll(limit, channel, client) {
	const messages = [];
	let lastID;

	while (messages.length < limit) {
		try {
			const remainingToFetch = limit - messages.length;
			const fetchLimit = Math.min(100, remainingToFetch);
			
			const fetchedMessages = await channel.fetchMessages({
				limit: fetchLimit,
				...(lastID && { before: lastID }),
			}).catch(() => null);

			if (!fetchedMessages || fetchedMessages.size === 0)
				break;


			const messageArray = Array.from(fetchedMessages.values());
			messages.push(...messageArray);
			
			lastID = fetchedMessages.lastKey();
			
			} catch (error) {
				console.error('Erreur lors de la récupération des messages:', error);
			break;
		}
  	}

  	return messages
    	.filter(msg => msg?.author?.id === client.user?.id)
    	.slice(0, limit === Infinity ? messages.length : limit);
}

function formatDateWithTime(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
