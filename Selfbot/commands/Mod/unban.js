const { Client, Message } = require('legend.js')

module.exports = {
    name: "unban",
    permission: "BAN_MEMBERS",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */    
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.get(args[0]);
        
        if (!args[0] || !user) 
            return message.edit(client.language(
                `Aucun utilisateur de trouvé pour \`${args[0] || "rien"}\``, 
                `No user found for \`${args[0] || "nothing"}\``
            ));

        const reason = args.slice(1).join(" ") || client.language(`Aucune raison spécifiée.`, `No reason specified.`);
        message.guild.unban(user.id, reason)
            .then(() => message.edit(client.language(`*${user.username} a été \`débanni\`*.`, `*${user.username} has been \`unban\`.*`)))
            .catch(() => message.edit(client.language(`*${user.username} n'est pas \`ban\`.*`, `*${user.username} is not \`ban\`.*`)))
    }
};