const { Client, Message } = require("legend.js")

module.exports = {
    name: "say",
    permission: "MANAGE_WEBHOOKS",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.get(args[0]) || await client.fetchUser(args[0] ?? 1).catch(() => false);

        if (!args[0] || !user)
            return message.edit(client.language(
                "*Veuillez mentionner un utilisateur.*",
                "*Please mention a user.*"
            ))

        if (!args[1])
            return message.edit(client.language(
                "*Veuillez me donner un texte à envoyer.*",
                "*Please give me a text to send.*"
            ))

        message.delete().catch(() => false)

        let webhooks = await message.channel.fetchWebhooks().catch(() => false)
        let webhook = webhooks?.first()

        if (!webhook) webhook = await message.channel.createWebhook(user.username, user.avatarURL).catch(() => false)
        if (webhook) webhook.send(args.slice(1).join(' '), { username: user.global_name ?? user.username, avatarURL: user.avatarURL ?? null }).catch(() => false)
    }
}