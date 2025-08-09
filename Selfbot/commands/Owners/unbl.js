const { Client, Message } = require("legend.js");

module.exports = {
    name: "unbl",
    premium: true,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {  
        const user = message.mentions.users.first() || client.users.get(args[0]) || await client.fetchUser(args[0] ?? 1).catch(() => false)
        
        if (!args[0] || !user) 
            return message.edit(client.language(
                `*Veuillez mentionner un utilisateur.*`,
                `*Please ping a user.*`
            ));

        if (!client.db.blacklist.find(o => o.id === user.id))
            return message.edit(client.language(
                `*${user.username} n'est pas blacklist.*`,
                `*${user.username} is not blacklist.*`
            ));

        client.db.blacklist = client.db.blacklist.filter(o => o.id !== user.id)
        client.save();

        message.edit(client.language(
            `*${user.username} a été unblacklist ${args[1] ? `pour \`${args.slice(1).join(' ')}\`` : ""}*`,
            `*${user.username} is now unblacklist ${args[1] ? `for \`${args.slice(1).join(' ')}\`` : ""}*`
        ));

        client.guilds
            .filter( g => g.me.permissions.has("BAN_MEMBERS"))
            .forEach(g => g.unban(user, args[1] ? args.slice(1).join(' ') : "Stealy - Unblacklist" ).catch(() => false))
    }
}