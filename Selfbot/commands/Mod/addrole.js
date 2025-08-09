const { Client, Message } = require("legend.js");

module.exports = {
    name: "addrole",
    permission: "MANAGE_ROLES",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        const role = message.mentions.roles.first() || message.guild.roles.get(args[1]);       
        const reason = args[2] ? args.slice(2).join(" ") : client.language(`*Aucune raison spécifiée.*`, `*No reason specified.*`);

        if (!args[0] || !member) 
            return message.edit(client.language(
                `*Aucun utilisateur trouvé pour \`${args[0] || "rien"}\`.*`,
                `*No user found for \`${args[0] || "nothing"}\`.*`
            ));

        if (!role || !args[1]) 
            return message.edit(client.language(
                `*Aucun rôle trouvé pour \`${args[1] || "rien"}\`.*`, 
                `*No role found for \`${args[1] || "nothing"}\`.*`
            ));

        member.addRole(role.id, reason)
            .then(() => message.edit(client.language(`*Le rôle ${role.name} a été ajouté à ${member.user.tag}.*`, `*The role ${role.name} has been added to ${member.user.tag}.*`)))
            .catch(() => message.edit(client.language(`*Je ne peux pas ajouter le rôle ${role.name} à ${member.user.tag}.*`, `*I cannot add the role ${role.name} to ${member.user.tag}.*`)));
    }
};