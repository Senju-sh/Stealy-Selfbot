const { Client, Message } = require('legend.js')

module.exports = {
    name: "delrole",
    permission: "MANAGE_ROLES",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        const role = message.mentions.roles.first() || message.guild.roles.get(args[1]);
        
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

        if (!member.roles.has(role.id))
            return message.edit(client.language(
                `*${member.user.tag} n'a pas le rôle ${role.name}.*`,
                `*${member.user.tag} does not have the role ${role.name}.*`
            ));

        
        member.removeRole(role.id)
            .then(() => message.edit(client.language(`*Le rôle ${role.name} a été retiré de ${member.user.tag}.*`, `*The role ${role.name} has been removed from ${member.user.tag}.*`)))
            .catch(() => message.edit(client.language(`*Erreur lors du retrait du rôle ${role.name} de ${member.user.tag}.*`, `*An error occurred while removing the role ${role.name} from ${member.user.tag}.*`)));
    }
};
