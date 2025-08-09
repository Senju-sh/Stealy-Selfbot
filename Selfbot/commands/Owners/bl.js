const { Client, Message } = require("legend.js");

module.exports = {
    name: "bl",
    premium: true,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {

        switch(args[0])
        {
            case 'list':
                if (client.db.blacklist.length === 0) 
                    return message.edit(client.language(
                        `*Il n'y a pas d'utilisateurs blacklistés.*`, 
                        `*There are no blacklisted users.*`
                    ));

				message.delete();
                client.send(message, client.db.blacklist.map((blData, i) => `\`${i+1}\` - <@${blData.id}> (\`${blData.id}\`) | \`${blData.reason ?? "Aucune raison"}\``).join('\n'));
                break;

            default:
                const user = message.mentions.users.first() || client.users.get(args[0]) || await client.fetchUser(args[0] ?? 1).catch(() => false);
                if (!args[0] || !user) 
                    return message.edit(client.language(
                        `*Veuillez mentionner un utilisateur.*`,
                        `* *Please ping a user.*`
                    ));

                if (client.db.blacklist.find(o => o.id === user.id))
                    return message.edit(client.language(
                        `*${user.username} est déjà blacklist.*`,
                        `*${user.username} is already blacklist.*`
                    ));

                if (client.config.owners.includes(user.id))
                    return message.edit(client.language(
                        `*Vous ne pouvez pas blacklist un owner.*`,
                        `*You cannot blacklist an owner.*`
                    ));
                    
                client.db.blacklist.push({ id: user.id, date: Date.now(), reason: args.slice(1).join(' ') || null });
                client.save();

                for (const guild of client.guilds.filter( g => g.me.permissions.has("BAN_MEMBERS")).values()){
                    try {
                        guild.ban(user, { reason: `${args[1] ? args.slice(1).join(' ') : "Stealy - Blacklist"}` })
                        await new Promise(r => setTimeout(r, 2000))
                    } catch { false }
                }

                message.edit(client.language(`*${user.username} a été blacklist ${args[1] ? `pour \`${args.slice(1).join(' ')}\`` : ""}.*`,`*${user.username} is blacklist ${args[1] ? `for \`${args.slice(1).join(' ')}\`` : ""}.*`))
                break;
        }
    }
}
