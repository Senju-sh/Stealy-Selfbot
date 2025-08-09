const { Permissions, Client, Message } = require('legend.js')
const permissions = [Permissions.FLAGS.ADMINISTRATOR, Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.MANAGE_ROLES, Permissions.FLAGS.MENTION_EVERYONE, Permissions.FLAGS.BAN_MEMBERS, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.MODERATE_MEMBERS, Permissions.FLAGS.MANAGE_GUILD]

module.exports = {
    name: "clearperms",
    permission: "MANAGE_ROLES",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        switch(args[0])
        {
            case 'bot':
                for (const member of message.guild.members.filter(m => m.user.bot).values()) 
                {
                    const roles = member.roles.filter(r => !permissions.includes(r.permissions));
                    member.setRoles(roles, "Stealy - Clear Perms");
                }
                
                for (const role of message.guild.roles.filter(r => r.managed).values())
                {
                    role.setPermissions(role.permissions.remove(permissions), "Stealy - Clear Perms")
                        .catch(() => false)
                }

                message.edit(client.language(
                    "*Toutes les permissions dangereuses ont été supprimées pour les bots.*",
                    "*All dangerous permissions have been removed for bots.*"
                ));
                break;

            default:
                for (const member of message.guild.members.values()) {
                    try {
                        const roles = member.roles.filter(r => !permissions.includes(r.permissions));
                        member.setRoles(roles, "Stealy - Clear Perms");
                    } catch { false }
                }
                for (const role of message.guild.roles.map(r => r)) {
                    try { role.setPermissions(role.permissions.remove(permissions), "Stealy - Clear Perms") } catch { false }
                }
                message.edit(client.language(
                    "*Toutes les permissions dangereuses ont été supprimées.*",
                    "*All dangerous permissions have been removed.*"
                ));
        }
    }
}