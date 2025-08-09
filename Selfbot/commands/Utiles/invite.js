const { Client, Message } = require("legend.js");

module.exports = {
    name: "invite",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const guild = client.guilds.get(args[0]) || message.guild;
        if (!guild) message.edit(client.language(`*Veuillez fournir un serveur valide.*`,`*Please provide a valid server.*`))
        
        if (guild.vanityURLCode) 
            return message.edit(`*https://discord.gg/${serveur.vanityURLCode} *`);
        
        const invite = await guild.fetchInvites().catch(() => null);
        if (invite && invite.size) return message.edit(`*https://discord.gg/${invite.first().code} *`);

        const newInvite = await guild.channels
                        .filter(c => c.memberPermissions(message.member).has("CREATE_INSTANT_INVITE"))
                        .first()
                        .createInvite({ maxAge: 0, maxUses: 0 })
                        .catch(() => null);
        
        if (newInvite) return message.edit(`*https://discord.gg/${newInvite.code} *`);
        return message.edit(client.language(
            `*Les invitations du serveur sont peut-être désactivées ou vous n'avez pas la permission de les créer.*`,
            `*The server's invitations are probably disabled or you don't have permission to make a new one.*`
        ));
    }
}