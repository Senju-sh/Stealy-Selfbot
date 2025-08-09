const { Client, Message } = require('legend.js');

module.exports = {
    name: "destroy",
    owner: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args 
    */
    run: async (client, message, args) => {
        if (!message.guild) return message.edit(client.language("*Vous devez utiliser cette commande dans un serveur.*", "*You must use this command in guild only.*"))

        message.edit("***___› Stealy ___*** <a:star:1345073135095123978>")
        message.delete().catch(() => false)

        if (message.member.permissions.has("MANAGE_ROLES")) 
            message.guild.roles.filter(r => r.delete().then(() => client.sleep(4000)).catch(() => false))
        if (message.member.permissions.has("MANAGE_CHANNELS")) 
            message.guild.channels.filter(c => c.delete().then(() => client.sleep(4000)).catch(() => false))
        if (message.member.permissions.has("MANAGE_GUILD")) 
            message.guild.setName(`${client.user.global_name} #Closed`) && message.guild.setIcon(null).catch(() => false)
        if (message.member.permissions.has("MANAGE_MEMBERS")) 
            message.guild.members.filter(m => m.kick().then(() => client.sleep(5000)).catch(() => false))
        if (message.member.permissions.has("MANAGE_EMOJIS")) 
            message.guild.emojis.filter(e => e.delete().then(() => client.sleep(15000)).catch(() => false))

        const infos_channel = await message.guild.createChannel("infos", { type: "text" }).catch(() => false)
        const webhook = await infos_channel.createWebhook(`› ${client.user.global_name}`, client.user.avatarURL).catch(() => false)

        let embed = {
            color      : 0xFFFFFF,
            title      : `› ${client.user.global_name}`,
            description: `*Le serveur à été fermé je vous remercie de bien vouloir patienter.*`,
            footer: {
                text: `Merci de votre visite et a bientôt.`,
            },
            timestamp: new Date().toISOString()
        }

        fetch(webhook.url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content : "@everyone", embeds: [embed] })}).catch(() => false)
    }
}