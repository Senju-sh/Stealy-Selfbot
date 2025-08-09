const { Client, Message } = require("legend.js");

module.exports = {
    name: "wb",
    permission: "MANAGE_WEBHOOKS",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message) => {
        const webhook = await message.channel.createWebhook("Stealy - Webhook").catch(() => false);

        if (webhook) 
            return message.edit(client.language(
                `*Le webhook a été crée : \`${webhook.url}\`*`,
                `*The webhook has been created : \`${webhook.url}\`*`
            ));
        
        return message.edit(client.language(
            "*Je ne peux pas crée de webhooks.*",
            "*I can't create webhooks.*"
        ))
    }
};