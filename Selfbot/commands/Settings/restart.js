const { Client, Message } = require('legend.js');

module.exports = {
    name: "restart",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        const token = client.token;

        await message.edit(client.language(
            `*Redémarrage en cours.*`,
            `*Restart in progress.*`
        ));

        client.destroy();
        await client.login(token);

        await message.edit(client.language(
            `*Redémarrage terminé <t:${Math.round((Date.now() + 30000) / 1000)}:R>.*`,
            `*Restart finish ${Math.round((Date.now() + 30000) / 1000)}.*`
        ));
    }
}