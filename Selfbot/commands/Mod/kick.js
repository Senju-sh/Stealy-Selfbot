const { Client, Message } = require('legend.js')

module.exports = {
    name: "kick",
    permission: "KICK_MEMBERS",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {

        const member = message.mentions.members.first() || message.guild.members.get(args[0]) || await message.guild.fetchMember(args[0] ?? 1);
        const reason = args[1] ? args.slice(1).join(" ") : client.language(`Aucune raison spécifiée.`, `No reason specified.`);
        
        if (!member ||!args[0]) 
            return message.edit(client.language(
                `*Vous devez mentionner un utilisateur ou fournir un ID valide.*`,
                `*You must mention a user or provide a valid ID.*`
            ));

        member.kick(reason)
            .then(() => message.edit(client.language(`*${member} a été **expulsé** pour \`${reason}\`.*`, `*${member} has been **kicked** for \`${reason}\`.*`)))
            .catch(() => message.edit(client.language(`*Vous ne pouvez pas expulser ${member}.*`, `*You cannot kick ${member}.*`)));
    }
};
